"use client";

import React, { useState, useEffect } from "react";
import { CheckCircle2, Copy, QrCode, ShieldCheck, Zap, Sparkles, Droplets, AlertTriangle } from "lucide-react";
import ConsolidatedAuthSheet from "../../../components/ConsolidatedAuthSheet";

export default function ReportPage() {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [quizData, setQuizData] = useState<any>(null);
  
  // Pix Key Placeholder for "Pix Copia e Cola"
  const mockPixKey = "00020101021126580014br.gov.bcb.pix0136e3b07384-d113-4c4e-9c8e-cfc49bf670d4520400005303986540419.905802BR5924SkinTreatmentMicroSaaS6009SaoPaulo62070503***6304E2A1";

  useEffect(() => {
    // Collect cached data from client storage safely inside the browser sandbox
    const localSession = localStorage.getItem("skin_tmp_session");
    if (localSession) {
      // For presentation purposes, we simulate the processed calculation results 
      // based on the choices selected back in Phase 2
      setQuizData({
        sessionId: localSession,
        hydrationScore: "42/100",
        circulationRisk: "Elevado",
        detectedGrade: "Grau 2 (Edematoso)",
        smoothnessIndex: "68/100"
      });
    }
  }, []);

  const handlePixUnlockClick = () => {
    if (!isAuthenticated) {
      // Intercept the payment action if the user has not signed up yet
      setIsAuthOpen(true);
    } else {
      console.log("Processing direct transaction request.");
    }
  };

  const handleAuthSuccess = async (authProfile: { email: string; provider: string }) => {
    setIsAuthOpen(false);
    setIsAuthenticated(true);

    // CONSOLIDATED HANDSHAKE: Package cached vectors and auth profile into one server request
    const outputPayload = {
      auth: authProfile,
      session: quizData?.sessionId,
      vectors: localStorage.getItem("skin_tmp_session_vectors") || {}
    };

    console.log("NestJS BFF Ingestion payload dispatched successfully:", outputPayload);
    // At this stage, NestJS creates the PostgreSQL User record, populates the vectors,
    // and returns the live Pix payload data asynchronously.
  };

  const handleCopyPix = () => {
    navigator.clipboard.writeText(mockPixKey);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="flex flex-col space-y-8 pt-4 pb-12 animate-fade-in">
      
      {/* 1. Header & Urgency Badge */}
      <div className="space-y-3 text-center">
        <div className="inline-flex items-center gap-1.5 bg-accent/20 border border-accent/40 px-3 py-1 rounded-full text-xs font-semibold text-accent-foreground shadow-xs">
          <Sparkles className="w-3.5 h-3.5" />
          Análise Concluída com Sucesso
        </div>
        <h1 className="text-2xl font-extrabold text-foreground tracking-tight leading-tight">
          Seu Relatório de Saúde Cutânea Está Pronto
        </h1>
      </div>

      {/* 2. Personalized Free Score Diagnostics Metrics Box */}
      <div className="bg-secondary/20 border border-secondary/40 rounded-2xl p-5 space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80 border-b border-secondary/40 pb-2">
          Mapeamento Biométrico Resumido
        </h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-background p-3 rounded-xl border border-border/40 shadow-2xs space-y-1">
            <span className="text-[10px] font-bold text-muted-foreground block">Índice de Suavidade</span>
            <span className="text-lg font-extrabold text-foreground tracking-tight">{quizData?.smoothnessIndex || "68/100"}</span>
          </div>
          <div className="bg-background p-3 rounded-xl border border-border/40 shadow-2xs space-y-1">
            <span className="text-[10px] font-bold text-muted-foreground block">Retenção de Líquidos</span>
            <span className="text-lg font-extrabold text-info-foreground tracking-tight flex items-center gap-1">
              <Droplets className="w-4 h-4 text-info-foreground" /> {quizData?.circulationRisk || "Elevado"}
            </span>
          </div>
        </div>

        <div className="bg-background p-3.5 rounded-xl border border-border/60 flex items-start gap-3">
          <AlertTriangle className="w-4 h-4 text-accent-foreground shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <h4 className="text-xs font-bold text-foreground">Classificação de Tecido: {quizData?.detectedGrade || "Grau 2"}</h4>
            <p className="text-[11px] text-muted-foreground leading-normal font-medium">
              Detectamos ondulações visíveis em repouso causadas por estagnação microcirculatória. Seu cronograma precisa focar em estímulo venoso.
            </p>
          </div>
        </div>
      </div>

      {/* 3. Transactional Action Block (The Core Paywall & Dynamic Pix Generator Grid) */}
      <div className="bg-background border-2 border-primary rounded-2xl p-5 shadow-md space-y-5 relative overflow-hidden">
        
        <div className="space-y-1">
          <span className="text-[10px] font-mono bg-info/60 text-info-foreground px-2 py-0.5 rounded font-bold uppercase tracking-wider">
            Acesso Vitalício Imediato
          </span>
          <h2 className="text-lg font-extrabold text-foreground tracking-tight pt-1">
            Desbloquear Protocolo Completo de 4 Semanas
          </h2>
          <p className="text-xs text-muted-foreground font-medium leading-relaxed">
            Tenha acesso ao calendário diário passo a passo de automassagem e indicações de ativos nacionais (Principia/Sallve) perfeitos para a sua pele.
          </p>
        </div>

        {!isAuthenticated ? (
          /* Locked State: Prompts the Consolidated Authentication Bottom Sheet first */
          <div className="space-y-3">
            <button
              onClick={handlePixUnlockClick}
              className="w-full bg-accent text-accent-foreground font-bold text-base py-4 px-6 rounded-xl flex items-center justify-center gap-2 shadow-md hover:opacity-95 transition-all active:scale-[0.99] cursor-pointer"
            >
              <Zap className="w-4 h-4 fill-current" />
              Desbloquear via Pix Copia e Cola
            </button>
            <p className="text-[10px] text-center text-muted-foreground/80 font-medium">
              Valor único de R$ 19,90. Sem assinaturas ou cobranças recorrentes.
            </p>
          </div>
        ) : (
          /* Unlocked State: Reveals the real-time calculated Pix layout interface components */
          <div className="space-y-5 pt-1 animate-fade-in">
            {/* Visual QR Code Wrapper Canvas Container */}
            <div className="w-44 h-44 bg-muted border border-border rounded-xl mx-auto flex flex-col items-center justify-center p-3 shadow-inner relative group">
              <QrCode className="w-full h-full text-foreground/80" strokeWidth={1.5} />
              <div className="absolute inset-0 bg-background/90 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-4 text-center">
                <span className="text-[10px] font-bold text-foreground leading-normal">Escaneie o QR Code no aplicativo do seu banco</span>
              </div>
            </div>

            {/* Pix Copy and Paste Dynamic Button Input element */}
            <div className="space-y-2.5">
              <button
                onClick={handleCopyPix}
                className="w-full bg-foreground text-background font-bold text-sm py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.99] cursor-pointer"
              >
                <Copy className="w-4 h-4" />
                {isCopied ? "Copiado!" : "Copiar Código Pix Copia e Cola"}
              </button>
              
              <div className="flex items-center justify-center gap-2 text-[11px] font-semibold text-primary-foreground">
                <div className="w-2 h-2 bg-primary rounded-full animate-ping" />
                Aguardando confirmação do pagamento...
              </div>
            </div>
          </div>
        )}

        {/* Dynamic real-time WebSockets synchronization disclaimer notice */}
        <div className="border-t border-secondary/60 pt-3.5 flex items-center gap-2 text-[10px] text-muted-foreground font-medium">
          <ShieldCheck className="w-4 h-4 text-primary-foreground shrink-0" />
          Seu painel será atualizado automaticamente assim que o PIX for detectado.
        </div>
      </div>

      {/* 4. Bottom Sheet Registration Gate Wrapper */}
      <ConsolidatedAuthSheet 
        isOpen={isAuthOpen} 
        onClose={setIsAuthOpen} 
        onSuccess={handleAuthSuccess} 
      />

    </div>
  );
}
