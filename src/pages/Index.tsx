
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Cloud } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import GCPIntegration, { GCPCredentials } from '@/components/GCPIntegration';

const Index = () => {
  const navigate = useNavigate();
  const [showGcpPanel, setShowGcpPanel] = useState(false);
  
  const handleGCPIntegration = (credentials: GCPCredentials) => {
    // Navigate to dashboard after successful connection
    if (credentials.enabled) {
      navigate('/dashboard');
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-[#f5f9ff]">
      {/* Hero Section */}
      <div className="flex-grow flex flex-col items-center justify-center p-8">
        <div className="text-center max-w-3xl">          
          <h1 className="text-4xl sm:text-5xl font-bold text-[#222222] mb-6">
            AI powered cloud security automation
          </h1>
          
          <p className="text-xl text-[#666666] mb-8 max-w-2xl mx-auto">
            Proactive cloud security with AI-powered analysis, threat detection, and automated remediation.
          </p>

          {!showGcpPanel ? (
            <Button 
              size="lg" 
              className="bg-[#33C3F0] hover:bg-[#1EAEDB] text-white px-8 py-6 h-auto text-lg"
              onClick={() => setShowGcpPanel(true)}
            >
              <Cloud className="h-5 w-5 mr-2" />
              Connect to Google Cloud
            </Button>
          ) : (
            <Card className="border-[#33C3F0]/20 shadow-lg">
              <CardHeader>
                <CardTitle className="text-[#222222]">Connect to Google Cloud Platform</CardTitle>
                <CardDescription>
                  Set up your GCP integration to enable real-time log monitoring
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <GCPIntegration onIntegrationComplete={handleGCPIntegration} />
              </CardContent>
              
              <CardFooter className="flex justify-between border-t p-4 bg-gray-50">
                <Button 
                  variant="outline" 
                  onClick={() => setShowGcpPanel(false)}
                >
                  Cancel
                </Button>
                
                <Button
                  variant="ghost"
                  onClick={() => navigate('/dashboard')}
                >
                  Continue without connecting
                </Button>
              </CardFooter>
            </Card>
          )}
          
          <Alert className="mt-4 bg-blue-50 border-[#33C3F0]/20">
            <Cloud className="h-4 w-4 text-[#33C3F0]" />
            <AlertTitle>Demo Mode Available</AlertTitle>
            <AlertDescription>
              You can explore the dashboard with simulated data without connecting your GCP account.
              <Button 
                variant="link" 
                onClick={() => navigate('/dashboard')}
                className="text-[#33C3F0] p-0 h-auto"
              >
                Continue to demo
              </Button>
            </AlertDescription>
          </Alert>
        </div>
      </div>
    </div>
  );
};

export default Index;
