
import React, { useEffect, useRef, useState } from 'react';
import { LogEntry as LogEntryType } from '@/types/log';
import LogEntry from './LogEntry';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';

interface LogListProps {
  logs: LogEntryType[];
}

const LogList = ({ logs }: LogListProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [autoScroll, setAutoScroll] = useState(true);
  const newLogIds = useRef<Set<string>>(new Set());
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);
  
  // Track new logs
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
  
  // Handle auto-scrolling
  useEffect(() => {
    if (autoScroll && scrollContainerRef.current && logs.length > 0) {
      scrollContainerRef.current.scrollTop = 0;
    }
  }, [logs, autoScroll]);
  
  // Track scroll position to show/hide scroll to bottom button
  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    
    const { scrollTop } = scrollContainerRef.current;
    
    // If user scrolls away from top, disable auto-scroll
    if (scrollTop > 10) {
      setAutoScroll(false);
      setShowScrollToBottom(true);
    } else {
      setAutoScroll(true);
      setShowScrollToBottom(false);
    }
  };
  
  const scrollToTop = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
      setAutoScroll(true);
      setShowScrollToBottom(false);
    }
  };

  return (
    <div className="relative h-[500px]">
      <ScrollArea 
        className="h-full pr-4" 
        ref={scrollContainerRef}
        onScrollCapture={handleScroll}
      >
        <div className="pb-4">
          {logs.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No logs to display. Try adjusting your filters.
            </div>
          ) : (
            logs.map((log) => (
              <div key={log.id}>
                <LogEntry log={log} isNew={newLogIds.current.has(log.id)} />
              </div>
            ))
          )}
        </div>
      </ScrollArea>
      
      {showScrollToBottom && (
        <Button
          variant="secondary"
          size="sm"
          className="absolute bottom-4 right-4 shadow-md opacity-80 hover:opacity-100"
          onClick={scrollToTop}
        >
          <ChevronDown className="mr-1 h-4 w-4" />
          Latest Logs
        </Button>
      )}
    </div>
  );
};

export default LogList;
