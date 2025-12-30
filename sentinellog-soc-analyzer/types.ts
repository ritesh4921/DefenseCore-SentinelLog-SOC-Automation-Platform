
export interface LogEntry {
  timestamp: string;
  user: string;
  ip: string;
  raw: string;
  dateObj: Date;
  type: 'Failed' | 'Success';
}

export interface MitreMapping {
  id: string;
  name: string;
  tactic: string;
  description: string;
}

export interface AttackerStats {
  ip: string;
  failedAttempts: number;
  usersTargeted: string[];
  firstSeen: string;
  lastSeen: string;
  score: number;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  severityExplanation: string;
  country?: string;
  countryCode?: string;
  successfulLoginDetected: boolean;
  verdict: 'True Positive - Confirmed Compromise' | 'True Positive - Attack Attempt' | 'False Positive' | 'Under Investigation';
}

export interface IncidentReport {
  incidentType: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  systemCompromised: boolean;
  verdict: string;
  plainEnglishSummary: string;
  severityReasoning: string[];
  attackFlow: string[];
  actionSteps: {
    immediate: string[];
    shortTerm: string[];
    longTerm: string[];
  };
  falsePositiveLikelihood: number;
  confidenceScore: number;
  confidenceExplanation: string;
  mitreMapping: MitreMapping[];
}

export interface AnalysisResult {
  attackers: AttackerStats[];
  totalFailedAttempts: number;
  totalSuccessfulLogins: number;
  report?: IncidentReport;
  stats: {
    rootTargeted: boolean;
    peakHour: number;
    uniqueIPs: number;
    breachesDetected: number;
    systemCompromised: boolean;
  }
}

export enum AppStatus {
  UNAUTHENTICATED = 'unauthenticated',
  IDLE = 'idle',
  PREPROCESSING = 'preprocessing',
  PARSING = 'parsing',
  ANALYZING = 'analyzing',
  COMPLETED = 'completed',
  ERROR = 'error'
}
