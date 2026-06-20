"use client";

import React from "react";
import { Calendar, CheckCircle2, TrendingUp } from "lucide-react";

export default function AppMockPreview() {
  return (
    <div className="space-y-4 animate-fade-in">
      <div className="space-y-1">
        <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80">
          Por Dentro da Tecnologia
        </h2>
        <p className="text-lg font-extrabold text-foreground tracking-tight">
          Seu cronograma e evolução na palma da mão
        </p>
      </div>

      {/* Pure Tailwind Simulator Box */}
      <div className="w-full bg-secondary/10 border border-border/60 rounded-2xl p-4 shadow-inner space-y-4 relative overflow-hidden">
        
        {/* Mock Top bar Header */}
        <div className="flex justify-between items-center border-b border-border/30 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            <span className="text-xs font-bold text-foreground">Meu Cronograma Ativo</span>
          </div>
          <span className="text-[10px] font-mono bg-info/40 text-info-foreground px-2 py-0.5 rounded font-bold">
            Semana 1/4
          </span>
        </div>

        {/* Feature 1: The Interactive Treatment Calendar */}
        <div className="bg-background border border-border/40 p-3 rounded-xl space-y-2.5 shadow-sm">
          <div className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground">
            <Calendar className="w-3.5 h-3.5 text-primary-foreground" />
            Rotina de Hoje (Automassagem + Ativos)
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-2 bg-secondary/20 rounded-lg border border-secondary/30">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary-foreground" />
                <span className="text-xs font-bold text-foreground">Manhã: Loção com Vitamina C Corporal</span>
              </div>
            </div>
            <div className="flex items-center justify-between p-2 bg-background border border-border rounded-lg shadow-2xs">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full border border-border shrink-0" />
                <span className="text-xs font-bold text-foreground">Noite: 5 min Massagem Modeladora</span>
              </div>
              <span className="text-[10px] font-mono text-muted-foreground font-bold">10s GIF</span>
            </div>
          </div>
        </div>

        {/* Feature 2: Skin Smoothness Analytics Trend Curve */}
        <div className="bg-background border border-border/40 p-3 rounded-xl space-y-3 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground">
              <TrendingUp className="w-3.5 h-3.5 text-accent-foreground" />
              Índice de Suavidade da Pele
            </div>
            <span className="text-xs font-extrabold text-foreground bg-primary/20 px-2 py-0.5 rounded-sm">
              +14% de Melhora
            </span>
          </div>
          
          {/* Native CSS Bar Metrics Chart Matrix */}
          <div className="h-16 w-full flex items-end gap-2 pt-2 px-2 border-b border-dashed border-border/80">
            <div className="w-full bg-secondary h-[40%] rounded-t-sm relative">
              <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-[9px] font-mono text-muted-foreground font-bold">Dia1</span>
            </div>
            <div className="w-full bg-secondary h-[45%] rounded-t-sm relative">
              <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-[9px] font-mono text-muted-foreground font-bold">Dia7</span>
            </div>
            <div className="w-full bg-accent h-[75%] rounded-t-sm relative">
              <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-[9px] font-mono text-accent-foreground font-bold">Dia14</span>
            </div>
            <div className="w-full bg-primary h-[90%] rounded-t-sm relative">
              <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-[9px] font-mono text-primary-foreground font-bold">Meta</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
