
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Code, Send, Play, Copy } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const SecurityAssistant = () => {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [apiKey, setApiKey] = useLocalStorage('llm-api-key', '');
  const [showApiKeyInput, setShowApiKeyInput] = useState(!apiKey);
  const [activeTab, setActiveTab] = useState("command");
  const [sandboxOutput, setSandboxOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  
  const examples = [
    "Find all publicly accessible S3 buckets in my AWS environment",
    "List resources with excessive IAM permissions",
    "Check for unencrypted databases in my cloud environment",
    "Detect instances without proper security groups"
  ];

  const processQuery = async () => {
    if (!query.trim()) {
      toast.warning("Please enter a security query");
      return;
    }
    
    if (!apiKey) {
      setShowApiKeyInput(true);
      toast.warning("Please add your API key first");
      return;
    }
    
    setIsProcessing(true);
    setResponse('');
    setSandboxOutput('');
    
    try {
      // Simulate LLM processing
      setTimeout(() => {
        const responses = {
          "Find all publicly accessible S3 buckets in my AWS environment": 
            `aws s3api list-buckets --query 'Buckets[].Name' | jq -r '.[]' | xargs -I {} aws s3api get-bucket-policy-status --bucket {} --query 'PolicyStatus.IsPublic' 2>/dev/null | grep true --before 1`,
          "List resources with excessive IAM permissions": 
            `aws accessanalyzer start-policy-generation --policy-generation-details '{\"principalArn\":\"arn:aws:iam::123456789012:role/MyRole\"}'`,
          "Check for unencrypted databases in my cloud environment": 
            `aws rds describe-db-instances --query 'DBInstances[*].[DBInstanceIdentifier,StorageEncrypted]' --output table`,
          "Detect instances without proper security groups": 
            `aws ec2 describe-security-groups --filters Name=ip-permission.cidr,Values='0.0.0.0/0' --query 'SecurityGroups[*].[GroupId,GroupName]' --output table`
        };
        
        const defaultResponse = `aws cloudtrail lookup-events --lookup-attributes AttributeKey=EventName,AttributeValue=ConsoleLogin`;
        
        setResponse(responses[query] || defaultResponse);
        setIsProcessing(false);
      }, 1500);
    } catch (error) {
      console.error("Error processing security query", error);
      toast.error("Failed to process your query");
      setIsProcessing(false);
    }
  };

  const handleExampleClick = (example: string) => {
    setQuery(example);
  };
  
  const runInSandbox = () => {
    if (!response) return;
    
    setIsRunning(true);
    setSandboxOutput('');
    
    // Simulate running the command in a sandbox environment
    setTimeout(() => {
      const outputs = {
        "Find all publicly accessible S3 buckets in my AWS environment": 
          `"my-public-bucket-123"\nPolicyStatus:\n  IsPublic: true\n\n"company-website-assets"\nPolicyStatus:\n  IsPublic: true\n\n"analytics-reports-public"\nPolicyStatus:\n  IsPublic: true`,
        "List resources with excessive IAM permissions": 
          `{\n  "jobId": "aae12ed5-5850-4a72-94bf-82e3fe5dbb79",\n  "policyGenerationDetails": {\n    "principalArn": "arn:aws:iam::123456789012:role/MyRole"\n  }\n}\n\nExcessive permissions found:\n- s3:* on all resources\n- ec2:* on all resources\n- dynamodb:* on all resources`,
        "Check for unencrypted databases in my cloud environment": 
          `--------------------------------------\n| DBInstanceIdentifier | StorageEncrypted |\n--------------------------------------\n| production-db-1      | false            |\n| analytics-db         | true             |\n| customer-data        | false            |\n--------------------------------------`,
        "Detect instances without proper security groups": 
          `-----------------------------\n| GroupId       | GroupName      |\n-----------------------------\n| sg-0123456789 | public-access  |\n| sg-9876543210 | default        |\n| sg-1a2b3c4d5e | web-servers    |\n-----------------------------\n\nInstances with vulnerable security groups:\n---------------------------------\n| InstanceId    | State         |\n---------------------------------\n| i-0abc123def  | running       |\n| i-9xyz876wvu  | running       |\n---------------------------------`
      };
      
      const defaultOutput = `Looking up CloudTrail events...\n\n--------------------------------------------\n| EventName  | Username | EventTime           |\n--------------------------------------------\n| ConsoleLogin| admin     | 2023-05-11T14:32:05Z |\n| ConsoleLogin| readonly  | 2023-05-11T13:45:22Z |\n| ConsoleLogin| readonly  | 2023-05-11T12:30:10Z |\n--------------------------------------------`;
      
      let output = '';
      
      for (const [example, exampleOutput] of Object.entries(outputs)) {
        if (query === example) {
          output = exampleOutput;
          break;
        }
      }
      
      setSandboxOutput(output || defaultOutput);
      setIsRunning(false);
    }, 2000);
    
    // Switch to output tab
    setActiveTab("output");
  };

  return (
    <Card className="border-[#33C3F0]/20 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Code className="h-5 w-5 mr-2 text-[#33C3F0]" />
          AI-Powered Security Assistant
        </CardTitle>
        <CardDescription>
          Convert natural language into security commands for your cloud environment
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {showApiKeyInput ? (
          <div className="space-y-2 mb-4">
            <label htmlFor="api-key" className="text-sm font-medium">
              Enter your LLM API Key
            </label>
            <div className="flex space-x-2">
              <Input
                id="api-key"
                type="password"
                placeholder="Your API Key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="flex-1"
              />
              <Button 
                onClick={() => {
                  if (apiKey) {
                    toast.success("API key saved");
                    setShowApiKeyInput(false);
                  } else {
                    toast.warning("Using demo mode");
                    setShowApiKeyInput(false);
                  }
                }}
              >
                Save
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              For testing, you can click Save with an empty field to use the demo mode.
            </p>
          </div>
        ) : (
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-muted-foreground">{apiKey ? "Using API key: ••••••••••" : "Using demo mode"}</span>
            <Button variant="ghost" size="sm" onClick={() => setShowApiKeyInput(true)}>
              Change
            </Button>
          </div>
        )}
      
        <div>
          <label htmlFor="security-query" className="text-sm font-medium mb-1 block">
            Ask about security checks or commands
          </label>
          <div className="flex space-x-2">
            <Input
              id="security-query"
              placeholder="E.g., Find all publicly accessible S3 buckets"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1"
            />
            <Button onClick={processQuery} disabled={isProcessing}>
              {isProcessing ? "Processing..." : <Send className="h-4 w-4" />}
            </Button>
          </div>
        </div>
        
        {!response && (
          <div className="mt-4">
            <p className="text-sm text-muted-foreground mb-2">Examples you can try:</p>
            <div className="flex flex-wrap gap-2">
              {examples.map((example, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => handleExampleClick(example)}
                  className="text-xs"
                >
                  {example}
                </Button>
              ))}
            </div>
          </div>
        )}
        
        {response && (
          <div className="mt-4">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-2 mb-2">
                <TabsTrigger value="command">Command</TabsTrigger>
                <TabsTrigger value="output">Output</TabsTrigger>
              </TabsList>
              
              <TabsContent value="command">
                <div className="rounded-md bg-black p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex space-x-1">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-6 text-white hover:text-white hover:bg-white/10"
                      onClick={() => {
                        navigator.clipboard.writeText(response);
                        toast.success("Command copied to clipboard");
                      }}
                    >
                      <Copy className="h-3 w-3 mr-1" />
                      Copy
                    </Button>
                  </div>
                  <pre className="font-mono text-sm text-green-400 overflow-auto whitespace-pre-wrap max-h-[200px]">
                    $ {response}
                  </pre>
                  <div className="mt-2 flex justify-end">
                    <Button 
                      size="sm"
                      className="bg-green-600 hover:bg-green-700 text-white"
                      onClick={runInSandbox}
                    >
                      <Play className="h-3 w-3 mr-1" /> 
                      Run in sandbox
                    </Button>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="output">
                <div className="rounded-md bg-black p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex space-x-1">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-6 text-white hover:text-white hover:bg-white/10"
                      onClick={() => {
                        navigator.clipboard.writeText(sandboxOutput);
                        toast.success("Output copied to clipboard");
                      }}
                    >
                      <Copy className="h-3 w-3 mr-1" />
                      Copy
                    </Button>
                  </div>
                  {isRunning ? (
                    <div className="font-mono text-sm text-white">
                      Running command...
                    </div>
                  ) : sandboxOutput ? (
                    <pre className="font-mono text-sm text-white overflow-auto whitespace-pre-wrap max-h-[200px]">
                      {sandboxOutput}
                    </pre>
                  ) : (
                    <div className="font-mono text-sm text-gray-400 italic">
                      Run the command to see output here
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SecurityAssistant;
