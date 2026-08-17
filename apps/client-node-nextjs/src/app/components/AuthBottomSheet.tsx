"use client";

import React, { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Mail, Lock, Loader2, X, CheckCircle2 } from "lucide-react";
import { DiagnosticData } from "../(dashboard)/onboarding/diagnostic/QuizTypes";
import { apiFetch, setSession } from "@/lib/auth";
import { GoogleButton } from "./GoogleButton";

interface AuthBottomSheetProps {
  isOpen: boolean;
  onClose: (open: boolean) => void;
  diagnosticData: DiagnosticData;
  onAuthenticated?: () => void;
}

export default function AuthBottomSheet({
  isOpen,
  onClose,
  diagnosticData,
  onAuthenticated,
}: AuthBottomSheetProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const payload = await apiFetch<{
        accessToken: string;
        user: { id: string; email: string };
      }>("/api/v1/auth/register", {
        method: "POST",
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password,
          diagnostic: {
            assessmentType: diagnosticData.assessmentType ?? "manual_matrix",
            manualSelectedGrade:
              diagnosticData.manualSelectedGrade ??
              (diagnosticData.assessmentType === "ai_photo" ? 2 : 1),
            waterIntake: diagnosticData.waterIntake,
            circulationProfile: diagnosticData.circulationProfile,
          },
        }),
      });

      setSession(payload.accessToken, payload.user);
      setIsSuccess(true);
      onAuthenticated?.();
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : "Erro ao criar a conta. Tente novamente.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogle = async (googleCredential: {
    email: string;
    sub: string;
  }) => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const payload = await apiFetch<{
        accessToken: string;
        user: { id: string; email: string };
      }>("/api/v1/auth/google", {
        method: "POST",
        body: JSON.stringify({
          email: googleCredential.email,
          googleSubject: googleCredential.sub,
          diagnostic: {
            assessmentType: diagnosticData.assessmentType ?? "manual_matrix",
            manualSelectedGrade:
              diagnosticData.manualSelectedGrade ??
              (diagnosticData.assessmentType === "ai_photo" ? 2 : 1),
            waterIntake: diagnosticData.waterIntake,
            circulationProfile: diagnosticData.circulationProfile,
          },
        }),
      });

      setSession(payload.accessToken, payload.user);
      setIsSuccess(true);
      onAuthenticated?.();
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : "Erro ao autenticar com o Google.",
      );
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

          <div className="flex justify-between items-start pt-2">
            <div className="space-y-1">
              <Dialog.Title className="text-lg font-extrabold text-foreground tracking-tight">
                {!isSuccess ? "Crie sua conta" : "Conta criada com sucesso"}
              </Dialog.Title>
              <Dialog.Description className="text-xs text-muted-foreground font-medium">
                {!isSuccess
                  ? "Salve seu diagnóstico e desbloqueie seu cronograma personalizado."
                  : "Seu acesso foi liberado. Continue para o próximo passo."}
              </Dialog.Description>
            </div>

            <Dialog.Close asChild>
              <button className="text-muted-foreground/60 hover:text-foreground p-1.5 rounded-lg bg-muted/50 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </Dialog.Close>
          </div>

          {!isSuccess ? (
            <form onSubmit={handleRegister} className="space-y-4 pt-2">
              <GoogleButton
                label="Criar conta com o Google"
                onCredential={handleGoogle}
              />

              <div className="relative flex items-center justify-center py-1">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border/60"></div>
                </div>
                <span className="relative bg-background px-3 text-[10px] font-extrabold text-muted-foreground/60 tracking-wider uppercase">
                  Ou crie com e-mail
                </span>
              </div>

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

              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60" />
                <input
                  type="password"
                  required
                  minLength={8}
                  placeholder="Senha (mínimo 8 caracteres)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
                    Criando sua conta...
                  </>
                ) : (
                  "Criar Conta & Ir para o Pix"
                )}
              </button>
            </form>
          ) : (
            <div className="flex flex-col items-center justify-center py-6 text-center space-y-3 animate-fade-in">
              <div className="bg-primary/20 p-3 rounded-full">
                <CheckCircle2 className="w-8 h-8 text-foreground" />
              </div>
              <div className="space-y-1 px-4">
                <p className="text-sm font-bold text-foreground">
                  Bem-vindo(a), {email}
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Seu perfil foi criado. Agora é só continuar para liberar seu
                  cronograma de 4 semanas.
                </p>
              </div>
            </div>
          )}

          <p className="text-[10px] text-center text-muted-foreground/80 leading-normal font-medium px-4 pt-1">
            Ao continuar, você concorda explicitamente com o processamento de
            dados confidenciais de saúde para fins de diagnóstico personalizado,
            em total conformidade com a LGPD brasileira.
          </p>

        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
