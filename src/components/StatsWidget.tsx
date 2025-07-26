import React from 'react';
import { Card } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface StatsWidgetProps {
  title: string;
  value: string | number;
  subtitle?: string;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: LucideIcon;
  className?: string;
}

const StatsWidget: React.FC<StatsWidgetProps> = ({
  title,
  value,
  subtitle,
  change,
  changeType = 'neutral',
  icon: Icon,
  className = ''
}) => {
  const getChangeColor = () => {
    switch (changeType) {
      case 'positive': return 'text-accent';
      case 'negative': return 'text-destructive';
      default: return 'text-muted-foreground';
    }
  };

  const getChangeSymbol = () => {
    if (!change) return '';
    if (changeType === 'positive') return '↗';
    if (changeType === 'negative') return '↘';
    return '';
  };

  return (
    <Card className={`neu-surface p-6 hover:scale-105 transition-all duration-200 group ${className}`}>
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
            {title}
          </p>
          
          <div>
            <p className="text-3xl font-bold text-foreground group-hover:text-primary transition-colors">
              {value}
            </p>
            {subtitle && (
              <p className="text-xs text-muted-foreground mt-1">
                {subtitle}
              </p>
            )}
          </div>

          {change && (
            <div className={`flex items-center gap-1 text-sm ${getChangeColor()}`}>
              <span>{getChangeSymbol()}</span>
              <span>{change}</span>
              <span className="text-muted-foreground">vs last period</span>
            </div>
          )}
        </div>

        <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
          <Icon className="h-6 w-6 text-primary" />
        </div>
      </div>
    </Card>
  );
};

export default StatsWidget;