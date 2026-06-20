"use client";

import React, { useState } from "react";
import { Sparkles, ArrowRight, ShieldCheck, Zap, Layers } from "lucide-react";
import VisualStepper from "./components/VisualStepper";
import AuthBottomSheet from "./components/AuthBottomSheet";

export default function LandingPage() {
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // Trigger for the bottom sheet auth gate (Phase 1, Step 4)
  const handleOpenAuth = () => {
    setIsAuthOpen(true);
    // Dynamic entrypoint for analytics tracing later
    console.log("Analytics: Landing CTA clicked, initializing Phase 1 Auth Sheet.");
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

      {/* 3. Primary Conversion Call-to-Action (CTA) */}
      <div className="space-y-3">
        <button
          onClick={handleOpenAuth}
          className="w-full bg-accent text-accent-foreground font-bold text-base py-4 px-6 rounded-xl flex items-center justify-center gap-2 shadow-md hover:opacity-95 transition-all active:scale-[0.99] pointer-coarse:py-4.5"
        >
          Criar Meu Protocolo Grátis
          <ArrowRight className="w-5 h-5" />
        </button>
        
        {/* Trust Signals Underneath Button */}
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

      {/* 4. NEW: "How It Works" Visual Stepper Component Insertion */}
      <VisualStepper />

      {/* 5. Mini Institutional Social Proof Context Card */}
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

       {/* 6. Production-Grade Bottom Sheet Integration */}
      <AuthBottomSheet isOpen={isAuthOpen} onClose={setIsAuthOpen} />

      {/* Temporary Auth Overlay Logic Mock (To be upgraded with standard Shadcn Sheet) */}
      {isAuthOpen && (
        <div className="fixed inset-0 bg-foreground/30 backdrop-blur-sm z-50 flex items-end justify-center">
          <div className="bg-background w-full max-w-md rounded-t-2xl p-6 space-y-4 animate-slide-up border-t border-border shadow-xl">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold text-foreground">Comece seu diagnóstico</h2>
              <button 
                onClick={() => setIsAuthOpen(false)}
                className="text-xs font-bold text-muted-foreground hover:text-foreground p-1"
              >
                Fechar
              </button>
            </div>
            <p className="text-xs text-muted-foreground font-medium">
              Próximo passo: **O Diagnóstico** (Quiz interativo de 3 minutos). Inscreva-se para salvar seu progresso de forma totalmente segura.
            </p>
            {/* The rest of the form hooks will inject here under Section 5 of the epic */}
            <div className="h-20 bg-muted/50 rounded-xl border border-dashed flex items-center justify-center text-xs text-muted-foreground">
              Campos de Autenticação (Google / Apple / Email)
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
