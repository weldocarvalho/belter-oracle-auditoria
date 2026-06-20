"use client";

import React from "react";
import { Droplets, Briefcase, Layers } from "lucide-react";
import { DiagnosticData, StepKeys } from "./QuizTypes";

type StepProps = {
  onSelect: (field: keyof DiagnosticData, value: string, nextStep: StepKeys) => void;
};

export function WaterStep({ onSelect }: StepProps) {
  return (
    <div className="space-y-5 animate-fade-in">
      <div className="space-y-1">
        <div className="inline-flex p-2 bg-info/40 rounded-xl text-info-foreground mb-1">
          <Droplets className="w-5 h-5" />
        </div>
        <h1 className="text-xl font-extrabold text-foreground tracking-tight">Qual é a sua ingestão diária de água?</h1>
        <p className="text-xs text-muted-foreground font-medium leading-relaxed">A hidratação do tecido subcutâneo impacta diretamente o acúmulo de fluidos e o relevo da pele.</p>
      </div>
      <div className="flex flex-col space-y-3">
        {[
          { key: "under_1l", label: "Menos de 1 Litro", desc: "Sinto sede com frequência ao longo do dia." },
          { key: "1l_2l", label: "Entre 1L e 2 Litros", desc: "Consumo moderado, mas esqueço de monitorar." },
          { key: "over_2l", label: "Mais de 2 Litros", desc: "Mantenho uma meta de hidratação constante." }
        ].map((opt) => (
          <button
            key={opt.key}
            type="button"
            onClick={() => onSelect("waterIntake", opt.key, "circulation")}
            className="w-full text-left p-4 bg-secondary/20 border border-secondary/50 rounded-xl hover:border-primary/60 transition-all active:scale-[0.99] cursor-pointer pointer-coarse:py-5"
          >
            <div className="font-bold text-sm text-foreground">{opt.label}</div>
            <div className="text-xs text-muted-foreground font-medium mt-0.5">{opt.desc}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

export function CirculationStep({ onSelect }: StepProps) {
  return (
    <div className="space-y-5 animate-fade-in">
      <div className="space-y-1">
        <div className="inline-flex p-2 bg-primary/30 rounded-xl text-primary-foreground mb-1">
          <Briefcase className="w-5 h-5" />
        </div>
        <h1 className="text-xl font-extrabold text-foreground tracking-tight">Como é a sua rotina de trabalho?</h1>
        <p className="text-xs text-muted-foreground font-medium leading-relaxed">Longos períodos sentada diminuem o retorno venoso e propiciam edema nos membros inferiores.</p>
      </div>
      <div className="flex flex-col space-y-3">
        {[
          { key: "sedentary_sitting", label: "Predominantemente Sentada", desc: "Passo quase o dia todo na mesa de trabalho." },
          { key: "active_standing", label: "Predominantemente Em Pé", desc: "Trabalho em movimento ou longos períodos em pé." },
          { key: "mixed_movement", label: "Mista / Movimento Constante", desc: "Alterno posições e faço pausas frequentes." }
        ].map((opt) => (
          <button
            key={opt.key}
            type="button"
            onClick={() => onSelect("circulationProfile", opt.key, "routine")}
            className="w-full text-left p-4 bg-secondary/20 border border-secondary/50 rounded-xl hover:border-primary/60 transition-all active:scale-[0.99] cursor-pointer pointer-coarse:py-5"
          >
            <div className="font-bold text-sm text-foreground">{opt.label}</div>
            <div className="text-xs text-muted-foreground font-medium mt-0.5">{opt.desc}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

export function RoutineStep({ onSelect }: StepProps) {
  return (
    <div className="space-y-5 animate-fade-in">
      <div className="space-y-1">
        <div className="inline-flex p-2 bg-accent/20 rounded-xl text-accent-foreground mb-1">
          <Layers className="w-5 h-5" />
        </div>
        <h1 className="text-xl font-extrabold text-foreground tracking-tight">Qual seu nível atual de cuidados corporais?</h1>
        <p className="text-xs text-muted-foreground font-medium leading-relaxed">Saber o que você já aplica nos ajuda a filtrar quais ativos faltam no seu cronograma.</p>
      </div>
      <div className="flex flex-col space-y-3">
        {[
          { key: "none", label: "Nenhum cuidado específico", desc: "Uso apenas sabonete comum durante o banho." },
          { key: "topical_hydration", label: "Hidratação básica contínua", desc: "Aplico cremes hidratantes normais após o banho." },
          { key: "advanced_actives", label: "Uso de ativos ou massagem", desc: "Já utilizo cremes anticelulite ou rolos modeladores." }
        ].map((opt) => (
          <button
            key={opt.key}
            type="button"
            onClick={() => onSelect("currentRoutine", opt.key, "fork")}
            className="w-full text-left p-4 bg-secondary/20 border border-secondary/50 rounded-xl hover:border-primary/60 transition-all active:scale-[0.99] cursor-pointer pointer-coarse:py-5"
          >
            <div className="font-bold text-sm text-foreground">{opt.label}</div>
            <div className="text-xs text-muted-foreground font-medium mt-0.5">{opt.desc}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
