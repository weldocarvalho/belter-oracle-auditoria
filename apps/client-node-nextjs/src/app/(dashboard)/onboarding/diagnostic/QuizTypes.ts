export type DiagnosticData = {
  waterIntake: string;
  circulationProfile: string;
  currentRoutine: string;
  assessmentType: "ai_photo" | "manual_matrix" | null;
  manualSelectedGrade: number | null;
};

export type StepKeys = "water" | "circulation" | "routine" | "fork" | "matrix" | "processing" | "report";
