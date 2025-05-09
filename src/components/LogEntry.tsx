
import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { 
  Shield, 
  AlertTriangle, 
  AlertCircle, 
  ChevronDown, 
  ChevronUp,
  Info,
  User,
  Clock
} from 'lucide-react';
import { 
  Card,
  CardContent,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { LogEntry as LogEntryType } from '@/types/log';
import { cn } from '@/lib/utils';

interface LogEntryProps {
  log: LogEntryType;
  isNew?: boolean;
}

const LogEntry = ({ log, isNew = false }: LogEntryProps) => {
  const [expanded, setExpanded] = React.useState(false);
  
  const getClassificationIcon = () => {
    switch (log.classification) {
      case 'safe':
        return <Shield className="h-5 w-5 text-success" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-warning" />;
      case 'threat':
        return <AlertCircle className="h-5 w-5 text-destructive" />;
    }
  };
  
  const getClassificationColor = () => {
    switch (log.classification) {
      case 'safe':
        return 'bg-success/10 text-success border-success/30';
      case 'warning':
        return 'bg-warning/10 text-warning border-warning/30';
      case 'threat':
        return 'bg-destructive/10 text-destructive border-destructive/30';
    }
  };
  
  const getSeverityColor = () => {
    switch (log.severity) {
      case 'INFO':
        return 'bg-blue-500/20 text-blue-300';
      case 'WARNING':
        return 'bg-warning/20 text-warning';
      case 'ERROR':
        return 'bg-orange-500/20 text-orange-300';
      case 'CRITICAL':
        return 'bg-destructive/20 text-destructive';
    }
  };
  
  return (
    <Card className={cn(
      "border border-border mb-3 transition-opacity duration-300",
      isNew && "animate-slide-in",
      log.classification === 'threat' && "border-l-4 border-l-destructive",
      log.classification === 'warning' && "border-l-4 border-l-warning"
    )}>
      <CardContent className="p-0">
        <div className="p-4 cursor-pointer" onClick={() => setExpanded(!expanded)}>
          <div className="flex justify-between items-start">
            <div className="flex items-start gap-3">
              {getClassificationIcon()}
              
              <div>
                <h3 className="font-medium text-foreground">{log.message}</h3>
                <div className="flex flex-wrap gap-2 mt-1 items-center text-sm text-muted-foreground">
                  <span>{log.resource}</span>
                  <span>•</span>
                  <span>{log.source}</span>
                  {log.user && (
                    <>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {log.user}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Badge className={getSeverityColor()}>
                {log.severity}
              </Badge>
              
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>{formatDistanceToNow(new Date(log.timestamp), { addSuffix: true })}</span>
              </div>
              
              {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </div>
          </div>
        </div>
        
        {expanded && (
          <>
            <Separator />
            <div className="p-4 bg-background/30">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline" className={getClassificationColor()}>
                  {log.classification.toUpperCase()}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  Classified by AI at {new Date(log.timestamp).toLocaleTimeString()}
                </span>
              </div>
              
              {log.details && (
                <div className="mt-2 text-sm flex gap-2">
                  <Info className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                  <span>{log.details}</span>
                </div>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default LogEntry;
