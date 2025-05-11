
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Search, ExternalLink, Lock, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from '@/components/ui/sonner';

interface ExposedResource {
  id: string;
  name: string;
  type: string;
  exposureType: string;
  exposedPorts?: string[];
  risk: 'high' | 'medium' | 'low';
  details: string;
}

const PublicExposureAnalysis = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [exposedResources, setExposedResources] = useState<ExposedResource[]>([]);
  const [selectedTab, setSelectedTab] = useState("all");
  
  const mockExposedResources: ExposedResource[] = [
    {
      id: "r1",
      name: "api-gateway-prod",
      type: "API Gateway",
      exposureType: "Public HTTP Endpoint",
      risk: "medium",
      details: "Publicly accessible without proper request throttling"
    },
    {
      id: "r2",
      name: "logs-bucket-v2",
      type: "Storage Bucket",
      exposureType: "Public Read Access",
      risk: "high",
      details: "Objects can be read by anyone on the internet"
    },
    {
      id: "r3",
      name: "app-vm-1",
      type: "VM Instance",
      exposureType: "Open Ports",
      exposedPorts: ["22/SSH", "3389/RDP", "5432/PostgreSQL"],
      risk: "high",
      details: "Multiple sensitive ports exposed to the internet"
    },
    {
      id: "r4",
      name: "web-lb-frontend",
      type: "Load Balancer",
      exposureType: "Public HTTPS Endpoint",
      risk: "low",
      details: "Public HTTPS endpoint with valid certificate"
    }
  ];
  
  const getRiskColor = (risk: string) => {
    switch (risk) {
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
    setExposedResources([]);
    
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setScanProgress(progress);
      
      if (progress === 40) {
        setExposedResources([mockExposedResources[0], mockExposedResources[1]]);
      } else if (progress === 70) {
        setExposedResources([mockExposedResources[0], mockExposedResources[1], mockExposedResources[2]]);
      } else if (progress === 100) {
        clearInterval(interval);
        setIsScanning(false);
        setExposedResources(mockExposedResources);
        toast("Scan completed", {
          description: "4 publicly exposed resources detected",
          icon: <AlertCircle className="h-4 w-4 text-destructive" />
        });
      }
    }, 400);
  };
  
  const filteredResources = selectedTab === "all" 
    ? exposedResources 
    : exposedResources.filter(r => r.risk === selectedTab);
  
  const handleSecureResource = (id: string) => {
    // In a real app, this would trigger a remediation process
    toast.success("Remediation workflow initiated", {
      description: "Security team notified about exposure"
    });
  };
  
  return (
    <Card className="border-[#33C3F0]/20 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Search className="h-5 w-5 mr-2 text-[#33C3F0]" />
          Public Exposure Analysis
        </CardTitle>
        <CardDescription>
          Detect publicly accessible resources and services across your cloud environment
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
          <div className="space-y-1">
            {!isScanning && exposedResources.length === 0 && (
              <p className="text-sm text-muted-foreground">
                Scan your cloud environment to detect publicly exposed resources
              </p>
            )}
            
            {!isScanning && exposedResources.length > 0 && (
              <div>
                <p className="font-medium">
                  {exposedResources.length} exposed resources detected
                </p>
                <p className="text-sm text-muted-foreground">
                  {exposedResources.filter(r => r.risk === 'high').length} high risk,{' '}
                  {exposedResources.filter(r => r.risk === 'medium').length} medium risk
                </p>
              </div>
            )}
            
            {isScanning && (
              <div className="space-y-2">
                <p className="text-sm font-medium">Scanning for exposed resources...</p>
                <Progress value={scanProgress} className="h-2 w-[200px]" />
              </div>
            )}
          </div>
          
          <Button 
            onClick={startScan} 
            disabled={isScanning}
            className={isScanning ? "opacity-50" : ""}
          >
            {isScanning ? "Scanning..." : "Scan for Exposures"}
          </Button>
        </div>
        
        {exposedResources.length > 0 && (
          <div className="mt-4">
            <Tabs defaultValue="all" className="w-full" value={selectedTab} onValueChange={setSelectedTab}>
              <TabsList className="grid grid-cols-4 mb-4">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="high">High Risk</TabsTrigger>
                <TabsTrigger value="medium">Medium Risk</TabsTrigger>
                <TabsTrigger value="low">Low Risk</TabsTrigger>
              </TabsList>
              
              <TabsContent value={selectedTab} className="space-y-3 mt-2">
                {filteredResources.map((resource) => (
                  <div 
                    key={resource.id} 
                    className="p-3 rounded-md border bg-gray-50 border-gray-200"
                  >
                    <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-3">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="font-medium">{resource.name}</h4>
                          <Badge variant="outline" className="bg-gray-100">
                            {resource.type}
                          </Badge>
                          <Badge className={getRiskColor(resource.risk)}>
                            {resource.risk.toUpperCase()} RISK
                          </Badge>
                        </div>
                        
                        <p className="text-sm font-medium mt-2">{resource.exposureType}</p>
                        
                        {resource.exposedPorts && (
                          <div className="mt-1">
                            <span className="text-xs text-muted-foreground">Exposed ports: </span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {resource.exposedPorts.map((port) => (
                                <Badge key={port} variant="outline" className="text-xs">
                                  {port}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        <p className="text-sm mt-2">{resource.details}</p>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => window.open('#', '_blank')}
                          className="whitespace-nowrap"
                        >
                          <ExternalLink className="h-3 w-3 mr-1" /> View Details
                        </Button>
                        <Button 
                          size="sm" 
                          onClick={() => handleSecureResource(resource.id)}
                          className="whitespace-nowrap"
                        >
                          <Lock className="h-3 w-3 mr-1" /> Secure
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </TabsContent>
            </Tabs>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PublicExposureAnalysis;
