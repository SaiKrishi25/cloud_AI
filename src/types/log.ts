
export type LogSeverity = 'INFO' | 'WARNING' | 'ERROR' | 'CRITICAL';

export type LogClassification = 'safe' | 'warning' | 'threat';

export interface LogEntry {
  id: string;
  timestamp: string;
  message: string;
  resource: string;
  severity: LogSeverity;
  classification: LogClassification;
  source: string;
  user?: string;
  details?: string;
}
