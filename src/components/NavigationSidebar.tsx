import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Home,
  Users,
  Calendar,
  FileText,
  Settings,
  BarChart2,
  UserPlus,
  CreditCard,
  Video,
} from "lucide-react";
import { useMobile } from "@/hooks/use-mobile";

interface NavigationItem {
  id: string;
  icon: any;
  label: string;
  description: string;
}

const navigationItems: NavigationItem[] = [
  {
    id: "dashboard",
    icon: Home,
    label: "Dashboard",
    description: "Overview & Analytics",
  },
  {
    id: "employees",
    icon: Users,
    label: "Employees",
    description: "Manage Team Members",
  },
  {
    id: "attendance",
    icon: Calendar,
    label: "Attendance",
    description: "Time & Presence",
  },
  {
    id: "documents",
    icon: FileText,
    label: "Documents",
    description: "Files & Records",
  },
  {
    id: "payroll",
    icon: CreditCard,
    label: "Payroll",
    description: "Compensation & Benefits",
  },
  {
    id: "recruitment",
    icon: UserPlus,
    label: "Recruitment",
    description: "Hiring & Onboarding",
  },
  {
    id: "meetings",
    icon: Video,
    label: "Meetings",
    description: "Schedule & Connect",
  },
  {
    id: "analytics",
    icon: BarChart2,
    label: "Analytics",
    description: "Reports & Insights",
  },
  {
    id: "settings",
    icon: Settings,
    label: "Settings",
    description: "Preferences & Config",
  },
];

interface NavigationSidebarProps {
  activeModule: string;
  onModuleChange: (moduleId: string) => void;
  className?: string;
}

export function NavigationSidebar({
  activeModule,
  onModuleChange,
  className,
}: NavigationSidebarProps) {
  const isMobile = useMobile();

  return (
    <aside
      className={cn(
        "bg-card border-r border-border relative",
        "w-[280px] transition-all duration-300",
        isMobile && "w-[70px] hover:w-[280px] group",
        className
      )}
    >
      <div className="flex flex-col h-full">
        <div className="p-4 border-b border-border">
          <h2 className={cn(
            "text-lg font-semibold transition-all duration-300",
            isMobile && "opacity-0 group-hover:opacity-100"
          )}>
            HR Management
          </h2>
        </div>

        <ScrollArea className="flex-1 py-2">
          <div className="space-y-1 px-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeModule === item.id;

              return (
                <Button
                  key={item.id}
                  variant={isActive ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start relative group/item",
                    "hover:bg-muted/50 transition-all duration-200",
                    isActive && "bg-muted"
                  )}
                  onClick={() => onModuleChange(item.id)}
                >
                  <Icon className={cn(
                    "h-5 w-5 mr-3 transition-colors",
                    isActive ? "text-primary" : "text-muted-foreground",
                    "group-hover/item:text-foreground"
                  )} />
                  <div className={cn(
                    "flex flex-col items-start transition-all duration-300",
                    isMobile && "opacity-0 group-hover:opacity-100"
                  )}>
                    <span className="font-medium">{item.label}</span>
                    <span className="text-xs text-muted-foreground">
                      {item.description}
                    </span>
                  </div>
                  {isActive && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r" />
                  )}
                </Button>
              );
            })}
          </div>
        </ScrollArea>
      </div>
    </aside>
  );
}
