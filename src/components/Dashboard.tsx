
import React from 'react';
import QueryInput from './QueryInput';
import QueryHistory from './QueryHistory';
import ResultsDisplay from './ResultsDisplay';

const Dashboard: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-8 max-w-3xl mx-auto animate-fade-in">
        <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">GenAI Analytics Dashboard</h1>
        <p className="text-muted-foreground">
          Ask questions about your business data and get instant insights
        </p>
      </div>
      
      <div className="mb-8 max-w-3xl mx-auto animate-fade-in">
        <QueryInput />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="md:col-span-1 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <QueryHistory />
        </div>
        <div className="md:col-span-2 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <ResultsDisplay />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
