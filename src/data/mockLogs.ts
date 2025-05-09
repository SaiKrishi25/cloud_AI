import { v4 as uuidv4 } from 'uuid';
import { LogEntry, LogClassification, LogSeverity } from '@/types/log';

export const mockLogs: LogEntry[] = [
  {
    id: uuidv4(),
    timestamp: '2024-07-23T10:00:00Z',
    message: 'Authentication failed for user JohnDoe from 192.168.1.100',
    resource: 'Authentication Service',
    severity: 'ERROR',
    classification: 'threat',
    source: 'Firewall',
    user: 'JohnDoe',
    details: 'Multiple failed login attempts detected.'
  },
  {
    id: uuidv4(),
    timestamp: '2024-07-23T10:05:00Z',
    message: 'CPU usage high on server DB-002',
    resource: 'DB-002',
    severity: 'WARNING',
    classification: 'warning',
    source: 'Monitoring System',
    details: 'CPU utilization exceeded 90% for 5 minutes.'
  },
  {
    id: uuidv4(),
    timestamp: '2024-07-23T10:10:00Z',
    message: 'Successful database backup completed',
    resource: 'Backup Service',
    severity: 'INFO',
    classification: 'safe',
    source: 'Backup System'
  },
  {
    id: uuidv4(),
    timestamp: '2024-07-23T10:15:00Z',
    message: 'Malware detected in file upload by user JaneDoe',
    resource: 'File Upload Service',
    severity: 'CRITICAL',
    classification: 'threat',
    source: 'Antivirus',
    user: 'JaneDoe',
    details: 'Trojan detected in uploaded file.'
  },
  {
    id: uuidv4(),
    timestamp: '2024-07-23T10:20:00Z',
    message: 'Memory usage critical on server APP-001',
    resource: 'APP-001',
    severity: 'ERROR',
    classification: 'threat',
    source: 'Monitoring System',
    details: 'Memory utilization exceeded 95% causing service degradation.'
  },
  {
    id: uuidv4(),
    timestamp: '2024-07-23T10:25:00Z',
    message: 'Firewall blocked connection attempt from suspicious IP 10.0.0.5',
    resource: 'Firewall',
    severity: 'WARNING',
    classification: 'warning',
    source: 'Firewall',
    details: 'Connection blocked due to blacklisted IP address.'
  },
  {
    id: uuidv4(),
    timestamp: '2024-07-23T10:30:00Z',
    message: 'Application update deployed successfully',
    resource: 'Deployment Service',
    severity: 'INFO',
    classification: 'safe',
    source: 'Deployment System'
  },
  {
    id: uuidv4(),
    timestamp: '2024-07-23T10:35:00Z',
    message: 'Unusual network activity detected from server WEB-001',
    resource: 'WEB-001',
    severity: 'WARNING',
    classification: 'warning',
    source: 'Network Monitoring',
    details: 'High outbound traffic detected.'
  },
  {
    id: uuidv4(),
    timestamp: '2024-07-23T10:40:00Z',
    message: 'User access granted to sensitive data',
    resource: 'Access Control',
    severity: 'INFO',
    classification: 'safe',
    source: 'Authorization System',
    user: 'Alice'
  },
  {
    id: uuidv4(),
    timestamp: '2024-07-23T10:45:00Z',
    message: 'Potential SQL injection attempt blocked',
    resource: 'Database Security',
    severity: 'CRITICAL',
    classification: 'threat',
    source: 'Intrusion Detection System',
    details: 'SQL injection pattern detected in user input.'
  }
];

// Function to generate a new mock log entry
export const generateNewLog = (): LogEntry => {
  const severities: LogSeverity[] = ['INFO', 'WARNING', 'ERROR', 'CRITICAL'];
  const classifications: LogClassification[] = ['safe', 'warning', 'threat'];
  const resources = ['Authentication Service', 'DB-002', 'Backup Service', 'File Upload Service', 'APP-001', 'Firewall', 'Deployment Service', 'WEB-001', 'Access Control', 'Database Security'];
  const sources = ['Firewall', 'Monitoring System', 'Backup System', 'Antivirus', 'Network Monitoring', 'Intrusion Detection System', 'Authorization System'];

  const randomItem = (array: any[]) => array[Math.floor(Math.random() * array.length)];

  const severity = randomItem(severities);
  const classification = randomItem(classifications);
  const resource = randomItem(resources);
  const source = randomItem(sources);

  const message = `Log from ${resource} with severity ${severity}`;

  return {
    id: uuidv4(),
    timestamp: new Date().toISOString(),
    message: message,
    resource: resource,
    severity: severity,
    classification: classification,
    source: source,
    user: Math.random() > 0.5 ? 'SomeUser' : undefined,
    details: Math.random() > 0.5 ? 'Some details about the log' : undefined,
  };
};
