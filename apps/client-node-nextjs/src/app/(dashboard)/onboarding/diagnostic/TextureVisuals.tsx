"use client";

import React from "react";

// Clean inline SVG vectors mimicking dermis stress topography maps
export function TextureGrade1() {
  return (
    <svg className="w-full h-full text-primary/40 bg-muted/20" viewBox="0 0 100 40" xmlns="http://w3.org">
      <rect width="100%" height="100%" fill="currentColor" opacity="0.15" />
      {/* Grade 1: Completely smooth surface canvas, micro-lines under surface tension */}
      <path d="M10 20 Q 25 18, 50 20 T 90 20" stroke="currentColor" strokeWidth="0.75" fill="none" opacity="0.4" />
      <path d="M5 25 Q 30 24, 60 25 T 95 25" stroke="currentColor" strokeWidth="0.5" fill="none" opacity="0.2" />
      <circle cx="50" cy="20" r="1.5" fill="currentColor" opacity="0.1" />
    </svg>
  );
}

export function TextureGrade2() {
  return (
    <svg className="w-full h-full text-primary/60 bg-muted/30" viewBox="0 0 100 40" xmlns="http://w3.org">
      <rect width="100%" height="100%" fill="currentColor" opacity="0.2" />
      {/* Grade 2: Mild, visible fluid retention waves (Edematous) */}
      <path d="M0 15 Q 15 22, 35 15 T 70 15 T 100 15" stroke="currentColor" strokeWidth="1" fill="none" />
      <path d="M5 28 Q 25 32, 50 27 T 95 28" stroke="currentColor" strokeWidth="0.75" fill="none" opacity="0.5" />
      {/* Light dimple shadow markers */}
      <circle cx="20" cy="20" r="2.5" fill="currentColor" opacity="0.2" />
      <circle cx="60" cy="18" r="2.2" fill="currentColor" opacity="0.2" />
    </svg>
  );
}

export function TextureGrade3() {
  return (
    <svg className="w-full h-full text-accent/40 bg-muted/40" viewBox="0 0 100 40" xmlns="http://w3.org">
      <rect width="100%" height="100%" fill="currentColor" opacity="0.15" />
      {/* Grade 3: Sharp valley depths and fibrous structural band pull downs */}
      <path d="M0 12 Q 12 24, 24 10 T 48 26 T 72 10 T 100 14" stroke="currentColor" strokeWidth="1.25" fill="none" />
      <path d="M3 24 Q 20 34, 40 22 T 80 28 T 98 20" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.6" />
      {/* Distinct dimpling depression valley shadow anchors */}
      <ellipse cx="18" cy="18" rx="4" ry="2.5" fill="currentColor" opacity="0.3" />
      <ellipse cx="42" cy="24" rx="4.5" ry="3" fill="currentColor" opacity="0.35" />
      <ellipse cx="68" cy="16" rx="3.5" ry="2" fill="currentColor" opacity="0.25" />
    </svg>
  );
}

export function TextureGrade4() {
  return (
    <svg className="w-full h-full text-accent/60 bg-muted/50" viewBox="0 0 100 40" xmlns="http://w3.org">
      <rect width="100%" height="100%" fill="currentColor" opacity="0.2" />
      {/* Grade 4: Advanced macro-nodular depressions with high irregularity ridges */}
      <path d="M0 8 Q 10 28, 20 6 T 40 32 T 60 4 T 80 30 T 100 10" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <path d="M2 22 Q 15 36, 32 18 T 64 34 T 98 24" stroke="currentColor" strokeWidth="1.25" fill="none" opacity="0.7" />
      {/* Heavy, multi-layered micro-nodule stress shading packs */}
      <ellipse cx="14" cy="20" rx="5" ry="4" fill="currentColor" opacity="0.45" />
      <ellipse cx="36" cy="26" rx="6" ry="4.5" fill="currentColor" opacity="0.5" />
      <ellipse cx="54" cy="12" rx="4" ry="3.5" fill="currentColor" opacity="0.4" />
      <ellipse cx="76" cy="25" rx="5.5" ry="4" fill="currentColor" opacity="0.45" />
    </svg>
  );
}
