"use client";
import React, { useState, useEffect } from "react";
import { Camera, ChevronLeft, Loader2, Sparkles } from "lucide-react";
import { DiagnosticData, StepKeys } from "./QuizTypes";
import { WaterStep, CirculationStep, RoutineStep } from "./QuizSteps";
import { TextureGrade1, TextureGrade2, TextureGrade3, TextureGrade4 } from "./TextureVisuals";
import { QuizReport } from "./QuizReport";


export default function DiagnosticQuiz() {
  const [currentStep, setCurrentStep] = useState<StepKeys>("water");
  const [sessionId, setSessionId] = useState("");
  const [loadingTextIndex, setLoadingTextIndex] = useState(0);

  const [formData, setFormData] = useState<DiagnosticData>({
    waterIntake: "",
    circulationProfile: "",
    currentRoutine: "",
    assessmentType: null,
    manualSelectedGrade: null,
  });

  useEffect(() => {
    let localId = localStorage.getItem("skin_tmp_session");
    if (!localId) {
      localId = `tmp_${crypto.randomUUID()}`;
      localStorage.setItem("skin_tmp_session", localId);
    }
    setSessionId(localId);
  }, []);

  const processingMessages = [
    "Mapeando relevo cutâneo...",
    "Analisando retenção de líquidos e circulação...",
    "Estruturando cronograma dinâmico de 4 semanas...",
    "Cruzando ativos locais do catálogo brasileiro..."
  ];

  useEffect(() => {
    if (currentStep !== "processing") return;
    const interval = setInterval(() => {
      setLoadingTextIndex((prev) => (prev + 1) % processingMessages.length);
    }, 2200);
    return () => clearInterval(interval);
  }, [currentStep]);

  const handleStepSelection = (field: keyof DiagnosticData, value: string, nextStep: StepKeys) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setCurrentStep(nextStep);
  };

  // const handleSubmitDiagnostic = async (finalData: DiagnosticData) => {
  //   setCurrentStep("processing");
  //   try {
  //     console.log("BFF Handshake:", { temporarySessionId: sessionId, ...finalData });
  //     await new Promise((resolve) => setTimeout(resolve, 4500));
  //     window.location.href = "/onboarding/report";
  //   } catch (error) {
  //     console.error("Transmission error:", error);
  //     setCurrentStep("fork");
  //   }
  // };

  const handleSubmitDiagnostic = async (finalData: DiagnosticData) => {
    setCurrentStep("processing");
    try {
      console.log("BFF Handshake:", { temporarySessionId: sessionId, ...finalData });
      // Keep processing loop high-density so customer feels analysis math complexity
      await new Promise((resolve) => setTimeout(resolve, 4500));
      setCurrentStep("report"); // Changes local stage canvas smoothly inside the view
    } catch (error) {
      console.error("Transmission error:", error);
      setCurrentStep("fork");
    }
  };

  if (currentStep === "processing") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[75vh] text-center space-y-6 animate-fade-in px-4">
        <div className="relative flex items-center justify-center">
          <div className="absolute w-16 h-16 bg-primary/20 rounded-full animate-ping" />
          <Loader2 className="w-12 h-12 text-primary animate-spin relative z-10" />
        </div>
        <div className="space-y-2 max-w-xs mx-auto">
          <h2 className="text-lg font-extrabold text-foreground tracking-tight animate-pulse">
            {processingMessages[loadingTextIndex]}
          </h2>
          <p className="text-xs text-muted-foreground font-medium leading-relaxed">
            Nossa inteligência está correlacionando seus vetores biológicos para gerar seu relatório gratuito.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-6 pt-2 animate-fade-in pb-12">
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-muted-foreground/80 tracking-wide uppercase">
          <button 
            type="button"
            onClick={() => {
              if (currentStep === "circulation") setCurrentStep("water");
              if (currentStep === "routine") setCurrentStep("circulation");
              if (currentStep === "fork") setCurrentStep("routine");
              if (currentStep === "matrix") setCurrentStep("fork");
            }}
            disabled={currentStep === "water"}
            className="flex items-center gap-1 disabled:opacity-0 transition-opacity p-1 -ml-1 text-foreground cursor-pointer"
          >
            <ChevronLeft className="w-3.5 h-3.5" /> Voltar
          </button>
          <span>Diagnóstico</span>
        </div>
        <div className="w-full h-1.5 bg-secondary/40 rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary transition-all duration-300"
            style={{
              width: 
                currentStep === "water" ? "20%" :
                currentStep === "circulation" ? "40%" :
                currentStep === "routine" ? "60%" : "85%"
            }}
          />
        </div>
      </div>

      {currentStep === "water" && <WaterStep onSelect={handleStepSelection} />}
      {currentStep === "circulation" && <CirculationStep onSelect={handleStepSelection} />}
      {currentStep === "routine" && <RoutineStep onSelect={handleStepSelection} />}

      {currentStep === "fork" && (
        <div className="space-y-5 animate-fade-in">
          <div className="space-y-1">
            <h1 className="text-xl font-extrabold text-foreground tracking-tight">Como deseja avaliar o grau da celulite?</h1>
            <p className="text-xs text-muted-foreground font-medium leading-relaxed">Para gerar um cronograma preciso, precisamos estabelecer a severidade atual do relevo do tecido.</p>
          </div>
          
          <div className="flex flex-col space-y-4 pt-1">
            <button
              type="button"
              onClick={() => {
                const updated = { ...formData, assessmentType: "ai_photo" as const };
                setFormData(updated);
                handleSubmitDiagnostic(updated);
              }}
              className="w-full text-left p-5 bg-background border-2 border-primary rounded-2xl relative shadow-md hover:border-accent transition-all active:scale-[0.99] overflow-hidden group cursor-pointer"
            >
              <div className="absolute right-0 top-0 bg-info px-3 py-1 rounded-bl-xl text-[10px] font-extrabold tracking-wide uppercase text-info-foreground flex items-center gap-1">
                <Sparkles className="w-3 h-3 fill-current" /> Recomendado
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-primary/20 text-primary-foreground p-3 rounded-xl shrink-0 mt-1">
                  <Camera className="w-6 h-6" />
                </div>
                <div className="space-y-1 pr-12">
                  <h3 className="text-base font-bold text-foreground">Escaneamento por Foto via IA</h3>
                  <p className="text-xs text-muted-foreground font-medium leading-relaxed">
                    Nossa IA analisa os padrões de sombra e depressões na textura. **Privacidade garantida por desfoque local automático.**
                  </p>
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setCurrentStep("matrix")}
              className="w-full text-left p-4 bg-secondary/20 border border-secondary rounded-xl hover:border-primary/60 transition-all active:scale-[0.99] cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <h4 className="text-sm font-bold text-foreground">Não quero enviar foto agora</h4>
                  <p className="text-xs text-muted-foreground font-medium">Prefiro selecionar manualmente comparando com ilustrações 3D.</p>
                </div>
              </div>
            </button>
          </div>
        </div>
      )}

      {currentStep === "matrix" && (
        <div className="space-y-5 animate-fade-in">
          <div className="space-y-1">
            <h1 className="text-xl font-extrabold text-foreground tracking-tight">Selecione o relevo mais semelhante ao seu:</h1>
            <p className="text-xs text-muted-foreground font-medium leading-relaxed">Compare visualmente com a textura da região que mais te incomoda hoje.</p>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            {[
              { grade: 1, name: "Grau 1 (Suave)", desc: "Pele lisa ao deitar ou de pé. Ondulações surgem apenas ao apertar.", component: TextureGrade1 },
              { grade: 2, name: "Grau 2 (Edematoso)", desc: "Ondulações e covinhas já são visíveis de pé de forma natural.", component: TextureGrade2 },
              { grade: 3, name: "Grau 3 (Fibroso)", desc: "Aspecto visível em qualquer posição, com pequenos nódulos palpáveis.", component: TextureGrade3 },
              { grade: 4, name: "Grau 4 (Nodular)", desc: "Depressões profundas, relevo muito irregular e sensibilidade ao toque.", component: TextureGrade4 }
            ].map((item) => {
              const TextureVisualMap = item.component;
              return (
                <button
                  key={item.grade}
                  type="button"
                  onClick={() => {
                    const updated = { ...formData, assessmentType: "manual_matrix" as const, manualSelectedGrade: item.grade };
                    setFormData(updated);
                    handleSubmitDiagnostic(updated);
                  }}
                  className="w-full text-left p-3 bg-secondary/20 border border-secondary/60 rounded-xl flex flex-col justify-between space-y-3.5 hover:border-primary hover:bg-background transition-all active:scale-[0.99] group cursor-pointer"
                >
                  <div className="space-y-1">
                    <span className="text-[9px] font-extrabold px-1.5 py-0.5 bg-muted rounded text-muted-foreground tracking-wide uppercase group-hover:bg-primary/20 group-hover:text-primary-foreground transition-colors">
                      Grau {item.grade}
                    </span>
                    <h4 className="text-xs font-bold text-foreground pt-1">{item.name}</h4>
                    <p className="text-[11px] text-muted-foreground leading-normal font-medium tracking-tight line-clamp-3">{item.desc}</p>
                  </div>
                  
                  {/* Highly visual vector skin surface canvas matrix box */}
                  <div className="w-full h-16 rounded-lg border border-secondary/40 overflow-hidden shadow-xs relative bg-background transition-transform group-hover:scale-[1.01]">
                    <TextureVisualMap />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 📊 View Stage 6: The Completed High-Conversion Diagnostic Overview Card */}
      {currentStep === "report" && <QuizReport formData={formData} />}

    </div>
  );
}
