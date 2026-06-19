"use client";

import { useState, useRef, useEffect } from 'react';
import { Camera, ShieldCheck, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CameraCaptureProps {
  onCaptureReady: (blob: Blob) => void;
  onCancel: () => void;
}

export function CameraCapture({ onCaptureReady, onCancel }: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isCameraReady, setIsCameraReady] = useState(false);

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ 
      video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } } 
    })
    .then((mediaStream) => {
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        setIsCameraReady(true);
      }
    })
    .catch(() => {
      alert('Por favor, autorize o acesso à câmera para prosseguir com o escaneamento.');
      onCancel();
    });

    return () => {
      if (stream) stream.getTracks().forEach(track => track.stop());
    };
  }, []);

  const triggerCapture = () => {
    if (!videoRef.current || !isCameraReady) return;

    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      // Draw frame perfectly match original raw dimensions
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((blob) => {
        if (blob) {
          if (stream) stream.getTracks().forEach(t => t.stop());
          onCaptureReady(blob);
        }
      }, 'image/jpeg', 0.95);
    }
  };

  return (
    <div className="relative w-full max-w-md mx-auto aspect-[3/4] rounded-3xl overflow-hidden bg-zinc-950 shadow-2xl border border-zinc-800">
      <video 
        ref={videoRef} 
        autoPlay 
        playsInline 
        className="w-full h-full object-cover transform scale-x-[-1]"
      />
      
      {/* Privacy Anchor Banner: Builds implicit trust without friction */}
      <div className="absolute top-4 inset-x-4 bg-zinc-900/80 backdrop-blur-md border border-zinc-700/50 rounded-xl p-3 flex items-start gap-2.5 z-10">
        <ShieldCheck className="h-4 w-4 text-emerald-400 mt-0.5 shrink-0" />
        <p className="text-[11px] leading-normal text-zinc-300">
          **Ambiente Seguro LGPD**: Suas fotos passam por criptografia ponta a ponta e nunca serão exibidas publicamente.
        </p>
      </div>

      {/* Clinical Guide Mask Overlay */}
      <div className="absolute inset-0 border-[24px] border-black/40 pointer-events-none flex items-center justify-center">
        <div className="w-[85%] h-[70%] border-2 border-dashed border-white/70 rounded-[30%] flex flex-col items-center justify-between p-6">
          <div className="bg-black/60 backdrop-blur-sm rounded-lg px-2.5 py-1 text-[10px] text-zinc-300 font-medium tracking-wide flex items-center gap-1">
            <HelpCircle className="h-3 w-3 text-secondary" /> Iluminação Direta
          </div>
          <p className="text-white text-[11px] font-medium text-center bg-zinc-900/90 border border-zinc-700 px-3 py-1.5 rounded-full shadow-md">
            Centralize a área desejada aqui a 30cm de distância
          </p>
        </div>
      </div>

      {/* Shutter Interface Bar */}
      <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-black/80 to-transparent flex items-center justify-between px-8 z-10">
        <button onClick={onCancel} className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">
          Cancelar
        </button>
        
        <Button 
          onClick={triggerCapture} 
          disabled={!isCameraReady}
          className="h-16 w-16 rounded-full bg-white hover:bg-zinc-100 border-4 border-zinc-300/50 flex items-center justify-center transition-all active:scale-95 disabled:opacity-50"
          size="icon"
        >
          <Camera className="h-7 w-7 text-zinc-900" />
        </Button>
        
        <div className="w-12" /> {/* Layout structural balancer */}
      </div>
    </div>
  );
}
