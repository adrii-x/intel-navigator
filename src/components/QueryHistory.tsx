
import React from 'react';
import { History, Trash2 } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '@/hooks/useRedux';
import { setActiveQuery, clearQueries } from '@/store/querySlice';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';

const QueryHistory: React.FC = () => {
  const { queries, activeQueryId } = useAppSelector((state) => state.query);
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  
  if (queries.length === 0) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <History className="h-5 w-5" />
            Query History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <p>Your query history will appear here</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const handleClearHistory = () => {
    dispatch(clearQueries());
    toast({
      title: "History cleared",
      description: "All queries have been removed from history.",
    });
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg flex items-center gap-2">
            <History className="h-5 w-5" />
            Query History
          </CardTitle>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleClearHistory}
            className="h-8 px-2 text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Clear
          </Button>
        </div>
      </CardHeader>
      <Separator />
      <CardContent className="p-0">
        <div className="max-h-[calc(100vh-350px)] overflow-y-auto">
          {queries.map((query) => (
            <div 
              key={query.id}
              className={`p-3 cursor-pointer transition-colors border-l-2 ${
                activeQueryId === query.id 
                  ? 'border-primary bg-primary/5' 
                  : 'border-transparent hover:bg-secondary'
              }`}
              onClick={() => dispatch(setActiveQuery(query.id))}
            >
              <div className="font-medium truncate">{query.text}</div>
              <div className="text-xs text-muted-foreground mt-1">
                {formatTime(query.timestamp)}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default QueryHistory;
