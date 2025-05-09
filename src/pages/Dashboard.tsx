
import React, { useState, useEffect, useCallback } from 'react';
import Header from '@/components/Header';
import SearchFilters from '@/components/SearchFilters';
import StatusPanel from '@/components/StatusPanel';
import LogList from '@/components/LogList';
import { LogEntry, LogClassification } from '@/types/log';
import { mockLogs, generateNewLog } from '@/data/mockLogs';
import { toast } from '@/components/ui/sonner';
import { AlertCircle } from 'lucide-react';

const Dashboard = () => {
  const [logs, setLogs] = useState<LogEntry[]>([...mockLogs]);
  const [filteredLogs, setFilteredLogs] = useState<LogEntry[]>([...mockLogs]);
  const [searchTerm, setSearchTerm] = useState('');
  const [classificationFilter, setClassificationFilter] = useState<LogClassification | 'all'>('all');
  const [resourceFilter, setResourceFilter] = useState<string | 'all'>('all');
  const [resources, setResources] = useState<string[]>([]);
  const [safeCount, setSafeCount] = useState(0);
  const [warningCount, setWarningCount] = useState(0);
  const [threatCount, setThreatCount] = useState(0);
  const [logsProcessed, setLogsProcessed] = useState(2834);
  const [threatPercentage, setThreatPercentage] = useState(8);
  
  // Initialize unique resources
  useEffect(() => {
    const uniqueResources = [...new Set(logs.map(log => log.resource))];
    setResources(uniqueResources);
  }, [logs]);
  
  // Update counts
  useEffect(() => {
    setSafeCount(logs.filter(log => log.classification === 'safe').length);
    setWarningCount(logs.filter(log => log.classification === 'warning').length);
    setThreatCount(logs.filter(log => log.classification === 'threat').length);
    
    // Calculate threat percentage
    const total = logs.length;
    if (total > 0) {
      const threats = logs.filter(log => log.classification === 'threat').length;
      const warnings = logs.filter(log => log.classification === 'warning').length;
      const calculatedPercentage = Math.round((threats * 1.0 + warnings * 0.3) / total * 100);
      setThreatPercentage(calculatedPercentage);
    }
  }, [logs]);
  
  // Filter logs based on search and filters
  useEffect(() => {
    let filtered = [...logs];
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(log => 
        log.message.toLowerCase().includes(term) || 
        log.resource.toLowerCase().includes(term) || 
        log.source.toLowerCase().includes(term) ||
        (log.user && log.user.toLowerCase().includes(term)) ||
        (log.details && log.details.toLowerCase().includes(term))
      );
    }
    
    if (classificationFilter !== 'all') {
      filtered = filtered.filter(log => log.classification === classificationFilter);
    }
    
    if (resourceFilter !== 'all') {
      filtered = filtered.filter(log => log.resource === resourceFilter);
    }
    
    setFilteredLogs(filtered);
  }, [logs, searchTerm, classificationFilter, resourceFilter]);
  
  // Simulation of incoming logs
  useEffect(() => {
    const interval = setInterval(() => {
      const newLog = generateNewLog();
      setLogs(prevLogs => [newLog, ...prevLogs]);
      setLogsProcessed(prev => prev + 1);
      
      // Show toast notification for threats
      if (newLog.classification === 'threat') {
        toast("Security Threat Detected", {
          description: newLog.message,
          duration: 5000,
          icon: <AlertCircle className="h-4 w-4 text-destructive" />,
        });
      }
    }, 8000); // New log every 8 seconds
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-6 max-w-7xl">
        <div className="rounded-lg border border-border overflow-hidden shadow-lg">
          <Header 
            safeCount={safeCount} 
            warningCount={warningCount} 
            threatCount={threatCount} 
          />
          
          <StatusPanel 
            logsProcessed={logsProcessed}
            threatPercentage={threatPercentage}
          />
          
          <SearchFilters 
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            classificationFilter={classificationFilter}
            setClassificationFilter={setClassificationFilter}
            resourceFilter={resourceFilter}
            setResourceFilter={setResourceFilter}
            resources={resources}
          />
          
          <div className="bg-card p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Log Stream</h2>
              <span className="text-sm text-muted-foreground">
                Showing {filteredLogs.length} of {logs.length} logs
              </span>
            </div>
            
            <LogList logs={filteredLogs} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
