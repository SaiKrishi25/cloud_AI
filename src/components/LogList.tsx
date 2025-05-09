
import React, { useEffect, useRef } from 'react';
import { LogEntry as LogEntryType } from '@/types/log';
import LogEntry from './LogEntry';

interface LogListProps {
  logs: LogEntryType[];
}

const LogList = ({ logs }: LogListProps) => {
  const lastLogRef = useRef<HTMLDivElement>(null);
  const newLogIds = useRef<Set<string>>(new Set());
  
  useEffect(() => {
    if (logs.length > 0) {
      const latestLogId = logs[0].id;
      if (!newLogIds.current.has(latestLogId)) {
        newLogIds.current.add(latestLogId);
        // Remove ID from tracking set after animation completes
        setTimeout(() => {
          newLogIds.current.delete(latestLogId);
        }, 1000);
      }
    }
  }, [logs]);
  
  useEffect(() => {
    if (lastLogRef.current) {
      lastLogRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  return (
    <div className="mt-4 pb-4">
      {logs.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          No logs to display. Try adjusting your filters.
        </div>
      ) : (
        logs.map((log, index) => (
          <div key={log.id} ref={index === 0 ? lastLogRef : null}>
            <LogEntry log={log} isNew={newLogIds.current.has(log.id)} />
          </div>
        ))
      )}
    </div>
  );
};

export default LogList;
