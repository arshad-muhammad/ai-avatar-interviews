
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface MetricsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    direction: 'up' | 'down' | 'neutral';
    value: string;
  };
}

const MetricsCard: React.FC<MetricsCardProps> = ({ title, value, icon, trend }) => {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-gray-500">{title}</h3>
          <div className="text-brand-blue">{icon}</div>
        </div>
        <div className="flex items-baseline">
          <p className="text-2xl font-bold">{value}</p>
          {trend && (
            <span
              className={`ml-2 text-sm ${
                trend.direction === 'up'
                  ? 'text-green-500'
                  : trend.direction === 'down'
                  ? 'text-red-500'
                  : 'text-gray-400'
              }`}
            >
              {trend.direction === 'up' ? '↑' : trend.direction === 'down' ? '↓' : '→'} {trend.value}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MetricsCard;
