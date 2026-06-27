export type CyclePhaseType = 'Menstrual' | 'Follicular' | 'Ovulatory' | 'Luteal';

export interface CyclePhase {
  name: CyclePhaseType;
  displayName: string;
  startDay: number;
  endDay: number;
  colorClass: string; // text color e.g. text-rose-500
  accentBg: string; // bg color e.g. bg-rose-500
  glowClass: string; // shadow color e.g. shadow-rose-500/20
  borderColor: string; // border color e.g. border-rose-500/30
  bgGradient: string; // gradient e.g. from-rose-500/10 to-transparent
  description: string;
}

export interface WellnessAdvice {
  movement: {
    title: string;
    description: string;
    tips: string[];
    iconName: string;
  };
  nutrition: {
    title: string;
    description: string;
    tips: string[];
    iconName: string;
  };
  mindset: {
    title: string;
    description: string;
    tips: string[];
    iconName: string;
  };
}

export interface SymptomLog {
  id: string;
  date: string; // YYYY-MM-DD
  cycleDay: number;
  phase: CyclePhaseType;
  moods: string[];
  physical: string[];
  notes?: string;
}

export interface CycleConfig {
  lastPeriodStart: string; // YYYY-MM-DD
  cycleLength: number; // e.g. 28
  periodLength: number; // e.g. 5
}
