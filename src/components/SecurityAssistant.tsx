
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Code, Send, Cloud } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import { useLocalStorage } from '@/hooks/useLocalStorage';

const SecurityAssistant = () => {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [apiKey, setApiKey] = useLocalStorage('llm-api-key', '');
  const [showApiKeyInput, setShowApiKeyInput] = useState(!apiKey);
  
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
    
    try {
      // Simulate LLM processing
      setTimeout(() => {
        const responses = {
          "Find all publicly accessible S3 buckets in my AWS environment": 
            `# Command to find public S3 buckets:\n\n\`\`\`bash\naws s3api list-buckets --query 'Buckets[].Name' | jq -r '.[]' | xargs -I {} aws s3api get-bucket-policy-status --bucket {} --query 'PolicyStatus.IsPublic' 2>/dev/null | grep true --before 1\n\`\`\``,
          "List resources with excessive IAM permissions": 
            `# AWS IAM Access Analyzer command:\n\n\`\`\`bash\naws accessanalyzer start-policy-generation --policy-generation-details '{\"principalArn\":\"arn:aws:iam::123456789012:role/MyRole\"}'\n\`\`\`\n\n# GCP command to list over-privileged service accounts:\n\n\`\`\`bash\ngcloud projects get-iam-policy [PROJECT_ID] --format=json | jq '.bindings[] | select(.role | contains("roles/owner") or contains("roles/editor"))'\n\`\`\``,
          "Check for unencrypted databases in my cloud environment": 
            `# AWS RDS encryption check:\n\n\`\`\`bash\naws rds describe-db-instances --query 'DBInstances[*].[DBInstanceIdentifier,StorageEncrypted]' --output table\n\`\`\`\n\n# GCP Cloud SQL encryption check:\n\n\`\`\`bash\ngcloud sql instances list --format="table(name, settings.diskEncryptionStatus)"\n\`\`\``,
          "Detect instances without proper security groups": 
            `# AWS EC2 instances with open security groups:\n\n\`\`\`bash\naws ec2 describe-security-groups --filters Name=ip-permission.cidr,Values='0.0.0.0/0' --query 'SecurityGroups[*].[GroupId,GroupName]' --output table\n\`\`\`\n\n# Then find which instances use these security groups:\n\n\`\`\`bash\naws ec2 describe-instances --filters Name=instance.group-id,Values=sg-XXXXX --query 'Reservations[*].Instances[*].[InstanceId,State.Name]' --output table\n\`\`\``
        };
        
        const defaultResponse = `# Analyzing your security query...\n\n\`\`\`bash\n# Based on your query: "${query}"\n# Here's a recommended command:\n\naws cloudtrail lookup-events --lookup-attributes AttributeKey=EventName,AttributeValue=ConsoleLogin\n\`\`\`\n\nThis command will help you track console login events. You may need to customize it further based on your specific requirements.`;
        
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
                    toast.error("Please enter a valid API key");
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
            <span className="text-sm text-muted-foreground">Using API key: ••••••••••</span>
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
            <label className="text-sm font-medium mb-1 block">
              Security Command
            </label>
            <Textarea
              value={response}
              readOnly
              className="font-mono text-sm h-[200px] overflow-auto bg-gray-50"
            />
            <div className="flex justify-end mt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  navigator.clipboard.writeText(response);
                  toast.success("Command copied to clipboard");
                }}
              >
                Copy to clipboard
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SecurityAssistant;
