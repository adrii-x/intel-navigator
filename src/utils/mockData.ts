
import { v4 as uuidv4 } from 'uuid';

// Mock AI suggestions based on user input
export const getQuerySuggestions = (input: string): string[] => {
  const suggestions = [
    'Show revenue trends for the last 6 months',
    'Compare sales performance by region',
    'Analyze customer retention rate by product',
    'What is our customer acquisition cost by channel?',
    'Show me conversion rates by marketing campaign',
    'What are the top 5 products by profit margin?',
    'Compare this month\'s sales to last month',
    'Show me the return on ad spend by platform',
  ];

  if (!input) return [];

  // Filter suggestions based on input
  return suggestions
    .filter(suggestion => 
      suggestion.toLowerCase().includes(input.toLowerCase())
    )
    .slice(0, 3);
};

// Types of charts we can simulate
const chartTypes = ['bar', 'line', 'pie', 'area'];

// Generate random numbers within a range
const randomNumber = (min: number, max: number) => 
  Math.floor(Math.random() * (max - min + 1)) + min;

// Generate mock data for different chart types
const generateChartData = (type: string, query: string) => {
  const categories = ['Product A', 'Product B', 'Product C', 'Product D', 'Product E'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  
  // Different data based on query keywords
  let dataPoints = [];
  
  if (query.toLowerCase().includes('revenue') || query.toLowerCase().includes('sales')) {
    dataPoints = months.map(month => ({
      name: month,
      value: randomNumber(10000, 50000),
    }));
  } else if (query.toLowerCase().includes('region') || query.toLowerCase().includes('geographic')) {
    dataPoints = ['North', 'South', 'East', 'West', 'Central'].map(region => ({
      name: region,
      value: randomNumber(5000, 25000),
    }));
  } else if (query.toLowerCase().includes('customer') || query.toLowerCase().includes('user')) {
    dataPoints = months.map(month => ({
      name: month,
      value: randomNumber(70, 95),
    }));
  } else {
    // Default data
    dataPoints = categories.map(category => ({
      name: category,
      value: randomNumber(100, 1000),
    }));
  }
  
  // Return different formats based on chart type
  switch (type) {
    case 'pie':
      return {
        type: 'pie',
        data: dataPoints,
      };
    case 'bar':
      return {
        type: 'bar',
        data: dataPoints,
      };
    case 'line':
    case 'area':
      return {
        type: type,
        data: dataPoints,
      };
    default:
      return {
        type: 'bar',
        data: dataPoints,
      };
  }
};

// Generate a text insight based on the query
const generateInsight = (query: string, data: any) => {
  if (query.toLowerCase().includes('revenue') || query.toLowerCase().includes('sales')) {
    const total = data.data.reduce((sum: number, item: any) => sum + item.value, 0);
    const avg = Math.round(total / data.data.length);
    return `Based on your query, total revenue is $${total.toLocaleString()} with an average of $${avg.toLocaleString()} per period. The trend shows ${data.data[data.data.length - 1].value > data.data[0].value ? 'growth' : 'decline'} over time.`;
  }
  
  if (query.toLowerCase().includes('customer') || query.toLowerCase().includes('user')) {
    const latest = data.data[data.data.length - 1].value;
    return `Customer metrics are currently at ${latest}%, which is ${latest > 80 ? 'above' : 'below'} industry average. Focus on improving customer experience could yield better results.`;
  }
  
  // Default insight
  const highest = Math.max(...data.data.map((item: any) => item.value));
  const highestItem = data.data.find((item: any) => item.value === highest);
  return `Analysis shows that ${highestItem.name} is performing the best with a value of ${highest}. Consider allocating more resources to replicate this success.`;
};

// Main function to process queries and return mock results
export const mockQueryProcessor = async (query: string) => {
  try {
    // Simulate processing logic and errors
    if (query.toLowerCase().includes('error')) {
      throw new Error('Unable to process query due to data access restrictions');
    }

    // Pick a random chart type that makes sense for the query
    let chartType = chartTypes[Math.floor(Math.random() * chartTypes.length)];
    
    // Override chart type based on query keywords
    if (query.toLowerCase().includes('trend') || query.toLowerCase().includes('over time')) {
      chartType = 'line';
    } else if (query.toLowerCase().includes('compare') || query.toLowerCase().includes('distribution')) {
      chartType = 'bar';
    } else if (query.toLowerCase().includes('breakdown') || query.toLowerCase().includes('percentage')) {
      chartType = 'pie';
    }
    
    const chartData = generateChartData(chartType, query);
    const insight = generateInsight(query, chartData);
    
    return {
      data: {
        chart: chartData,
        insight,
        query,
        timestamp: new Date().toISOString(),
      },
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
};

export const generateQueryId = () => uuidv4();
