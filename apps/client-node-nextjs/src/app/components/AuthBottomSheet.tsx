"use client";

import React, { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Mail, Loader2, X, CheckCircle2 } from "lucide-react";
import { DiagnosticData } from "../(dashboard)/onboarding/diagnostic/QuizTypes";

interface AuthBottomSheetProps {
  isOpen: boolean;
  onClose: (open: boolean) => void;
  diagnosticData: DiagnosticData;
}

export default function AuthBottomSheet({ isOpen, onClose, diagnosticData }: AuthBottomSheetProps) {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleMagicLinkSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    setErrorMessage(null);

    try {
      // Direct integration into NestJS BFF
      const response = await fetch(`http://skin-saas-bff-alb-2007244738.us-east-1.elb.amazonaws.com/api/v1/auth/magic-link`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          diagnostic: {
            assessmentType: diagnosticData.assessmentType,
            manualSelectedGrade: diagnosticData.manualSelectedGrade,
            waterIntake: diagnosticData.waterIntake,
            circulationProfile: diagnosticData.circulationProfile,
          }
        }),
      });

      if (!response.ok) {
        console.log("Magic link request failed:", response.status, response.statusText);
        throw new Error("Erro ao iniciar o envio. Tente novamente.");
      }

      setIsSuccess(true);
    } catch (err: any) {
      setErrorMessage(err.message || "Erro de conexão com o servidor.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-foreground/20 backdrop-blur-xs z-50 animate-fade-in" />
        
        <Dialog.Content className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-background rounded-t-2xl p-6 pb-8 space-y-5 border-t border-border shadow-xl z-50 outline-hidden transform transition-transform animate-slide-up duration-300">
          
          <div className="w-12 h-1 bg-secondary mx-auto rounded-full -mt-2" />

          {/* Header */}
          <div className="flex justify-between items-start pt-2">
            <div className="space-y-1">
              <Dialog.Title className="text-lg font-extrabold text-foreground tracking-tight">
                {!isSuccess ? "Desbloqueie seu Cronograma" : "Verifique seu e-mail"}
              </Dialog.Title>
              <Dialog.Description className="text-xs text-muted-foreground font-medium">
                {!isSuccess 
                  ? "Insira seu e-mail para salvar seu diagnóstico e prosseguir para o pagamento seguro via Pix."
                  : "Enviamos um link de login único e seguro para o seu endereço de e-mail."}
              </Dialog.Description>
            </div>
            
            <Dialog.Close asChild>
              <button className="text-muted-foreground/60 hover:text-foreground p-1.5 rounded-lg bg-muted/50 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </Dialog.Close>
          </div>

          {!isSuccess ? (
            /* Email Request Form Layout */
            <form onSubmit={handleMagicLinkSubmit} className="space-y-4 pt-2">
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60" />
                <input
                  type="email"
                  required
                  placeholder="seu.email@exemplo.com.br"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  className="w-full bg-secondary/10 border border-border/80 focus:border-ring rounded-xl py-3.5 pl-10 pr-4 text-sm font-medium text-foreground placeholder:text-muted-foreground/50 transition-colors outline-hidden disabled:opacity-60"
                />
              </div>

              {errorMessage && (
                <p className="text-xs text-destructive font-semibold bg-destructive/10 p-2.5 rounded-lg text-center">
                  {errorMessage}
                </p>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-accent text-accent-foreground font-bold text-sm py-4 rounded-xl flex items-center justify-center gap-2 shadow-sm hover:opacity-95 active:scale-[0.99] transition-all disabled:opacity-80"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Enviando link de acesso...
                  </>
                ) : (
                  "Gerar Acesso & Ir para Pix"
                )}
              </button>
            </form>
          ) : (
            /* Success Feedback Layout (Keeps user on app while waiting for email delivery) */
            <div className="flex flex-col items-center justify-center py-6 text-center space-y-3 animate-fade-in">
              <div className="bg-primary/20 p-3 rounded-full">
                <CheckCircle2 className="w-8 h-8 text-foreground" />
              </div>
              <div className="space-y-1 px-4">
                <p className="text-sm font-bold text-foreground">Link Enviado para <span className="underline">{email}</span></p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Clique no link dentro do e-mail usando este mesmo dispositivo. Ele vai validar seu perfil e abrir o Pix automaticamente.
                </p>
              </div>
            </div>
          )}

          <p className="text-[10px] text-center text-muted-foreground/80 leading-normal font-medium px-4 pt-1">
            Ao continuar, você concorda explicitamente com o processamento de dados confidenciais de saúde para fins de diagnóstico personalizado, em total conformidade com a LGPD brasileira.
          </p>

        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
