"use client";

import { useEffect, useRef } from "react";

interface GoogleButtonProps {
  label: string;
  onCredential: (credential: { email: string; sub: string }) => void;
}

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential: string }) => void;
          }) => void;
          renderButton: (element: HTMLElement, options: unknown) => void;
        };
      };
    };
  }
}

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

export function GoogleButton({ label, onCredential }: GoogleButtonProps) {
  const buttonRef = useRef<HTMLDivElement>(null);
  const initializedRef = useRef(false);

  useEffect(() => {
    if (!GOOGLE_CLIENT_ID) {
      return;
    }

    const initialize = () => {
      if (initializedRef.current || !window.google?.accounts?.id) {
        return;
      }
      initializedRef.current = true;

      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: (response) => {
          onCredential(decodeCredential(response.credential));
        },
      });

      if (buttonRef.current) {
        window.google.accounts.id.renderButton(buttonRef.current, {
          theme: "outline",
          size: "large",
          shape: "pill",
          text: "signin_with",
          width: "100%",
        });
      }
    };

    if (window.google?.accounts?.id || document.getElementById("gsi-script")) {
      initialize();
      return;
    }

    const script = document.createElement("script");
    script.id = "gsi-script";
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.onload = initialize;
    document.head.appendChild(script);
  }, [onCredential]);

  if (!GOOGLE_CLIENT_ID) {
    return (
      <button
        type="button"
        disabled
        className="w-full flex items-center justify-center gap-3 bg-secondary/30 border border-secondary/60 text-muted-foreground font-bold text-sm py-4 rounded-xl cursor-not-allowed"
      >
        <GoogleIcon />
        {label}
      </button>
    );
  }

  return <div className="w-full" ref={buttonRef} />;
}

function GoogleIcon() {
  return (
    <svg className="w-4 h-4 text-foreground/80 fill-current shrink-0" viewBox="0 0 24 24">
      <path d="M12.24 10.285V13.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.866-3.577-7.866-8s3.536-8 7.866-8c2.46 0 4.105 1.025 5.047 1.926l2.427-2.334C17.955 2.192 15.34 1 12.24 1 5.48 1 0 6.48 0 13.24s5.48 12.24 12.24 12.24c7.055 0 11.75-4.945 11.75-11.935 0-.805-.085-1.42-.19-1.925H12.24z"/>
    </svg>
  );
}

function decodeCredential(token: string): { email: string; sub: string } {
  const parts = token.split(".");
  if (parts.length !== 3) {
    throw new Error("Credencial Google inválida.");
  }
  const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
  const payload = JSON.parse(
    atob(base64),
  ) as { email: string; sub: string };
  return { email: payload.email, sub: payload.sub };
}
