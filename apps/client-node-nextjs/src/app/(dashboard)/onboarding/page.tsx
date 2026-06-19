"use client";

import { usePhotoScoring } from '@/features/photo-scoring/hooks/usePhotoScoring';
import { CameraCapture } from '@/features/photo-scoring/components/CameraCapture';
import { ProcessingState } from '@/features/photo-scoring/components/ProcessingState';
import { ResultsDisplay } from '@/features/photo-scoring/components/ResultsDisplay';
import { Button } from '@/components/ui/button';
import { Sparkles, ArrowRight } from 'lucide-react';

export default function OnboardingPage() {
  const { 
    currentState, 
    setCurrentState, 
    processCapturedPhoto, 
    analysis, 
    errorMessage, 
    resetPipeline 
  } = usePhotoScoring({
    bffUrl: process.env.NEXT_PUBLIC_BFF_URL || 'http://localhost:3333',
    wsUrl: process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3333',
    userId: 'usr_prod_01j5x' // Map token contextual subject identifier here later
  });

  return (
    <main className="container max-w-4xl mx-auto px-4 py-12 flex flex-col items-center justify-center min-h-[85vh]">
      
      {/* Dynamic Header State Control */}
      {currentState !== 'COMPLETED' && (
        <div className="w-full max-w-md text-center mb-8 space-y-2">
          <h1 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">
            Scanner de Textura Cutânea
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-xs mx-auto leading-normal">
            Obtenha uma classificação matemática objetiva sobre o estado da sua pele em segundos.
          </p>
        </div>
      )}

      {/* Exception Fallback Display */}
      {errorMessage && (
        <div className="mb-6 p-3.5 text-xs font-medium rounded-xl bg-rose-50 text-rose-600 border border-rose-100 w-full max-w-md">
          ⚠️ {errorMessage}
        </div>
      )}

      {/* State Machine UI Routing Matrix */}
      {currentState === 'IDLE' && (
        <div className="text-center p-8 bg-zinc-50 dark:bg-zinc-900/40 rounded-3xl border border-zinc-200/60 dark:border-zinc-800 max-w-md w-full shadow-sm">
          <div className="h-10 w-10 bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-sm">
            <Sparkles className="h-5 w-5" />
          </div>
          <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-50 uppercase tracking-wider">Análise Inicial</h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 mb-6 leading-relaxed">
            Prepare-se para capturar uma foto nítida e bem iluminada da região desejada.
          </p>
          <Button onClick={() => setCurrentState('CAMERA_ACTIVE')} size="lg" className="w-full font-bold tracking-wide rounded-xl group">
            Iniciar Escaneamento <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-0.5 transition-transform" />
          </Button>
        </div>
      )}

      {currentState === 'CAMERA_ACTIVE' && (
        <CameraCapture 
          onCaptureReady={processCapturedPhoto} 
          onCancel={resetPipeline} 
        />
      )}

      {(currentState === 'UPLOADING' || currentState === 'PROCESSING') && (
        <ProcessingState />
      )}

      {currentState === 'COMPLETED' && analysis && (
        <ResultsDisplay result={analysis} onRestart={resetPipeline} />
      )}

      {currentState === 'ERROR' && (
        <Button onClick={resetPipeline} variant="outline" className="rounded-xl">
          Tentar Novamente
        </Button>
      )}
    </main>
  );
}
