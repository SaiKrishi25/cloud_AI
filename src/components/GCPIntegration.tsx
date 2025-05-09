
import React, { useState } from 'react';
import { Cloud, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/components/ui/sonner';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface GCPIntegrationProps {
  onIntegrationComplete?: (credentials: GCPCredentials) => void;
}

export interface GCPCredentials {
  projectId: string;
  apiKey?: string;
  serviceAccountKey?: string;
  enabled: boolean;
}

const GCPIntegration = ({ onIntegrationComplete }: GCPIntegrationProps) => {
  const [credentials, setCredentials] = useState<GCPCredentials>({
    projectId: '',
    apiKey: '',
    serviceAccountKey: '',
    enabled: false
  });
  
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const handleConnect = () => {
    // Validate inputs
    if (!credentials.projectId) {
      toast.error('Project ID is required');
      return;
    }
    
    // Simulate connection process
    setLoading(true);
    
    // Simulate API connection with a delay
    setTimeout(() => {
      setConnected(true);
      setLoading(false);
      toast.success('Successfully connected to GCP Cloud Logging');
      
      if (onIntegrationComplete) {
        onIntegrationComplete({
          ...credentials,
          enabled: true
        });
      }
    }, 1500);
  };
  
  const handleDisconnect = () => {
    setConnected(false);
    setCredentials({
      projectId: '',
      apiKey: '',
      serviceAccountKey: '',
      enabled: false
    });
    toast.info('Disconnected from GCP Cloud Logging');
  };
  
  const handleToggleEnabled = (enabled: boolean) => {
    setCredentials({
      ...credentials,
      enabled
    });
    
    toast.info(enabled ? 'GCP log streaming enabled' : 'GCP log streaming paused');
    
    if (onIntegrationComplete) {
      onIntegrationComplete({
        ...credentials,
        enabled
      });
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Cloud className="h-6 w-6 mr-2 text-primary" />
          GCP Cloud Logging Integration
        </CardTitle>
      </CardHeader>
      <CardContent>
        {connected ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Check className="h-5 w-5 text-success" />
                <span className="font-medium">Connected to GCP</span>
                <span className="text-sm text-muted-foreground">{credentials.projectId}</span>
              </div>
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleDisconnect}
              >
                <X className="h-4 w-4 mr-1" />
                Disconnect
              </Button>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <Label htmlFor="stream-toggle">Stream logs from GCP</Label>
              <Switch
                id="stream-toggle"
                checked={credentials.enabled}
                onCheckedChange={handleToggleEnabled}
              />
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="project-id">GCP Project ID</Label>
              <Input
                id="project-id"
                value={credentials.projectId}
                onChange={(e) => setCredentials({ ...credentials, projectId: e.target.value })}
                placeholder="my-gcp-project-id"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="api-key">API Key (optional)</Label>
              <Input
                id="api-key"
                type="password"
                value={credentials.apiKey || ''}
                onChange={(e) => setCredentials({ ...credentials, apiKey: e.target.value })}
                placeholder="GCP API Key"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="service-account">Service Account JSON Key (optional)</Label>
              <Input
                id="service-account"
                type="file"
                className="cursor-pointer"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                      setCredentials({
                        ...credentials,
                        serviceAccountKey: event.target?.result as string
                      });
                    };
                    reader.readAsText(file);
                  }
                }}
              />
            </div>
            
            <Button 
              className="w-full" 
              onClick={handleConnect}
              disabled={loading}
            >
              {loading ? 'Connecting...' : 'Connect to GCP Cloud Logging'}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GCPIntegration;
