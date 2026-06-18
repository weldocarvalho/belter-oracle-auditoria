"use client";

import { useEffect, useState } from 'react';
import { Loader2, ShieldCheck, Layers, Award } from 'lucide-react';

const HIGHLIGHTS = [
  { title: "Segurança de Dados Ativa", desc: "Isolando metadados de imagem e gerando chave criptográfica.", icon: ShieldCheck },
  { title: "Estratificação Cutânea", desc: "Analisando variações microscópicas de relevo dérmico.", icon: Layers },
  { title: "Classificação Algorítmica", desc: "Mapeando densidade e profundidade de ondulações estruturais.", icon: Award }
];

export function ProcessingState() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % HIGHLIGHTS.length);
    }, 2200);
    return () => clearInterval(timer);
  }, []);

  const CurrentIcon = HIGHLIGHTS[activeIndex].icon;

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center max-w-sm mx-auto min-h-[340px] space-y-6">
      <div className="relative">
        <div className="h-16 w-16 rounded-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <CurrentIcon className="h-7 w-7 text-zinc-900 dark:text-zinc-50 transition-all duration-300 animate-pulse" />
        </div>
        <Loader2 className="absolute -bottom-1 -right-1 h-5 w-5 animate-spin text-zinc-900 dark:text-zinc-50 bg-white dark:bg-zinc-950 rounded-full" />
      </div>

      <div className="space-y-1.5 transition-all duration-500 transform ease-in-out">
        <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-50 tracking-tight">
          {HIGHLIGHTS[activeIndex].title}
        </h3>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-[280px] mx-auto">
          {HIGHLIGHTS[activeIndex].desc}
        </p>
      </div>

      {/* Progress visual feedback bar */}
      <div className="w-32 h-1 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
        <div 
          className="h-full bg-zinc-900 dark:bg-zinc-50 transition-all duration-500" 
          style={{ width: `${((activeIndex + 1) / HIGHLIGHTS.length) * 100}%` }}
        />
      </div>
    </div>
  );
}
