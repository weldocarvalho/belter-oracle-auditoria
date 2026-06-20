"use client";

import React from "react";
import { Sparkles, ArrowRight, ShieldCheck, Zap, Layers } from "lucide-react";
import VisualStepper from "./components/VisualStepper";

export default function LandingPage() {
  
  const handleStartDiagnostic = () => {
    console.log("Analytics: Landing CTA clicked. Advancing seamlessly to Phase 2 Quiz.");
    // Push the user directly into the zero-friction interactive diagnostic route
    window.location.href = "/onboarding/diagnostic";
  };

  return (
    <div className="flex flex-col space-y-8 pt-4 pb-12 animate-fade-in">
      
      {/* 1. Flash Conversion Badge */}
      <div className="flex justify-start">
        <div className="inline-flex items-center gap-1.5 bg-info/60 border border-info px-3 py-1 rounded-full text-xs font-semibold text-info-foreground shadow-sm">
          <Zap className="w-3.5 h-3.5 fill-current" />
          Acesso Digital Imediato via PIX
        </div>
      </div>

      {/* 2. Premium Hero Typography Stack & UVP */}
      <div className="space-y-4">
        <h1 className="text-3xl font-extrabold tracking-tight leading-[1.15] text-foreground">
          O protocolo de celulite de <span className="underline decoration-accent decoration-wavy decoration-2 underline-offset-4">grau dermatológico</span> pelo preço de uma máscara facial.
        </h1>
        <p className="text-base text-muted-foreground font-medium leading-relaxed">
          O esteticista digital movido a IA no seu bolso. Rotinas personalizadas e acompanhamento visual sem os custos de uma clínica.
        </p>
      </div>

      {/* 3. Primary Conversion Call-to-Action (CTA) - Pushes directly to Phase 2 */}
      <div className="space-y-3">
        <button
          onClick={handleStartDiagnostic}
          className="w-full bg-accent text-accent-foreground font-bold text-base py-4 px-6 rounded-xl flex items-center justify-center gap-2 shadow-md hover:opacity-95 transition-all active:scale-[0.99] cursor-pointer pointer-coarse:py-5"
        >
          Criar Meu Protocolo Grátis
          <ArrowRight className="w-5 h-5" />
        </button>
        
        {/* Trust Signals */}
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

      {/* 4. "How It Works" Visual Stepper */}
      <VisualStepper />

      {/* 5. Institutional Social Proof Context Card */}
      <div className="bg-secondary/40 border border-secondary p-4 rounded-xl flex items-start gap-3.5">
        <div className="bg-primary/50 text-primary-foreground p-2 rounded-lg mt-0.5 shrink-0">
          <Layers className="w-5 h-5" />
        </div>
        <div className="space-y-1">
          <h3 className="text-sm font-bold text-foreground">
            Baseado na Ciência da Pele
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed font-medium">
            Desenvolvido para mapear e classificar o relevo da pele (Graus 1 a 4) gerando cronogramas dinâmicos de automassagem e ativos tópicos locais.
          </p>
        </div>
      </div>

    </div>
  );
}
