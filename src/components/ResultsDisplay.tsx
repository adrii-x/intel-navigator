
import React from 'react';
import { useAppSelector } from '@/hooks/useRedux';
import { BarChart, AreaChart, LineChart, PieChart } from '@/components/ui/chart';
import { AlertCircle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { mockData } from '@/utils/mockData';

const ResultsDisplay: React.FC = () => {
  const { activeQuery, queries } = useAppSelector((state) => state.query);
  
  // Find the active query from the queries array
  const currentQuery = queries.find(q => q.id === activeQuery);
  
  if (!currentQuery) {
    return (
      <Card className="shadow-xl transition-all duration-300 hover:shadow-2xl">
        <CardHeader>
          <CardTitle>Results</CardTitle>
          <CardDescription>Ask a question to see insights</CardDescription>
        </CardHeader>
        <CardContent className="h-[400px] flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            <p className="mb-2">Enter a business question in the input above</p>
            <p className="text-sm">Example: "Show me sales trends for the last quarter"</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Based on the query, determine which charts to show
  // This is a simplified logic - in a real app, this would come from the AI service
  const shouldShowBarChart = currentQuery.text.toLowerCase().includes('compare') || 
                            currentQuery.text.toLowerCase().includes('breakdown');
  
  const shouldShowLineChart = currentQuery.text.toLowerCase().includes('trend') || 
                             currentQuery.text.toLowerCase().includes('over time');
  
  const shouldShowAreaChart = currentQuery.text.toLowerCase().includes('growth') || 
                             currentQuery.text.toLowerCase().includes('cumulative');
  
  const shouldShowPieChart = currentQuery.text.toLowerCase().includes('distribution') || 
                            currentQuery.text.toLowerCase().includes('percentage');

  // If no specific chart type is detected, show all charts as a default
  const showAllCharts = !shouldShowBarChart && !shouldShowLineChart && 
                        !shouldShowAreaChart && !shouldShowPieChart;

  return (
    <Card className="shadow-xl transition-all duration-300 hover:shadow-2xl">
      <CardHeader>
        <CardTitle>Results for: {currentQuery.text}</CardTitle>
        <CardDescription>
          Showing insights based on your query
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Alert className="mb-4">
          <div className="flex items-center">
            <AlertCircle className="h-4 w-4 mr-2" />
            <div>
              <AlertTitle>Demo Mode</AlertTitle>
              <AlertDescription>
                Currently showing mock data. Integrate with your AI backend for real insights.
              </AlertDescription>
            </div>
          </div>
        </Alert>

        <Tabs defaultValue="chart1" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="chart1" disabled={!showAllCharts && !shouldShowBarChart}>
              Bar Chart
            </TabsTrigger>
            <TabsTrigger value="chart2" disabled={!showAllCharts && !shouldShowLineChart}>
              Line Chart
            </TabsTrigger>
            <TabsTrigger value="chart3" disabled={!showAllCharts && !shouldShowAreaChart}>
              Area Chart
            </TabsTrigger>
            <TabsTrigger value="chart4" disabled={!showAllCharts && !shouldShowPieChart}>
              Pie Chart
            </TabsTrigger>
          </TabsList>
          <TabsContent value="chart1" className="h-[350px] pt-4">
            <BarChart data={mockData} />
          </TabsContent>
          <TabsContent value="chart2" className="h-[350px] pt-4">
            <LineChart data={mockData} />
          </TabsContent>
          <TabsContent value="chart3" className="h-[350px] pt-4">
            <AreaChart data={mockData} />
          </TabsContent>
          <TabsContent value="chart4" className="h-[350px] pt-4">
            <PieChart data={mockData} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ResultsDisplay;
