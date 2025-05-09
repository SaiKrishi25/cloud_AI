
import React from 'react';
import { Activity, Signal, Database } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface StatusPanelProps {
  logsProcessed: number;
  threatPercentage: number;
}

const StatusPanel = ({ logsProcessed, threatPercentage }: StatusPanelProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
      <Card>
        <CardContent className="p-4 flex items-center">
          <Activity className="h-8 w-8 text-primary mr-4" />
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">System Status</h3>
            <p className="text-2xl font-bold flex items-center gap-2">
              Active
              <span className="inline-block h-2 w-2 rounded-full bg-success animate-pulse-opacity"></span>
            </p>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4 flex items-center">
          <Signal className="h-8 w-8 text-primary mr-4" />
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Logs Processed</h3>
            <p className="text-2xl font-bold">{logsProcessed.toLocaleString()}</p>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center mb-2">
            <Database className="h-8 w-8 text-primary mr-4" />
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Threat Score</h3>
              <p className="text-2xl font-bold">{threatPercentage}%</p>
            </div>
          </div>
          <Progress 
            value={threatPercentage} 
            className={`h-2 ${
              threatPercentage < 5 ? "bg-secondary [&>div]:bg-success" : 
              threatPercentage < 15 ? "bg-secondary [&>div]:bg-warning" : 
              "bg-secondary [&>div]:bg-destructive"
            }`}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default StatusPanel;
