"use client";

import React, { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Mail, Loader2, X, ShieldAlert } from "lucide-react";

interface ConsolidatedAuthSheetProps {
  isOpen: boolean;
  onClose: (open: boolean) => void;
  onSuccess: (authData: { email: string; provider: string }) => void;
}

export default function ConsolidatedAuthSheet({ isOpen, onClose, onSuccess }: ConsolidatedAuthSheetProps) {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    // Simulating low-latency BFF register handshake
    setTimeout(() => {
      setIsLoading(false);
      onSuccess({ email, provider: "magic-link" });
    }, 1500);
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
                Inscreva-se em segundos para processar seu pagamento e liberar seu cronograma de 4 semanas.
              </Dialog.Description>
            </div>
            <Dialog.Close asChild>
              <button className="text-muted-foreground/60 hover:text-foreground p-1.5 rounded-lg bg-muted/50 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </Dialog.Close>
          </div>

          {/* Wide One-Tap Google OAuth Trigger */}
          <button
            type="button"
            onClick={() => onSuccess({ email: "google-user@gmail.com", provider: "google" })}
            className="w-full flex items-center justify-center gap-3 bg-secondary/30 hover:bg-secondary/50 border border-secondary/60 text-foreground font-bold text-sm py-4 rounded-xl transition-all active:scale-[0.99] cursor-pointer"
          >
            <svg className="w-4 h-4 text-foreground/80 fill-current shrink-0" viewBox="0 0 24 24">
              <path d="M12.24 10.285V13.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.866-3.577-7.866-8s3.536-8 7.866-8c2.46 0 4.105 1.025 5.047 1.926l2.427-2.334C17.955 2.192 15.34 1 12.24 1 5.48 1 0 6.48 0 13.24s5.48 12.24 12.24 12.24c7.055 0 11.75-4.945 11.75-11.935 0-.805-.085-1.42-.19-1.925H12.24z"/>
            </svg>
            Entrar com o Google
          </button>

          <div className="relative flex items-center justify-center py-1">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border/60"></div></div>
            <span className="relative bg-background px-3 text-[10px] font-extrabold text-muted-foreground/60 tracking-wider uppercase">Ou use e-mail</span>
          </div>

          <form onSubmit={handleAuthSubmit} className="space-y-4">
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

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-accent text-accent-foreground font-bold text-sm py-4 rounded-xl flex items-center justify-center gap-2 shadow-sm hover:opacity-95 active:scale-[0.99] transition-all disabled:opacity-80"
            >
              {isLoading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Processando seguro...</>
              ) : (
                "Autenticar e Ir Para o PIX"
              )}
            </button>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
