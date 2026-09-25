export type RubricAxis = 
  | 'proportion_anatomy'
  | 'perspective_framing'
  | 'tonal_values_lighting'
  | 'line_gesture_texture'
  | 'color_composition';

export interface RubricEvaluation {
  score: number; // 0 - 100
  level: 'Iniciante' | 'Em Desenvolvimento' | 'Sólido' | 'Avançado' | 'Maestria';
  strengths: string[];
  deviations: string[];
  technicalDiagnosis: string;
  recommendedDrill: string;
}

export interface HorizonLine {
  yPercent: number; // 0 - 100
  tiltAngleDeg: number;
  label?: string;
}

export interface VanishingPoint {
  xPercent: number;
  yPercent: number;
  type: 'left' | 'right' | 'vertical' | 'center';
  label: string;
}

export interface LandmarkGuide {
  id: string;
  label: string;
  type: 
    | 'loomis_brow' 
    | 'loomis_nose' 
    | 'loomis_chin' 
    | 'eye_line' 
    | 'symmetry_axis' 
    | 'base_rim' 
    | 'apex_height' 
    | 'third_horizontal' 
    | 'third_vertical' 
    | 'golden_spiral' 
    | 'custom';
  yPercent?: number;
  xPercent?: number;
  description: string;
}

export interface AIRedlineAnnotation {
  id: string;
  xPercent: number; // 0 - 100
  yPercent: number; // 0 - 100
  category: 'proporcao' | 'perspectiva' | 'valor' | 'traco';
  title: string;
  critique: string;
  correctionSuggestion: string;
  severity: 'sugestao' | 'ajuste_fino' | 'desvio_critico';
}

export interface AnalysisOverlays {
  horizonLine?: HorizonLine;
  vanishingPoints?: VanishingPoint[];
  landmarks?: LandmarkGuide[];
  annotations: AIRedlineAnnotation[];
  tonalHistogramSummary?: {
    shadows: number;
    midtones: number;
    highlights: number;
    dominantKey: 'Chave Baixa (Low Key)' | 'Chave Média' | 'Chave Alta (High Key)';
  };
}

export interface ArtworkAnalysisResult {
  overallScore: number; // 0 - 100
  technicalSummary: string;
  artStyleDetected: string;
  mediumDetected: string;
  subjectDetected?: string;
  subjectCategory?: 'objeto_natureza_morta' | 'rosto_retrato' | 'figura_humana' | 'cenario_perspectiva' | 'outro';
  rubrics: {
    proportionAnatomy: RubricEvaluation;
    perspectiveFraming: RubricEvaluation;
    tonalValuesLighting: RubricEvaluation;
    lineGestureTexture: RubricEvaluation;
    colorComposition: RubricEvaluation;
  };
  overlays: AnalysisOverlays;
  actionPlan: {
    immediateCorrection: string;
    nextStudyExercise: string;
    suggestedClassId: string;
    practiceDurationMinutes: number;
  };
}

export type JobStatus = 
  | 'queued'
  | 'preprocessing'
  | 'analyzing'
  | 'generating_overlays'
  | 'completed'
  | 'failed';

export interface AnalysisVersion {
  version: number;
  label: string;
  timestamp: string;
  focusArea?: string;
  subjectCategory?: string;
  customNotes?: string;
  userStrokesCount?: number;
  result: ArtworkAnalysisResult;
}

export interface AnalysisJob {
  id: string;
  status: JobStatus;
  progressPercent: number;
  statusMessage: string;
  artworkTitle: string;
  medium: string;
  timeSpentMinutes?: number;
  imageUrl: string;
  createdAt: string;
  completedAt?: string;
  result?: ArtworkAnalysisResult;
  errorMessage?: string;
  isReanalysis?: boolean;
  reanalysisVersion?: number;
  reanalysisNotes?: string;
  versions?: AnalysisVersion[];
  selectedVersionIndex?: number;
}

export interface UserRedlineStroke {
  id: string;
  color: string;
  strokeWidth: number;
  points: { x: number; y: number }[]; // Coordinates in normalized 0 - 1000 scale
}

export interface PeerReview {
  id: string;
  authorName: string;
  authorRole: string;
  authorAvatar: string;
  createdAt: string;
  comment: string;
  strokes?: UserRedlineStroke[];
  votesCount: number;
  hasVoted?: boolean;
}

export interface CommunityPost {
  id: string;
  authorName: string;
  authorHandle: string;
  authorAvatar: string;
  title: string;
  description: string;
  medium: string;
  timeSpentMinutes: number;
  targetGoal: string;
  imageUrl: string;
  createdAt: string;
  status: 'aguardando_redline' | 'revisado_ia' | 'resolvido';
  aiOverallScore?: number;
  tags: string[];
  likesCount: number;
  hasLiked?: boolean;
  peerReviews: PeerReview[];
  analysisJobId?: string;
}

export interface Lesson {
  id: string;
  title: string;
  instructor: string;
  instructorTitle: string;
  durationMinutes: number;
  level: 'Iniciante' | 'Intermediário' | 'Avançado';
  category: 'Fundamentos' | 'Perspectiva' | 'Anatomia' | 'Luz e Valores' | 'Pintura';
  youtubeId: string;
  thumbnailUrl: string;
  summary: string;
  keyTakeaways: string[];
  practicalExercise: {
    title: string;
    prompt: string;
    recommendedTime: string;
    rubricTarget: string;
  };
}

export interface ArtistBadge {
  id: string;
  title: string;
  description: string;
  category: 'streak' | 'rubrics' | 'community' | 'lessons' | 'mastery';
  tier: 'bronze' | 'prata' | 'ouro' | 'diamante';
  iconName: 'flame' | 'award' | 'target' | 'sparkles' | 'layers' | 'pen' | 'users' | 'compass' | 'shield' | 'zap';
  progress: number;
  maxProgress: number;
  unlocked: boolean;
  unlockedAt?: string;
  requirement: string;
  xpReward: number;
}

export interface DailyMission {
  id: string;
  title: string;
  description: string;
  progress: number;
  maxProgress: number;
  completed: boolean;
  xpReward: number;
  category: 'studio' | 'lesson' | 'community';
}

export interface DayActivityStatus {
  dayName: string;
  dateStr: string;
  completed: boolean;
  studiesCount: number;
  durationMinutes: number;
  isToday: boolean;
}

export interface HistoricalStreak {
  id: string;
  startDate: string;
  endDate: string;
  lengthDays: number;
  totalHours: number;
  studiesCount: number;
  status: 'active' | 'completed' | 'broken';
  primaryFocus: string;
  highlightBadge?: string;
}

export interface AnnualContributionDay {
  date: string; // YYYY-MM-DD
  count: number; // Number of studies / audits
  durationMinutes: number;
  intensity: 0 | 1 | 2 | 3 | 4; // 0: none, 1: 15-45m, 2: 45-75m, 3: 75-120m, 4: 120m+
  studies?: string[];
}

export interface ArtistProfile {
  name: string;
  handle: string;
  avatar: string;
  bio: string;
  currentStreakDays: number;
  longestStreakDays: number;
  totalPracticeHours: number;
  studiesCompleted: number;
  peerReviewsGiven: number;
  level: number;
  currentXp: number;
  nextLevelXp: number;
  weeklyActivity: DayActivityStatus[];
  dailyMissions: DailyMission[];
  badges: ArtistBadge[];
  historicalStreaks: HistoricalStreak[];
  annualContributions: AnnualContributionDay[];
  attributeScores: {
    proporcao: number;
    perspectiva: number;
    valores: number;
    traco: number;
    cores: number;
    velocidade: number;
  };
  beforeAfter: {
    beforeImageUrl: string;
    beforeDate: string;
    beforeTitle: string;
    beforeScore: number;
    afterImageUrl: string;
    afterDate: string;
    afterTitle: string;
    afterScore: number;
  };
  recentActivities: {
    id: string;
    date: string;
    title: string;
    medium: string;
    durationMinutes: number;
    score: number;
  }[];
}

