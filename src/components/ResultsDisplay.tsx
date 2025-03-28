
import React from 'react';
import { useAppSelector } from '@/hooks/useRedux';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, LineChart, AreaChart, PieChart, Pie, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, Line, Cell } from 'recharts';
import { AlertCircle, Loader2, BarChart as BarChartIcon } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

// Generate colors for pie chart
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const ResultsDisplay: React.FC = () => {
  const { activeQueryId, results, status, queries, error } = useAppSelector((state) => state.query);
  
  // Loading state
  if (status === 'loading') {
    return (
      <Card className="h-full">
        <CardContent className="flex items-center justify-center h-full">
          <div className="text-center py-20">
            <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary mb-4" />
            <p className="text-lg font-medium">Analyzing your data...</p>
            <p className="text-muted-foreground mt-2">
              Our AI is processing your query and generating insights
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // Error state
  if (status === 'failed' && error) {
    return (
      <Card className="h-full">
        <CardContent className="p-6">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }
  
  // No active query
  if (!activeQueryId || !results[activeQueryId]) {
    return (
      <Card className="h-full">
        <CardContent className="flex flex-col items-center justify-center h-full text-center p-12">
          <div className="rounded-full bg-primary/10 p-4 mb-4">
            <BarChartIcon className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Ask questions about your data</h3>
          <p className="text-muted-foreground max-w-md">
            Type a business question in the search bar above to get instant insights powered by AI
          </p>
        </CardContent>
      </Card>
    );
  }
  
  // Display results
  const result = results[activeQueryId];
  const activeQuery = queries.find(q => q.id === activeQueryId);
  
  if (result.error) {
    return (
      <Card className="h-full">
        <CardContent className="p-6">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{result.error}</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }
  
  const { chart, insight } = result.data;
  
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-xl">
          {activeQuery?.text}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            {chart.type === 'bar' && (
              <BarChart data={chart.data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#3b82f6" />
              </BarChart>
            )}
            
            {chart.type === 'line' && (
              <LineChart data={chart.data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#3b82f6" 
                  strokeWidth={2} 
                  dot={{ r: 4 }} 
                  activeDot={{ r: 6 }} 
                />
              </LineChart>
            )}
            
            {chart.type === 'area' && (
              <AreaChart data={chart.data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#3b82f6" 
                  fill="#3b82f6" 
                  fillOpacity={0.2} 
                />
              </AreaChart>
            )}
            
            {chart.type === 'pie' && (
              <PieChart>
                <Pie
                  data={chart.data}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  outerRadius={150}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {chart.data.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            )}
          </ResponsiveContainer>
        </div>
        
        <div className="mt-8 bg-secondary p-4 rounded-lg">
          <h3 className="font-medium mb-2 flex items-center">
            <span className="bg-primary text-primary-foreground p-1 rounded text-xs mr-2">AI INSIGHT</span>
            Key Insights
          </h3>
          <p className="text-muted-foreground">{insight}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ResultsDisplay;
