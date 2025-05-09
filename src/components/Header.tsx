
import React from 'react';
import { Shield, AlertTriangle, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface HeaderProps {
  safeCount: number;
  warningCount: number;
  threatCount: number;
}

const Header = ({ safeCount, warningCount, threatCount }: HeaderProps) => {
  return (
    <header className="bg-card p-4 border-b border-border rounded-t-lg">
      <div className="flex flex-col sm:flex-row justify-between items-center">
        <div className="flex items-center mb-4 sm:mb-0">
          <Shield className="h-8 w-8 text-primary mr-3" />
          <h1 className="text-2xl font-bold">AI powered cloud security automation</h1>
        </div>
        
        <div className="flex space-x-3">
          <Badge variant="outline" className="flex items-center bg-secondary/40 gap-1 py-1.5 px-3">
            <Shield className="h-4 w-4 text-success" />
            <span className="text-success">{safeCount} Safe</span>
          </Badge>
          
          <Badge variant="outline" className="flex items-center bg-secondary/40 gap-1 py-1.5 px-3">
            <AlertTriangle className="h-4 w-4 text-warning" />
            <span className="text-warning">{warningCount} Warnings</span>
          </Badge>
          
          <Badge variant="outline" className="flex items-center bg-secondary/40 gap-1 py-1.5 px-3">
            <AlertCircle className="h-4 w-4 text-destructive" />
            <span className="text-destructive">{threatCount} Threats</span>
          </Badge>
        </div>
      </div>
    </header>
  );
};

export default Header;
