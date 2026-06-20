"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { AnalysisResult, OnboardingState } from '../types';
import { optimizePhoto } from '../services/imageOptimizer';

interface PhotoScoringConfig {
  bffUrl: string;
  wsUrl: string;
  userId: string;
}

export function usePhotoScoring({ bffUrl, wsUrl, userId }: PhotoScoringConfig) {
  const [currentState, setCurrentState] = useState<OnboardingState>('IDLE');
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  // Safely teardown WebSocket connections to prevent memory leaks
  const cleanupWebSocket = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
  }, []);

  const connectToPipelineSocket = useCallback(() => {
    cleanupWebSocket();
    
    const ws = new WebSocket(`${wsUrl}?userId=${userId}`);
    wsRef.current = ws;

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        // Explicit event routing matching your .NET infrastructure pattern
        if (data.event === 'skin.analysis.completed') {
          setAnalysis(data.payload);
          setCurrentState('COMPLETED');
          cleanupWebSocket();
        }
      } catch (err) {
        setErrorMessage('Erro ao ler atualização em tempo real.');
        setCurrentState('ERROR');
      }
    };

    ws.onerror = () => {
      setErrorMessage('Conexão instável. Aguardando servidor...');
    };
  }, [wsUrl, userId, cleanupWebSocket]);

  const processCapturedPhoto = async (rawBlob: Blob) => {
    setCurrentState('UPLOADING');
    setErrorMessage(null);

    try {
      // 1. Client-side performance optimization
      const optimizedBlob = await optimizePhoto(rawBlob);

      // 2. Request short-lived secure upload credential from NestJS BFF
      const tokenResponse = await fetch(`${bffUrl}/api/v1/photo-scoring/presigned-url`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ patientId: userId, fileType: 'image/jpeg' }),
      });
      
      if (!tokenResponse.ok) throw new Error('Não foi possível autorizar o envio seguro.');
      const { uploadUrl, fileKey } = await tokenResponse.json();

      // 3. Direct R2 upload (bypassing backend CPU cycles entirely)
      const r2Response = await fetch(uploadUrl, {
        method: 'PUT',
        headers: { 'Content-Type': 'image/jpeg' },
        body: optimizedBlob,
      });

      if (!r2Response.ok) throw new Error('Falha ao transferir imagem para o cofre seguro.');

      // 4. Initialize real-time listening socket before firing backend event
      connectToPipelineSocket();
      setCurrentState('PROCESSING');

      // 5. Fire asynchronous event routing trigger to RabbitMQ through BFF
      const pipelineTrigger = await fetch(`${bffUrl}/api/v1/photos/process`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, fileKey }),
      });

      if (!pipelineTrigger.ok) throw new Error('Erro ao enfileirar processamento inteligente.');

    } catch (err: any) {
      setErrorMessage(err.message || 'Erro crítico durante a execução do pipeline.');
      setCurrentState('ERROR');
      cleanupWebSocket();
    }
  };

  useEffect(() => {
    return () => cleanupWebSocket();
  }, [cleanupWebSocket]);

  return {
    currentState,
    setCurrentState,
    analysis,
    errorMessage,
    processCapturedPhoto,
    resetPipeline: () => {
      setAnalysis(null);
      setErrorMessage(null);
      setCurrentState('IDLE');
    }
  };
}
