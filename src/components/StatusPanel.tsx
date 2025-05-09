
import React from 'react';
import { Activity, Signal, Database, PieChart } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  BarChart, 
  Bar,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip
} from 'recharts';

interface StatusPanelProps {
  logsProcessed: number;
  threatPercentage: number;
  logHistory?: Array<{
    time: string;
    safe: number;
    warning: number;
    threat: number;
  }>;
}

const StatusPanel = ({ logsProcessed, threatPercentage, logHistory = [] }: StatusPanelProps) => {
  // Create some sample data if no history is provided
  const chartData = logHistory.length > 0 ? logHistory : [
    { time: '00:00', safe: 12, warning: 3, threat: 1 },
    { time: '01:00', safe: 15, warning: 2, threat: 0 },
    { time: '02:00', safe: 18, warning: 4, threat: 2 },
    { time: '03:00', safe: 14, warning: 2, threat: 1 },
    { time: '04:00', safe: 20, warning: 5, threat: 2 },
  ];

  const barData = [
    { name: 'API', safe: 45, warning: 12, threat: 5 },
    { name: 'Auth', safe: 32, warning: 8, threat: 3 },
    { name: 'Network', safe: 28, warning: 10, threat: 2 },
    { name: 'Storage', safe: 18, warning: 5, threat: 1 },
  ];

  const chartConfig = {
    safe: { 
      label: 'Safe',
      color: 'hsl(var(--success))'
    },
    warning: { 
      label: 'Warning',
      color: 'hsl(var(--warning))'
    },
    threat: { 
      label: 'Threat',
      color: 'hsl(var(--destructive))'
    },
  };

  return (
    <div className="grid grid-cols-1 gap-4 mb-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4">
            <h3 className="text-lg font-medium mb-2 flex items-center">
              <PieChart className="h-5 w-5 mr-2 text-primary" />
              Log Activity Timeline
            </h3>
            <div className="h-64">
              <ChartContainer config={chartConfig}>
                {/* Wrap the LineChart in a React Fragment to satisfy the type requirement */}
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line type="monotone" dataKey="safe" stroke="hsl(var(--success))" />
                    <Line type="monotone" dataKey="warning" stroke="hsl(var(--warning))" />
                    <Line type="monotone" dataKey="threat" stroke="hsl(var(--destructive))" />
                  </LineChart>
                </ResponsiveContainer>
                <ChartLegend content={<ChartLegendContent />} />
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <h3 className="text-lg font-medium mb-2 flex items-center">
              <PieChart className="h-5 w-5 mr-2 text-primary" />
              Log Distribution by Resource
            </h3>
            <div className="h-64">
              <ChartContainer config={chartConfig}>
                {/* Wrap the BarChart in a React Fragment to satisfy the type requirement */}
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="safe" fill="hsl(var(--success))" />
                    <Bar dataKey="warning" fill="hsl(var(--warning))" />
                    <Bar dataKey="threat" fill="hsl(var(--destructive))" />
                  </BarChart>
                </ResponsiveContainer>
                <ChartLegend content={<ChartLegendContent />} />
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StatusPanel;
