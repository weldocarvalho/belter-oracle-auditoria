export interface SkinMetrics {
  dimple_count_density: number; // 0-100 index
  skin_laxity: number;          // 0-100 index
  microcirculation_index: number; // 0-100 index
}

export interface AnalysisResult {
  cellulite_grade: 1 | 2 | 3 | 4;
  confidence_score: number;
  metrics: SkinMetrics;
  affected_zones: string[];
  clinical_justification: string;
}

// Finite State Machine for reliable client tracking
export type OnboardingState = 
  | 'IDLE' 
  | 'CAMERA_ACTIVE' 
  | 'UPLOADING' 
  | 'PROCESSING' 
  | 'COMPLETED' 
  | 'ERROR';
