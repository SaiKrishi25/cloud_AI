
import React, { useState, useEffect, useRef } from 'react';
import Header from '@/components/Header';
import SearchFilters from '@/components/SearchFilters';
import StatusPanel from '@/components/StatusPanel';
import GCPIntegration, { GCPCredentials } from '@/components/GCPIntegration';
import LogList from '@/components/LogList';
import { LogEntry, LogClassification } from '@/types/log';
import { mockLogs, generateNewLog } from '@/data/mockLogs';
import { toast } from '@/components/ui/sonner';
import { AlertCircle, Settings } from 'lucide-react';
import { 
  Sheet, 
  SheetContent, 
  SheetDescription, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SecurityAssistant from '@/components/SecurityAssistant';
import MisconfigurationDetection from '@/components/MisconfigurationDetection';
import PublicExposureAnalysis from '@/components/PublicExposureAnalysis';
import LogAnalysisComponent from '@/components/LogAnalysisComponent';

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
  const [gcpIntegration, setGcpIntegration] = useState<GCPCredentials | null>(null);
  const [logHistory, setLogHistory] = useState([
    { time: '00:00', safe: 12, warning: 3, threat: 1 },
    { time: '01:00', safe: 15, warning: 2, threat: 0 },
    { time: '02:00', safe: 18, warning: 4, threat: 2 },
    { time: '03:00', safe: 14, warning: 2, threat: 1 },
    { time: '04:00', safe: 20, warning: 5, threat: 2 },
  ]);
  const [activeTab, setActiveTab] = useState("logs");
  
  // Fix the type for the interval reference
  const simulationInterval = useRef<ReturnType<typeof setInterval> | null>(null);
  
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
    
    // Update log history with latest counts (for the current hour)
    const now = new Date();
    const hourStr = now.getHours() + ':00';
    
    setLogHistory(prev => {
      // Check if we already have an entry for the current hour
      const existingIndex = prev.findIndex(entry => entry.time === hourStr);
      
      if (existingIndex >= 0) {
        // Update existing entry
        const newHistory = [...prev];
        newHistory[existingIndex] = {
          time: hourStr,
          safe: safeCount,
          warning: warningCount,
          threat: threatCount
        };
        return newHistory;
      } else {
        // Add new entry
        return [
          ...prev,
          {
            time: hourStr,
            safe: safeCount,
            warning: warningCount,
            threat: threatCount
          }
        ].slice(-24); // Keep only the last 24 entries
      }
    });
  }, [logs, safeCount, warningCount, threatCount]);
  
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
  
  // Handle GCP integration
  const handleGCPIntegration = (credentials: GCPCredentials) => {
    setGcpIntegration(credentials);
    
    // If GCP is enabled, adjust the log simulation rate
    if (credentials.enabled) {
      // Clear existing interval and set a faster one
      if (simulationInterval.current !== null) {
        clearInterval(simulationInterval.current);
      }
      
      simulationInterval.current = setInterval(() => {
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
      }, 30000); // New log every 30 seconds for "real" GCP integration
    }
  };
  
  // Simulation of incoming logs
  useEffect(() => {
    simulationInterval.current = setInterval(() => {
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
    }, 30000); // New log every 30 seconds
    
    return () => {
      if (simulationInterval.current !== null) {
        clearInterval(simulationInterval.current);
      }
    };
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
            logHistory={logHistory}
          />
          
          <div className="bg-card p-4">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-4 mb-4">
                <TabsTrigger value="logs">Log Stream</TabsTrigger>
                <TabsTrigger value="assistant">AI Assistant</TabsTrigger>
                <TabsTrigger value="misconfig">Misconfigurations</TabsTrigger>
                <TabsTrigger value="exposure">Exposure Analysis</TabsTrigger>
              </TabsList>
              
              <TabsContent value="logs">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Log Stream</h2>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      Showing {filteredLogs.length} of {logs.length} logs
                    </span>
                    
                    <Sheet>
                      <SheetTrigger asChild>
                        <Button variant="outline" size="icon">
                          <Settings className="h-4 w-4" />
                        </Button>
                      </SheetTrigger>
                      <SheetContent>
                        <SheetHeader>
                          <SheetTitle>Dashboard Settings</SheetTitle>
                          <SheetDescription>
                            Configure GCP Cloud Logging integration and other settings
                          </SheetDescription>
                        </SheetHeader>
                        
                        <div className="mt-6">
                          <Accordion type="single" collapsible defaultValue="gcp">
                            <AccordionItem value="gcp">
                              <AccordionTrigger>GCP Cloud Logging</AccordionTrigger>
                              <AccordionContent>
                                <GCPIntegration onIntegrationComplete={handleGCPIntegration} />
                              </AccordionContent>
                            </AccordionItem>
                            
                            <AccordionItem value="settings">
                              <AccordionTrigger>Dashboard Settings</AccordionTrigger>
                              <AccordionContent>
                                <div className="space-y-4 text-sm">
                                  <p>Additional dashboard settings will be available here.</p>
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                          </Accordion>
                        </div>
                      </SheetContent>
                    </Sheet>
                  </div>
                </div>
                
                <SearchFilters 
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                  classificationFilter={classificationFilter}
                  setClassificationFilter={setClassificationFilter}
                  resourceFilter={resourceFilter}
                  setResourceFilter={setResourceFilter}
                  resources={resources}
                />
                
                <LogList logs={filteredLogs} />
              </TabsContent>
              
              <TabsContent value="assistant">
                <SecurityAssistant />
              </TabsContent>
              
              <TabsContent value="misconfig">
                <MisconfigurationDetection />
              </TabsContent>
              
              <TabsContent value="exposure">
                <PublicExposureAnalysis />
              </TabsContent>
            </Tabs>
          </div>
        </div>
        
        <div className="mt-6 grid grid-cols-1 gap-6">
          <LogAnalysisComponent />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
