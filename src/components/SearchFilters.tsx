
import React from 'react';
import { Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { LogClassification } from '@/types/log';

interface SearchFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  classificationFilter: LogClassification | 'all';
  setClassificationFilter: (filter: LogClassification | 'all') => void;
  resourceFilter: string | 'all';
  setResourceFilter: (filter: string | 'all') => void;
  resources: string[];
}

const SearchFilters = ({
  searchTerm,
  setSearchTerm,
  classificationFilter,
  setClassificationFilter,
  resourceFilter,
  setResourceFilter,
  resources
}: SearchFiltersProps) => {
  return (
    <div className="bg-card p-4 border-b border-border">
      <div className="flex flex-col lg:flex-row gap-3 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search logs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 bg-background"
          />
        </div>
        
        <div className="flex items-center gap-3 w-full lg:w-auto">
          <Filter className="h-4 w-4 text-muted-foreground hidden sm:block" />
          <span className="text-muted-foreground hidden sm:block">Filters:</span>
          
          <Select value={classificationFilter} onValueChange={(value) => setClassificationFilter(value as LogClassification | 'all')}>
            <SelectTrigger className="w-full sm:w-[150px]">
              <SelectValue placeholder="Classification" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Classifications</SelectItem>
              <SelectItem value="safe">Safe</SelectItem>
              <SelectItem value="warning">Warning</SelectItem>
              <SelectItem value="threat">Threat</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={resourceFilter} onValueChange={setResourceFilter}>
            <SelectTrigger className="w-full sm:w-[150px]">
              <SelectValue placeholder="Resource" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Resources</SelectItem>
              {resources.map((resource) => (
                <SelectItem key={resource} value={resource}>
                  {resource}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button 
            variant="secondary" 
            onClick={() => {
              setSearchTerm('');
              setClassificationFilter('all');
              setResourceFilter('all');
            }}
            className="whitespace-nowrap"
          >
            Clear Filters
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SearchFilters;
