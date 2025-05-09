
import { LogEntry, LogClassification, LogSeverity } from '../types/log';

export const mockLogs: LogEntry[] = [
  {
    id: '1',
    timestamp: new Date(Date.now() - 1000 * 60 * 2).toISOString(),
    message: 'User authentication successful',
    resource: 'IAM',
    severity: 'INFO',
    classification: 'safe',
    source: 'Cloud IAM',
    user: 'admin@company.com'
  },
  {
    id: '2',
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    message: 'Multiple failed login attempts detected',
    resource: 'IAM',
    severity: 'WARNING',
    classification: 'warning',
    source: 'Cloud IAM',
    user: 'unknown',
    details: '5 failed attempts from IP 203.0.113.42'
  },
  {
    id: '3',
    timestamp: new Date(Date.now() - 1000 * 60 * 8).toISOString(),
    message: 'Storage bucket permissions changed',
    resource: 'Cloud Storage',
    severity: 'INFO',
    classification: 'safe',
    source: 'Google Cloud Storage',
    user: 'devops@company.com'
  },
  {
    id: '4',
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    message: 'Unusual API access pattern detected',
    resource: 'Compute Engine',
    severity: 'WARNING',
    classification: 'warning',
    source: 'Cloud Audit',
    details: 'High frequency of API calls from rare location'
  },
  {
    id: '5',
    timestamp: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
    message: 'Potential privilege escalation attempt',
    resource: 'IAM',
    severity: 'CRITICAL',
    classification: 'threat',
    source: 'Cloud IAM',
    user: 'support@company.com',
    details: 'Attempted to modify admin role permissions'
  },
  {
    id: '6',
    timestamp: new Date(Date.now() - 1000 * 60 * 32).toISOString(),
    message: 'Network firewall rule modified',
    resource: 'VPC',
    severity: 'INFO',
    classification: 'safe',
    source: 'Cloud VPC',
    user: 'network-admin@company.com'
  },
  {
    id: '7',
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    message: 'Suspicious outbound data transfer',
    resource: 'Compute Engine',
    severity: 'ERROR',
    classification: 'threat',
    source: 'Cloud DLP',
    details: 'Large volume of data transferred to unrecognized external IP'
  },
  {
    id: '8',
    timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    message: 'VM instance created',
    resource: 'Compute Engine',
    severity: 'INFO',
    classification: 'safe',
    source: 'Compute Engine',
    user: 'deployment@company.com'
  },
  {
    id: '9',
    timestamp: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
    message: 'Billing threshold exceeded',
    resource: 'Billing',
    severity: 'WARNING',
    classification: 'warning',
    source: 'Cloud Billing',
    details: 'Daily spending limit exceeded by 15%'
  },
  {
    id: '10',
    timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    message: 'Database access from unauthorized location',
    resource: 'Cloud SQL',
    severity: 'CRITICAL',
    classification: 'threat',
    source: 'Cloud SQL',
    details: 'Admin access from unrecognized IP address'
  }
];

export const generateNewLog = (): LogEntry => {
  const classifications: LogClassification[] = ['safe', 'warning', 'threat'];
  const severities: LogSeverity[] = ['INFO', 'WARNING', 'ERROR', 'CRITICAL'];
  const resources = ['IAM', 'Compute Engine', 'Cloud Storage', 'Cloud SQL', 'VPC', 'Billing'];
  const users = ['admin@company.com', 'devops@company.com', 'user@company.com', 'unknown'];
  
  const randomClassification = classifications[Math.floor(Math.random() * classifications.length)];
  const randomSeverity = severities[Math.floor(Math.random() * severities.length)];
  const randomResource = resources[Math.floor(Math.random() * resources.length)];
  const randomUser = Math.random() > 0.3 ? users[Math.floor(Math.random() * users.length)] : undefined;
  
  let message = '';
  if (randomClassification === 'safe') {
    message = [
      'User authentication successful',
      'Resource access granted',
      'Configuration updated',
      'Backup completed successfully',
      'VM instance created',
      'Storage bucket permissions updated'
    ][Math.floor(Math.random() * 6)];
  } else if (randomClassification === 'warning') {
    message = [
      'Multiple failed login attempts',
      'Unusual API access pattern',
      'Billing threshold exceeded',
      'High CPU utilization detected',
      'Low storage space warning',
      'Network latency increased'
    ][Math.floor(Math.random() * 6)];
  } else {
    message = [
      'Potential privilege escalation attempt',
      'Suspicious outbound data transfer',
      'Unauthorized resource access',
      'Database access from unauthorized location',
      'Potential data exfiltration detected',
      'Malicious script execution attempt'
    ][Math.floor(Math.random() * 6)];
  }
  
  return {
    id: Date.now().toString(),
    timestamp: new Date().toISOString(),
    message,
    resource: randomResource,
    severity: randomSeverity,
    classification: randomClassification,
    source: `Cloud ${randomResource}`,
    user: randomUser,
    details: randomClassification !== 'safe' ? `Details for ${message.toLowerCase()}` : undefined
  };
};
