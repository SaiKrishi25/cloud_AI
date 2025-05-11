
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, Database, Eye, Filter, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from '@/components/ui/sonner';

interface LogAlert {
  id: string;
  timestamp: string;
  message: string;
  source: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  details: string;
}

const LogAnalysisComponent = () => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectProgress, setConnectProgress] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const [logAlerts, setLogAlerts] = useState<LogAlert[]>([]);
  
  const mockLogAlerts: LogAlert[] = [
    {
      id: "l1",
      timestamp: "2023-05-11T14:32:05Z",
      message: "Multiple failed login attempts detected",
      source: "Auth Service",
      severity: "high",
      details: "10 failed login attempts for user admin from IP 192.168.1.24 in the last 2 minutes"
    },
    {
      id: "l2",
      timestamp: "2023-05-11T14:28:12Z",
      message: "Unusual API access pattern detected",
      source: "API Gateway",
      severity: "medium",
      details: "Unusual number of requests to /admin/users endpoint from IP 203.0.113.42"
    },
    {
      id: "l3",
      timestamp: "2023-05-11T14:15:33Z",
      message: "Critical security group change",
      source: "CloudTrail",
      severity: "critical",
      details: "Security group sg-1a2b3c4d was modified to allow all inbound traffic on port 22"
    },
    {
      id: "l4",
      timestamp: "2023-05-11T13:55:18Z",
      message: "Database connection spike",
      source: "RDS Monitoring",
      severity: "low",
      details: "Unusual spike in database connections detected on db-production-1"
    }
  ];
  
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-destructive text-destructive-foreground';
      case 'high':
        return 'bg-destructive/80 text-destructive-foreground';
      case 'medium':
        return 'bg-warning text-warning-foreground';
      case 'low':
        return 'bg-blue-500/70 text-white';
      default:
        return '';
    }
  };
  
  const connectToLogs = () => {
    setIsConnecting(true);
    setConnectProgress(0);
    setLogAlerts([]);
    
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setConnectProgress(progress);
      
      if (progress === 50) {
        setLogAlerts([mockLogAlerts[0]]);
      } else if (progress === 80) {
        setLogAlerts([mockLogAlerts[0], mockLogAlerts[1]]);
      } else if (progress === 100) {
        clearInterval(interval);
        setIsConnecting(false);
        setIsConnected(true);
        setLogAlerts(mockLogAlerts);
        toast.warning("Security threats detected in logs", {
          description: "1 critical alert, 1 high severity alert",
          icon: <AlertCircle className="h-4 w-4" />
        });
        
        // Simulate new log alert coming in after connection
        setTimeout(() => {
          const newAlert: LogAlert = {
            id: "l5",
            timestamp: new Date().toISOString(),
            message: "New IAM role created with admin privileges",
            source: "CloudTrail",
            severity: "critical",
            details: "IAM role 'temp-admin-role' created with AdministratorAccess policy attached"
          };
          
          setLogAlerts(prev => [newAlert, ...prev]);
          
          toast.error("Critical security alert", {
            description: "New IAM role created with admin privileges",
            icon: <AlertCircle className="h-4 w-4" />
          });
        }, 5000);
      }
    }, 400);
  };
  
  const formatTimestamp = (timestamp: string) => {
    try {
      return new Date(timestamp).toLocaleTimeString();
    } catch (e) {
      return timestamp;
    }
  };

  return (
    <Card className="border-[#33C3F0]/20 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Database className="h-5 w-5 mr-2 text-[#33C3F0]" />
          Log Analysis & Threat Detection
        </CardTitle>
        <CardDescription>
          Analyze cloud logs in real-time to identify security threats and suspicious activities
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
          <div className="space-y-1">
            {!isConnected && !isConnecting && (
              <p className="text-sm text-muted-foreground">
                Connect to your cloud logs to enable real-time threat detection
              </p>
            )}
            
            {isConnected && (
              <div>
                <p className="font-medium">
                  Connected to cloud logs
                </p>
                <p className="text-sm text-muted-foreground">
                  {logAlerts.filter(a => a.severity === 'critical' || a.severity === 'high').length} high priority alerts detected
                </p>
              </div>
            )}
            
            {isConnecting && (
              <div className="space-y-2">
                <p className="text-sm font-medium">Connecting to log sources...</p>
                <Progress value={connectProgress} className="h-2 w-[200px]" />
              </div>
            )}
          </div>
          
          <Button 
            onClick={connectToLogs} 
            disabled={isConnecting || isConnected}
            className={(isConnecting || isConnected) ? "opacity-50" : ""}
          >
            {isConnecting ? "Connecting..." : isConnected ? "Connected" : "Connect to Logs"}
          </Button>
        </div>
        
        {isConnected && logAlerts.length > 0 && (
          <div className="mt-4 space-y-2">
            <div className="flex justify-between items-center">
              <h4 className="text-sm font-medium">Security Alerts</h4>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" className="h-7 px-2">
                  <Filter className="h-3 w-3 mr-1" /> Filter
                </Button>
                <Button variant="ghost" size="sm" className="h-7 px-2" onClick={() => navigate('/dashboard')}>
                  <Eye className="h-3 w-3 mr-1" /> View All <ArrowRight className="h-3 w-3 ml-1" />
                </Button>
              </div>
            </div>
            
            <ScrollArea className="h-[250px] border rounded-md bg-gray-50 p-1">
              <div className="space-y-2 p-2">
                {logAlerts.map((alert) => (
                  <div 
                    key={alert.id} 
                    className="p-3 rounded-md border bg-white border-gray-200"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2">
                          <Badge className={getSeverityColor(alert.severity)}>
                            {alert.severity.toUpperCase()}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {formatTimestamp(alert.timestamp)}
                          </span>
                          <Badge variant="outline" className="bg-gray-100">
                            {alert.source}
                          </Badge>
                        </div>
                        
                        <h4 className="font-medium mt-1">{alert.message}</h4>
                        <p className="text-sm mt-1 text-muted-foreground">{alert.details}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LogAnalysisComponent;
