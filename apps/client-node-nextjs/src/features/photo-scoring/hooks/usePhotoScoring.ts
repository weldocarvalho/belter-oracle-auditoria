"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { AnalysisResult, OnboardingState } from '../types';
import { optimizePhoto } from '../services/imageOptimizer';
import { apiFetch, buildWsUrl, getSessionUser } from '@/lib/auth';

export function usePhotoScoring() {
  const [currentState, setCurrentState] = useState<OnboardingState>('IDLE');
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  const cleanupWebSocket = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
  }, []);

  const connectToPipelineSocket = useCallback(() => {
    cleanupWebSocket();

    const ws = new WebSocket(buildWsUrl());
    wsRef.current = ws;

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.event === 'skin.analysis.completed') {
          setAnalysis(data.payload);
          setCurrentState('COMPLETED');
          cleanupWebSocket();
        }
      } catch {
        setErrorMessage('Erro ao ler atualização em tempo real.');
        setCurrentState('ERROR');
      }
    };

    ws.onerror = () => {
      setErrorMessage('Conexão instável. Aguardando servidor...');
    };
  }, [cleanupWebSocket]);

  const processCapturedPhoto = async (rawBlob: Blob) => {
    const user = getSessionUser();
    if (!user) {
      setErrorMessage('Faça login para iniciar o escaneamento.');
      setCurrentState('ERROR');
      return;
    }

    setCurrentState('UPLOADING');
    setErrorMessage(null);

    try {
      const optimizedBlob = await optimizePhoto(rawBlob);

      const presignResponse = await apiFetch<{ uploadUrl: string; fileKey: string }>(
        '/api/v1/photo-scoring/presigned-url',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ fileType: 'image/jpeg' }),
        },
      );

      const r2Response = await fetch(presignResponse.uploadUrl, {
        method: 'PUT',
        headers: { 'Content-Type': 'image/jpeg' },
        body: optimizedBlob,
      });

      if (!r2Response.ok) throw new Error('Falha ao transferir imagem para o cofre seguro.');

      connectToPipelineSocket();
      setCurrentState('PROCESSING');

      const pipelineTrigger = await apiFetch<{ success: boolean; status: string }>(
        '/api/v1/photos/process',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ fileKey: presignResponse.fileKey }),
        },
      );

      if (!pipelineTrigger.success) throw new Error('Erro ao enfileirar processamento inteligente.');
    } catch (err) {
      setErrorMessage(
        err instanceof Error
          ? err.message
          : "Erro crítico durante a execução do pipeline.",
      );
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
