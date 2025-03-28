
import React, { useState, useEffect, useRef } from 'react';
import { Search, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAppDispatch } from '@/hooks/useRedux';
import { addQuery, processQuery } from '@/store/querySlice';
import { generateQueryId, getQuerySuggestions } from '@/utils/mockData';
import { Card } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';

const QueryInput: React.FC = () => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();
  const { toast } = useToast();

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

  // Update suggestions when query changes
  useEffect(() => {
    if (query.length > 2) {
      const newSuggestions = getQuerySuggestions(query);
      setSuggestions(newSuggestions);
    } else {
      setSuggestions([]);
    }
  }, [query]);

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

    const newQuery = {
      id: generateQueryId(),
      text: query,
      timestamp: Date.now(),
    };

    dispatch(addQuery(newQuery));
    dispatch(processQuery(newQuery));
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
              setShowSuggestions(e.target.value.length > 2);
            }}
            onFocus={() => setShowSuggestions(query.length > 2)}
            className="pl-10 pr-4 h-12 text-base"
          />
        </div>
        <Button type="submit" size="lg" className="h-12">
          <Sparkles className="h-4 w-4 mr-2" />
          Analyze
        </Button>
      </form>

      {showSuggestions && suggestions.length > 0 && (
        <Card className="absolute z-10 mt-1 w-full overflow-hidden shadow-lg">
          <div className="divide-y">
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                className="p-3 text-sm cursor-pointer hover:bg-muted flex items-center space-x-2"
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
