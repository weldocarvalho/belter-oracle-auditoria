"use client";

import React, { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Mail, Lock, Loader2, X, ShieldAlert } from "lucide-react";
import { apiFetch, setSession } from "@/lib/auth";
import { GoogleButton } from "./GoogleButton";

interface ConsolidatedAuthSheetProps {
  isOpen: boolean;
  onClose: (open: boolean) => void;
  onSuccess: (authData: {
    email: string;
    provider: "credentials" | "google";
  }) => void;
}

export default function ConsolidatedAuthSheet({
  isOpen,
  onClose,
  onSuccess,
}: ConsolidatedAuthSheetProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const payload = await apiFetch<{
        accessToken: string;
        user: { id: string; email: string };
      }>("/api/v1/auth/login", {
        method: "POST",
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password,
        }),
      });

      setSession(payload.accessToken, payload.user);
      onSuccess({ email: payload.user.email, provider: "credentials" });
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : "Erro ao entrar. Tente novamente.",
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
          diagnostic: null,
        }),
      });

      setSession(payload.accessToken, payload.user);
      onSuccess({ email: payload.user.email, provider: "google" });
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
              <Dialog.Title className="text-base font-extrabold text-foreground tracking-tight flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-accent-foreground" />
                Salve seu Relatório de IA
              </Dialog.Title>
              <Dialog.Description className="text-xs text-muted-foreground font-medium">
                Entre com sua conta para processar seu pagamento e liberar seu
                cronograma de 4 semanas.
              </Dialog.Description>
            </div>
            <Dialog.Close asChild>
              <button className="text-muted-foreground/60 hover:text-foreground p-1.5 rounded-lg bg-muted/50 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </Dialog.Close>
          </div>

          <GoogleButton
            label="Entrar com o Google"
            onCredential={handleGoogle}
          />

          <div className="relative flex items-center justify-center py-1">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border/60"></div>
            </div>
            <span className="relative bg-background px-3 text-[10px] font-extrabold text-muted-foreground/60 tracking-wider uppercase">
              Ou use e-mail
            </span>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60" />
              <input
                type="email"
                required
                placeholder="seu.email@exemplo.com.br"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                className="w-full bg-secondary/10 border border-border/80 focus:border-ring rounded-xl py-3.5 pl-10 pr-4 text-sm font-medium text-foreground outline-hidden transition-colors disabled:opacity-60"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60" />
              <input
                type="password"
                required
                placeholder="Sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                className="w-full bg-secondary/10 border border-border/80 focus:border-ring rounded-xl py-3.5 pl-10 pr-4 text-sm font-medium text-foreground outline-hidden transition-colors disabled:opacity-60"
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
                <><Loader2 className="w-4 h-4 animate-spin" /> Entrando...</>
              ) : (
                "Entrar e Ir Para o PIX"
              )}
            </button>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
