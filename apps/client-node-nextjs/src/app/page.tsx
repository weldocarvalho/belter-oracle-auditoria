"use client";

import React from "react";
import { Sparkles, ArrowRight, ShieldCheck, Zap, AlertCircle, CheckCircle2 } from "lucide-react";
import VisualStepper from "./components/VisualStepper";
import AppMockPreview from "./components/AppMockPreview";

export default function LandingPage() {
  
  const handleStartDiagnostic = () => {
    console.log("Analytics: Landing CTA clicked. Advancing seamlessly to Phase 2 Quiz.");
    // In a real implementation, you might want to track this event with an analytics service like Google Analytics or Mixpanel.
    // For example: analytics.track('Landing CTA Clicked', { source: 'Landing Page' });
    // Navigate to the diagnostic quiz page. In a Next.js app, you might use the useRouter hook for client-side navigation,
    // but for simplicity, we'll use window.location here.
    window.location.href = "/onboarding/diagnostic";
  };

  return (
    <div className="flex flex-col space-y-12 pt-4 pb-12 animate-fade-in">
      
      {/* 1. Hero Block & Strategic Value Hook */}
      <div className="space-y-6">
        <div className="flex justify-start">
          <div className="inline-flex items-center gap-1.5 bg-info/60 border border-info px-3 py-1 rounded-full text-xs font-semibold text-info-foreground shadow-sm">
            <Zap className="w-3.5 h-3.5 fill-current" />
            Acesso Digital Imediato via PIX
          </div>
        </div>

        <div className="space-y-4">
          <h1 className="text-3xl font-extrabold tracking-tight leading-[1.15] text-foreground">
            O protocolo de celulite de <span className="underline decoration-accent decoration-wavy decoration-2 underline-offset-4">grau dermatológico</span> pelo preço de uma máscara facial.
          </h1>
          <p className="text-base text-muted-foreground font-medium leading-relaxed">
            O esteticista digital movido a IA no seu bolso. Rotinas personalizadas e acompanhamento visual sem os custos abusivos de uma clínica.
          </p>
        </div>

        <div className="space-y-3">
          <button
            onClick={handleStartDiagnostic}
            className="w-full bg-accent text-accent-foreground font-bold text-base py-4 px-6 rounded-xl flex items-center justify-center gap-2 shadow-md hover:opacity-95 transition-all active:scale-[0.99] cursor-pointer pointer-coarse:py-5"
          >
            Criar Meu Protocolo Grátis
            <ArrowRight className="w-5 h-5" />
          </button>
          
          <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground/90 font-medium pt-1">
            <div className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-primary-foreground/70" />
              Anônimo e Seguro (LGPD)
            </div>
            <div className="w-1.5 h-1.5 bg-secondary rounded-full" />
            <div className="flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-primary-foreground/70" />
              Suporte IA Inteligente
            </div>
          </div>
        </div>
      </div>

      {/* 2. Isolated Product Interface Simulation Component */}
      <AppMockPreview />

      {/* 3. Problem Agitation Grid */}
      <div className="space-y-4">
        <div className="space-y-1">
          <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80">
            A Realidade do Mercado
          </h2>
          <p className="text-lg font-extrabold text-foreground tracking-tight">
            Por que continuar tentando adivinhar não funciona?
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3">
          <div className="p-4 bg-destructive/5 border border-destructive/10 rounded-xl flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <h4 className="text-sm font-bold text-foreground">Dicas Contraditórias da Internet</h4>
              <p className="text-xs text-muted-foreground font-medium leading-normal">
                Cada influenciador indica um produto diferente. Você gasta com cosméticos caros que não foram feitos para o seu grau de celulite.
              </p>
            </div>
          </div>

          <div className="p-4 bg-primary/10 border border-primary/20 rounded-xl flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-primary-foreground shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <h4 className="text-sm font-bold text-foreground">A Alternativa Digital Inteligente</h4>
              <p className="text-xs text-muted-foreground font-medium leading-normal">
                Nossa IA mapeia o relevo cutâneo para isolar o que o tecido realmente precisa: estímulo circulatório local, ativos de drenagem ou quebra de fibrose.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Interactive Step Progression Roadmap */}
      <VisualStepper />

      {/* 5. Sticky Re-Conversion Re-engagement Footer */}
      <div className="border-t border-border/40 pt-6 text-center space-y-4">
        <div className="space-y-1">
          <h3 className="text-base font-extrabold text-foreground tracking-tight">Pronta para ver a evolução da sua pele?</h3>
          <p className="text-xs text-muted-foreground font-medium">Inicie o diagnóstico mapeador agora mesmo sem custos.</p>
        </div>
        <button
          onClick={handleStartDiagnostic}
          className="w-full bg-accent text-accent-foreground font-bold text-sm py-4 rounded-xl flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.99] cursor-pointer"
        >
          Iniciar Diagnóstico Gratuito
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
}
