import React from 'react';
import { Building2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LogoProps {
  collapsed?: boolean;
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ collapsed = false, className = '' }) => {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className="flex-shrink-0 p-2 rounded-xl bg-gradient-to-br from-primary/90 to-primary shadow-lg">
        <Building2 className="h-6 w-6 text-primary-foreground" />
      </div>
      <div className={cn(
        "flex flex-col overflow-hidden transition-all duration-300",
        collapsed ? "w-0 opacity-0" : "w-auto opacity-100",
        "group-hover:w-auto group-hover:opacity-100"
      )}>
        <span className="text-lg font-bold text-primary whitespace-nowrap">
          Omyra
        </span>
        <span className="text-xs text-muted-foreground whitespace-nowrap">
          HR Management
        </span>
      </div>
    </div>
  );
};

export default Logo;
