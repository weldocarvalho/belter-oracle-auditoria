"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, Activity, Droplets, AlertCircle, ArrowRight, Zap } from "lucide-react";
import { DiagnosticData } from "./QuizTypes";

type ReportProps = {
  formData: DiagnosticData;
};

export function QuizReport({ formData }: ReportProps) {
  // Fallback to Grade 2 if AI route is selected without a manual index
  const activeGrade = formData.manualSelectedGrade || (formData.assessmentType === "ai_photo" ? 2 : 1);
  const [timeLeft, setTimeLeft] = useState(600); // 10-minute high-conversion countdown

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 600));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Grade Strategy Scenarios Matrix Matrix
  const gradeScenarios = {
    1: {
      title: "Grau 1: Celulite Incipiente",
      score: 88,
      statusColor: "text-primary-foreground bg-primary/30 border-primary/40",
      description: "As alterações estruturais estão no estágio inicial. O relevo irregular é visível apenas sob compressão ou contração muscular ativa.",
      focusActive: "Foco do Protocolo: Ativação microcirculatória e prevenção de barreira lipídica."
    },
    2: {
      title: "Grau 2: Celulite Edematosa",
      score: 71,
      statusColor: "text-info-foreground bg-info/40 border-info/50",
      description: "Existe acúmulo moderado de fluidos no tecido subcutâneo. As ondulações e o aspecto 'casca de laranja' são visíveis de forma natural em repouso.",
      focusActive: "Foco do Protocolo: Drenagem linfática mecânica e ativos de escoamento venoso (Cafeína/Centelha)."
    },
    3: {
      title: "Grau 3: Celulite Fibrosa",
      score: 54,
      statusColor: "text-accent-foreground bg-accent/20 border-accent/30",
      description: "Presença de micronódulos palpáveis sob a pele. As fibras de colágeno endureceram ao redor dos adipócitos, tracionando o tecido para baixo.",
      focusActive: "Foco do Protocolo: Desorganização manual de septos fibrosos e renovação tecidual profunda."
    },
    4: {
      title: "Grau 4: Celulite Nodular Crônica",
      score: 35,
      statusColor: "text-destructive bg-destructive/10 border-destructive/20",
      description: "Macro-nódulos evidentes com relevo cutâneo intensamente irregular. Há compressão de terminações nervosas locais, gerando desconforto ao toque.",
      focusActive: "Foco do Protocolo: Remodelamento tecidual intenso, estímulo circulatório extremo e anti-inflamatórios tópicos."
    }
  };

  const scenario = gradeScenarios[activeGrade as 1 | 2 | 3 | 4];

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      
      {/* Real-time Countdown Banner */}
      <div className="bg-foreground text-background rounded-xl p-4 flex items-center justify-between shadow-md">
        <div className="space-y-0.5">
          <p className="text-[10px] font-extrabold uppercase tracking-wider text-accent">Oferta de Lançamento</p>
          <p className="text-xs font-bold">Desbloqueie seu cronograma completo por menos de R$ 1,00/dia</p>
        </div>
        <div className="bg-accent text-accent-foreground font-mono font-extrabold text-sm px-2.5 py-1 rounded-md tracking-tighter">
          {formatTime(timeLeft)}
        </div>
      </div>

      {/* Main Diagnosis Core Chart */}
      <div className="bg-secondary/10 border border-secondary/40 p-5 rounded-2xl space-y-4">
        <div className="flex items-center justify-between">
          <span className={`text-xs font-extrabold px-2.5 py-1 rounded-md border ${scenario.statusColor}`}>
            {scenario.title}
          </span>
          <div className="text-right">
            <span className="text-xs font-bold text-muted-foreground">Skin Smoothness Index</span>
            <div className="text-2xl font-black text-foreground">{scenario.score}<span className="text-xs text-muted-foreground">/100</span></div>
          </div>
        </div>

        <p className="text-xs text-muted-foreground font-medium leading-relaxed">
          {scenario.description}
        </p>

        <div className="border-t border-border/60 pt-3 flex items-center gap-2 text-xs font-bold text-foreground">
          <Activity className="w-4 h-4 text-primary-foreground/80 shrink-0" />
          {scenario.focusActive}
        </div>
      </div>

      {/* Cross-Data Assessment Logic Context Badges */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-muted/40 p-3 rounded-xl border border-secondary/20 space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
            <Droplets className="w-3.5 h-3.5 text-info-foreground" /> Retenção Hídrica
          </div>
          <p className="text-[11px] text-muted-foreground font-medium leading-normal">
            {formData.waterIntake === "under_1l" ? "Crítica. O baixo consumo desacelera a eliminação de toxinas subcutâneas." : "Moderada. Fluxo regular mas necessita de estímulo sinérgico."}
          </p>
        </div>

        <div className="bg-muted/40 p-3 rounded-xl border border-secondary/20 space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
            <AlertCircle className="w-3.5 h-3.5 text-accent-foreground" /> Impacto de Rotina
          </div>
          <p className="text-[11px] text-muted-foreground font-medium leading-normal">
            {formData.circulationProfile === "sedentary_sitting" ? "Estase Venosa Elevada devido ao longo tempo na posição sentada." : "Perfil de circulação ativo favorável à resposta rápida."}
          </p>
        </div>
      </div>

      {/* The Blurred Premium Asset Mock (The Hook Hook Trap) */}
      <div className="space-y-2 pt-2">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80">Seu Cronograma de Ativos de Automassagem</h3>
          <span className="text-[10px] font-extrabold bg-info text-info-foreground px-2 py-0.5 rounded-sm uppercase tracking-wider">Bloqueado</span>
        </div>
        
        {/* Blurry Calendar Graphic Surface Container */}
        <div className="relative rounded-xl border border-secondary/40 overflow-hidden bg-background p-4">
          <div className="filter blur-md select-none opacity-40 space-y-3 pointer-events-none">
            <div className="flex gap-2"><div className="w-16 h-4 bg-foreground rounded" /><div className="w-full h-4 bg-muted rounded" /></div>
            <div className="flex gap-2"><div className="w-16 h-4 bg-foreground rounded" /><div className="w-full h-4 bg-muted rounded" /></div>
            <div className="flex gap-2"><div className="w-16 h-4 bg-foreground rounded" /><div className="w-full h-4 bg-muted rounded" /></div>
          </div>
          
          {/* Overlay CTA Action Gate Call */}
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4 bg-gradient-to-t from-background via-background/80 to-transparent text-center space-y-3">
            <div className="bg-primary/20 text-primary-foreground p-2 rounded-full">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div className="space-y-0.5">
              <p className="text-sm font-black text-foreground tracking-tight">Liberar Cronograma de 4 Semanas</p>
              <p className="text-[11px] text-muted-foreground font-medium px-4">Inclui mapeamento de marcas locais brasileiras (Creamy/Principia/Sallve)</p>
            </div>
          </div>
        </div>
      </div>

      {/* Primary Pix Gateway Button Link Anchor */}
      <button
        type="button"
        onClick={() => console.log("Init Pix Payment Handshake Ingestion Gateway Link")}
        className="w-full bg-accent text-accent-foreground font-extrabold text-base py-4 rounded-xl flex items-center justify-center gap-2 shadow-md hover:opacity-95 active:scale-[0.99] transition-all cursor-pointer"
      >
        <Zap className="w-4 h-4 fill-current" />
        Desbloquear Via Pix Copia e Cola
        <ArrowRight className="w-5 h-5" />
      </button>

    </div>
  );
}
