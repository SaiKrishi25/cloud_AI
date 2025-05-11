
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Check, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { toast } from '@/components/ui/sonner';

interface Misconfiguration {
  id: string;
  name: string;
  description: string;
  severity: 'high' | 'medium' | 'low';
  status: 'detected' | 'fixed';
  service: string;
}

const MisconfigurationDetection = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [misconfigurations, setMisconfigurations] = useState<Misconfiguration[]>([]);
  
  const mockMisconfigurations: Misconfiguration[] = [
    {
      id: "m1",
      name: "Public S3 Bucket",
      description: "S3 bucket 'app-logs-prod' has public read access enabled",
      severity: "high",
      status: "detected",
      service: "AWS S3"
    },
    {
      id: "m2",
      name: "Missing Encryption",
      description: "RDS instance 'db-production' is not using encryption at rest",
      severity: "medium",
      status: "detected",
      service: "AWS RDS"
    },
    {
      id: "m3",
      name: "Excessive IAM Permissions",
      description: "Service account 'app-backend' has overly permissive IAM roles",
      severity: "high",
      status: "detected",
      service: "GCP IAM"
    },
    {
      id: "m4",
      name: "Default VPC NACL",
      description: "Default NACL in VPC-23 allows all inbound traffic",
      severity: "medium",
      status: "detected",
      service: "AWS VPC"
    }
  ];
  
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'bg-destructive/10 text-destructive border-destructive/30';
      case 'medium':
        return 'bg-warning/10 text-warning border-warning/30';
      case 'low':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/30';
      default:
        return '';
    }
  };
  
  const startScan = () => {
    setIsScanning(true);
    setScanProgress(0);
    setMisconfigurations([]);
    
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setScanProgress(progress);
      
      if (progress === 30) {
        setMisconfigurations([mockMisconfigurations[0]]);
      } else if (progress === 60) {
        setMisconfigurations([mockMisconfigurations[0], mockMisconfigurations[1], mockMisconfigurations[2]]);
      } else if (progress === 100) {
        clearInterval(interval);
        setIsScanning(false);
        setMisconfigurations(mockMisconfigurations);
        toast.warning("Scan completed - 4 security misconfigurations detected", {
          icon: <AlertTriangle className="h-4 w-4" />
        });
      }
    }, 400);
  };
  
  const handleFixMisconfiguration = (id: string) => {
    setMisconfigurations(prev => 
      prev.map(item => 
        item.id === id ? { ...item, status: 'fixed' } : item
      )
    );
    
    toast.success("Misconfiguration fixed successfully", {
      icon: <Check className="h-4 w-4" />
    });
  };
  
  return (
    <Card className="border-[#33C3F0]/20 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center">
          <AlertTriangle className="h-5 w-5 mr-2 text-[#33C3F0]" />
          Misconfiguration Detection
        </CardTitle>
        <CardDescription>
          Find and fix security misconfigurations across your cloud environments
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            {!isScanning && misconfigurations.length === 0 && (
              <p className="text-sm text-muted-foreground">
                Run a scan to detect security misconfigurations in your cloud resources
              </p>
            )}
            
            {!isScanning && misconfigurations.length > 0 && (
              <div>
                <p className="font-medium">
                  {misconfigurations.filter(m => m.status === 'detected').length} issues detected
                </p>
                <p className="text-sm text-muted-foreground">
                  {misconfigurations.filter(m => m.status === 'fixed').length} fixed
                </p>
              </div>
            )}
            
            {isScanning && (
              <div className="space-y-2">
                <p className="text-sm font-medium">Scanning resources...</p>
                <Progress value={scanProgress} className="h-2 w-[200px]" />
              </div>
            )}
          </div>
          
          <Button 
            onClick={startScan} 
            disabled={isScanning}
            className={isScanning ? "opacity-50" : ""}
          >
            {isScanning ? "Scanning..." : "Scan Now"}
          </Button>
        </div>
        
        {misconfigurations.length > 0 && (
          <div className="mt-4 space-y-3">
            {misconfigurations.map((issue) => (
              <div 
                key={issue.id} 
                className={`p-3 rounded-md border ${
                  issue.status === 'fixed' ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{issue.name}</h4>
                      <Badge className={getSeverityColor(issue.severity)}>
                        {issue.severity.toUpperCase()}
                      </Badge>
                      <Badge variant="outline" className="bg-gray-100">
                        {issue.service}
                      </Badge>
                    </div>
                    
                    <p className="text-sm mt-1">{issue.description}</p>
                  </div>
                  
                  {issue.status === 'detected' ? (
                    <Button 
                      size="sm" 
                      onClick={() => handleFixMisconfiguration(issue.id)}
                    >
                      Fix Issue <ArrowRight className="ml-1 h-3 w-3" />
                    </Button>
                  ) : (
                    <Badge className="bg-green-100 text-green-800 border-green-200">
                      <Check className="h-3 w-3 mr-1" /> Fixed
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MisconfigurationDetection;
