
import React, { useState, useEffect, useRef } from 'react';
import { Search, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { addQuery, processQuery, setActiveQuery } from '@/store/querySlice';
import { generateQueryId } from '@/utils/mockData';
import { Card } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';

const QueryInput: React.FC = () => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const { queries } = useAppSelector((state) => state.query);

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Update suggestions based on typed query or from history
  useEffect(() => {
    if (query.length > 1) {
      // Generate suggestions from history
      const historySuggestions = queries
        .filter(q => q.text.toLowerCase().includes(query.toLowerCase()))
        .map(q => q.text)
        .filter((value, index, self) => self.indexOf(value) === index) // Remove duplicates
        .slice(0, 5); // Limit to 5 suggestions
      
      setSuggestions(historySuggestions);
    } else {
      setSuggestions([]);
    }
  }, [query, queries]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() === '') {
      toast({
        title: "Query required",
        description: "Please enter a question to analyze your data.",
        variant: "destructive",
      });
      return;
    }

    // Check if query already exists
    const existingQuery = queries.find(q => q.text.toLowerCase() === query.toLowerCase());
    
    if (existingQuery) {
      dispatch(setActiveQuery(existingQuery.id));
      toast({
        title: "Existing query found",
        description: "Showing results for the existing query.",
      });
    } else {
      const newQuery = {
        id: generateQueryId(),
        text: query,
        timestamp: Date.now(),
      };

      dispatch(addQuery(newQuery));
      dispatch(processQuery(newQuery));
      toast({
        title: "Query submitted",
        description: "Analyzing your data...",
      });
    }
    
    setQuery('');
    setShowSuggestions(false);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    setShowSuggestions(false);
  };

  return (
    <div className="w-full relative" ref={suggestionsRef}>
      <form onSubmit={handleSubmit} className="flex w-full space-x-2">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Ask a question about your data..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setShowSuggestions(e.target.value.length > 1);
            }}
            onFocus={() => setShowSuggestions(query.length > 1 && suggestions.length > 0)}
            className="pl-10 pr-4 h-12 text-base shadow-xl border-muted hover:border-primary/50 focus-visible:ring-primary/30 transition-all duration-200"
          />
        </div>
        <Button 
          type="submit" 
          size="lg" 
          className="h-12 shadow-xl hover:shadow-2xl transition-all duration-200 hover:scale-105"
        >
          <Sparkles className="h-4 w-4 md:mr-2" />
          <span className="hidden md:inline">Analyze</span>
        </Button>
      </form>

      {showSuggestions && suggestions.length > 0 && (
        <Card className="absolute z-50 mt-1 w-full overflow-hidden shadow-2xl animate-fade-in">
          <div className="divide-y">
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                className="p-3 text-sm cursor-pointer hover:bg-muted flex items-center space-x-2 transition-colors duration-150"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                <Sparkles className="h-4 w-4 text-primary" />
                <span>{suggestion}</span>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default QueryInput;
