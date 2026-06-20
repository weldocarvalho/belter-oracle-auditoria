import React from "react";
import { ClipboardCheck, BrainCircuit, LineChart } from "lucide-react";

export default function VisualStepper() {
  const steps = [
    {
      number: "01",
      title: "O Diagnóstico",
      description: "Responda a perguntas rápidas sobre seus hábitos e faça o mapeamento opcional de textura.",
      badge: "3 min",
      icon: ClipboardCheck,
      iconBg: "bg-primary/20 text-primary-foreground",
    },
    {
      number: "02",
      title: "Geração por IA",
      description: "Nossa engenharia processa os vetores clínicos para montar um cronograma de 4 semanas.",
      badge: "Instantâneo",
      icon: BrainCircuit,
      iconBg: "bg-info/60 text-info-foreground",
    },
    {
      number: "03",
      title: "Evolução Visual",
      description: "Acompanhe a melhora do relevo da pele lado a lado em seu cofre privado seguro.",
      badge: "Resultados",
      icon: LineChart,
      iconBg: "bg-accent/20 text-accent-foreground",
    },
  ];

  return (
    <div className="space-y-6 pt-2">
      {/* Section Divider/Header */}
      <div className="space-y-1">
        <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80">
          Seu Caminho para Resultados
        </h2>
        <p className="text-lg font-extrabold text-foreground tracking-tight">
          Como funciona o seu protocolo digital
        </p>
      </div>

      {/* Vertical Stepper Container */}
      <div className="relative border-l-2 border-secondary/60 pl-6 ml-3.5 space-y-8">
        {steps.map((step, index) => {
          const IconComponent = step.icon;
          return (
            <div key={index} className="relative group transition-all">
              
              {/* Stepper Node Pointer Anchor */}
              <div className="absolute -left-[35px] top-1.5 w-4 h-4 bg-background border-2 border-primary rounded-full flex items-center justify-center transition-colors group-hover:border-accent">
                <div className="w-1.5 h-1.5 bg-secondary rounded-full group-hover:bg-accent transition-colors" />
              </div>

              {/* Card Body */}
              <div className="bg-secondary/20 border border-secondary/40 p-4 rounded-xl flex items-start gap-4 shadow-sm hover:border-primary/40 transition-all active:scale-[0.99]">
                
                {/* Visual Icon Node Wrapper */}
                <div className={`p-2.5 rounded-lg shrink-0 ${step.iconBg}`}>
                  <IconComponent className="w-5 h-5" />
                </div>

                {/* Text Content Space */}
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-muted-foreground/70 tracking-mono">
                      Passo {step.number}
                    </span>
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-muted text-muted-foreground tracking-wide uppercase">
                      {step.badge}
                    </span>
                  </div>
                  
                  <h3 className="text-sm font-bold text-foreground">
                    {step.title}
                  </h3>
                  
                  <p className="text-xs text-muted-foreground font-medium leading-relaxed">
                    {step.description}
                  </p>
                </div>

              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
