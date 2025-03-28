
import React from 'react';
import { BarChart2 } from 'lucide-react';

const Logo: React.FC = () => {
  return (
    <div className="flex items-center gap-2 font-bold text-xl">
      <BarChart2 className="h-6 w-6 text-primary" />
      <span>GenAI Analytics</span>
    </div>
  );
};

export default Logo;
