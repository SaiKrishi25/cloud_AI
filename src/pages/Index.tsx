
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, Cloud, ArrowDown, ArrowUp } from 'lucide-react';
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
          <div className="mb-6 inline-block p-3 rounded-full bg-blue-100">
            <Shield className="h-12 w-12 text-[#33C3F0]" />
          </div>
          
          <h1 className="text-4xl sm:text-5xl font-bold text-[#222222] mb-6">
            AI powered cloud security automation
          </h1>
          
          <p className="text-xl text-[#666666] mb-8 max-w-2xl mx-auto">
            Real-time monitoring and threat detection for your Google Cloud Platform. Connect your GCP account to get started with intelligent log analysis.
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
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowGcpPanel(false)}
              className="mb-4"
            >
              <ArrowUp className="h-4 w-4 mr-2" />
              Hide Connection Panel
            </Button>
          )}
        </div>
        
        {showGcpPanel && (
          <div className="mt-8 w-full max-w-2xl animate-fade-in">
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
        )}
        
        <div className={`mt-12 flex items-center ${showGcpPanel ? 'opacity-0' : 'opacity-100'} transition-opacity`}>
          <ArrowDown className="h-5 w-5 text-[#33C3F0] animate-bounce" />
          <span className="ml-2 text-[#666666]">Scroll to learn more</span>
        </div>
      </div>
      
      {/* Features Section */}
      <div className="bg-white py-16 px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-[#222222]">
            Advanced Cloud Security Features
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-[#F1F1F1] shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle>Real-time Monitoring</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-[#666666]">
                  Monitor your cloud infrastructure 24/7 with real-time alerts and notifications for security events.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-[#F1F1F1] shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle>AI-Powered Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-[#666666]">
                  Leverage machine learning to detect anomalies and potential security threats before they become critical.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-[#F1F1F1] shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle>Comprehensive Dashboard</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-[#666666]">
                  View all your security metrics and logs in one place with our intuitive analytical dashboard.
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="text-center mt-12">
            <Button 
              className="bg-[#33C3F0] hover:bg-[#1EAEDB] text-white px-6"
              onClick={() => {
                setShowGcpPanel(true);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              <Cloud className="h-4 w-4 mr-2" />
              Get Started Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
