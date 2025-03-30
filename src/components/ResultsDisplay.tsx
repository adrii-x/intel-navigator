
import React from 'react';
import { useAppSelector } from '@/hooks/useRedux';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Bar, Area, Line, Pie, ResponsiveContainer, BarChart, AreaChart, LineChart, PieChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell } from 'recharts';
import { AlertCircle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

// Define chart config for the ChartContainer
const chartConfig = {
  value: {
    label: 'Value',
    color: '#8884d8',
  },
};

// Colors for pie chart segments
const COLORS = ['#8884d8', '#83a6ed', '#8dd1e1', '#82ca9d', '#a4de6c', '#d0ed57', '#ffc658'];

// Create chart components using the ChartContainer
const BarChartComponent = ({ data }: { data: any[] }) => (
  <ChartContainer config={chartConfig} className="h-full">
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip content={<ChartTooltipContent />} />
        <Bar dataKey="value" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  </ChartContainer>
);

const LineChartComponent = ({ data }: { data: any[] }) => (
  <ChartContainer config={chartConfig} className="h-full">
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip content={<ChartTooltipContent />} />
        <Line type="monotone" dataKey="value" stroke="#8884d8" />
      </LineChart>
    </ResponsiveContainer>
  </ChartContainer>
);

const AreaChartComponent = ({ data }: { data: any[] }) => (
  <ChartContainer config={chartConfig} className="h-full">
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip content={<ChartTooltipContent />} />
        <Area type="monotone" dataKey="value" fill="#8884d8" />
      </AreaChart>
    </ResponsiveContainer>
  </ChartContainer>
);

const PieChartComponent = ({ data }: { data: any[] }) => (
  <ChartContainer config={chartConfig} className="h-full">
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Tooltip content={<ChartTooltipContent />} />
        <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  </ChartContainer>
);

const ResultsDisplay: React.FC = () => {
  const { activeQueryId, queries, results } = useAppSelector((state) => state.query);
  
  // Find the active query from the queries array
  const currentQuery = queries.find(q => q.id === activeQueryId);
  
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

  // Get data for the active query from results, or use mock data if not available
  const mockData = results[currentQuery.id]?.data?.chart?.data || 
    [
      { name: 'Jan', value: 10000 },
      { name: 'Feb', value: 15000 },
      { name: 'Mar', value: 12000 },
      { name: 'Apr', value: 20000 },
      { name: 'May', value: 18000 },
      { name: 'Jun', value: 22000 }
    ];

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
            <BarChartComponent data={mockData} />
          </TabsContent>
          <TabsContent value="chart2" className="h-[350px] pt-4">
            <LineChartComponent data={mockData} />
          </TabsContent>
          <TabsContent value="chart3" className="h-[350px] pt-4">
            <AreaChartComponent data={mockData} />
          </TabsContent>
          <TabsContent value="chart4" className="h-[350px] pt-4">
            <PieChartComponent data={mockData} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ResultsDisplay;
