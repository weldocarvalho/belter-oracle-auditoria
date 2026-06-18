"use client";

import { AnalysisResult } from '../types';
import { Button } from '@/components/ui/button';
import { Sparkles, QrCode, ArrowRight, ShieldCheck } from 'lucide-react';

interface ResultsDisplayProps {
  result: AnalysisResult;
  onRestart: () => void;
}

export function ResultsDisplay({ result, onRestart }: ResultsDisplayProps) {
  // Visual dictionary grouping grading scales dynamically
  const gradeSystem = {
    1: { name: "Grau 1 (Leve)", color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200" },
    2: { name: "Grau 2 (Moderado)", color: "text-amber-600 bg-amber-50 dark:bg-amber-950/30 border-amber-200" },
    3: { name: "Grau 3 (Avançado)", color: "text-orange-600 bg-orange-50 dark:bg-orange-950/30 border-orange-200" },
    4: { name: "Grau 4 (Severo)", color: "text-rose-600 bg-rose-50 dark:bg-rose-950/30 border-rose-200" }
  };

  const activeGrade = gradeSystem[result.cellulite_grade];

  return (
    <div className="w-full max-w-xl mx-auto space-y-6 animate-fade-in">
      {/* Classification Anchor */}
      <div className={`p-6 rounded-2xl border text-center ${activeGrade.color}`}>
        <span className="text-[10px] font-bold uppercase tracking-widest opacity-70">Resultado Intermediário</span>
        <h2 className="text-3xl font-black tracking-tight mt-1">{activeGrade.name}</h2>
        <p className="text-[11px] mt-1.5 opacity-80 font-mono">Confiabilidade da Varredura: {(result.confidence_score * 100).toFixed(0)}%</p>
      </div>

      {/* Metric Breakdown Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        {[
          { title: "Densidade de Irregularidade", val: result.metrics.dimple_count_density },
          { title: "Flacidez Tecidual", val: result.metrics.skin_laxity },
          { title: "Deficit de Microcirculação", val: result.metrics.microcirculation_index }
        ].map((item, idx) => (
          <div key={idx} className="bg-zinc-50 border border-zinc-200 dark:bg-zinc-900/50 dark:border-zinc-800 p-4 rounded-xl">
            <p className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400 leading-snug">{item.title}</p>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">{item.val}</span>
              <span className="text-[10px] text-zinc-400">/100</span>
            </div>
            <div className="w-full h-1 bg-zinc-200 dark:bg-zinc-800 rounded-full mt-2 overflow-hidden">
              <div className="h-full bg-zinc-700 dark:bg-zinc-400" style={{ width: `${item.val}%` }} />
            </div>
          </div>
        ))}
      </div>

      {/* Mathematical Clinical Verdict */}
      <div className="bg-white border border-zinc-200 dark:bg-zinc-950 dark:border-zinc-800 p-5 rounded-xl space-y-2.5">
        <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-50 flex items-center gap-1.5 uppercase tracking-wider">
          <Sparkles className="h-4 w-4 text-amber-500" /> Justificativa de Diagnóstico Digital
        </h4>
        <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400 font-normal">
          {result.clinical_justification}
        </p>
      </div>

      {/* Contextual Premium Conversion Offer */}
      <div className="bg-gradient-to-br from-zinc-950 to-zinc-900 text-white p-6 rounded-2xl border border-zinc-800 space-y-4 shadow-xl">
        <div className="space-y-1">
          <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest bg-emerald-950/60 border border-emerald-800/80 px-2 py-0.5 rounded-full">
            Estratégia Recomendada
          </span>
          <h4 className="text-lg font-bold tracking-tight pt-1">
            Liberar Cronograma Corretivo Grau {result.cellulite_grade}
          </h4>
          <p className="text-xs text-zinc-400 leading-normal">
            Acesse seu plano de 4 semanas contendo indicações de dermocosméticos nacionais acessíveis, técnicas de automassagem e metas diárias de circulação.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row gap-3 items-center justify-between border-t border-zinc-800">
          <div className="flex items-center gap-2 text-zinc-400 text-xs">
            <ShieldCheck className="h-4 w-4 text-emerald-400" /> Acesso imediato via PIX
          </div>
          <Button className="bg-emerald-500 hover:bg-emerald-600 text-zinc-950 font-bold w-full sm:w-auto px-5 rounded-xl shadow-lg shadow-emerald-500/10 flex items-center justify-center gap-2">
            Desbloquear Protocolo <QrCode className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="text-center">
        <button onClick={onRestart} className="text-xs font-medium text-zinc-400 hover:text-zinc-600 transition-colors">
          Refazer Captura de Diagnóstico
        </button>
      </div>
    </div>
  );
}
