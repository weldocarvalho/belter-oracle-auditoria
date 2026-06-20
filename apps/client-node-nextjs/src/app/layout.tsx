import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const sansFont = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Skin Protocol App",
  description: "Dermatologist-grade cellulite protocols and visual tracking.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${sansFont.variable} scroll-smooth`}>
      <body className="font-sans antialiased bg-muted/30 selection:bg-accent/20 min-h-screen flex justify-center">
        
        <div className="w-full max-w-md min-h-screen bg-background text-foreground flex flex-col relative shadow-sm border-x border-border/20 pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]">
          
          <main className="flex-1 w-full px-5 py-4 overflow-x-hidden">
            {children}
          </main>
          
        </div>
        
      </body>
    </html>
  );
}
