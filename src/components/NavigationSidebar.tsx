import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import Logo from "@/components/ui/logo";
import {
  LayoutDashboard,
  UsersRound,
  CalendarCheck2,
  Files,
  Settings,
  BarChart2,
  GraduationCap,
  WalletCards,
  VideoIcon,
  FileCheck,
  ClipboardCheck,
  MessagesSquare,
  Building2,
  BellRing,
  Network
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface NavigationItem {
  id: string;
  icon: any;
  label: string;
  description: string;
}

const navigationItems: NavigationItem[] = [
  {
    id: "dashboard",
    icon: LayoutDashboard,
    label: "Dashboard",
    description: "HR Overview & KPIs",
  },
  {
    id: "employees",
    icon: UsersRound,
    label: "Employees",
    description: "Team Management",
  },
  {
    id: "attendance",
    icon: CalendarCheck2,
    label: "Attendance",
    description: "Time & Attendance",
  },
  {
    id: "projects",
    icon: Network,
    label: "Projects",
    description: "Company projects",
  },
  {
    id: "documents",
    icon: Files,
    label: "Documents",
    description: "File management",
  },
  {
    id: "analytics",
    icon: BarChart2,
    label: "Analytics",
    description: "View insights",
  },
  {
    id: "recruitment",
    icon: GraduationCap,
    label: "Recruitment",
    description: "Hire talent",
  },
  {
    id: "settings",
    icon: Settings,
    label: "Settings",
    description: "System config",
  },
  {
    id: "documents",
    icon: FileCheck,
    label: "Documents",
    description: "HR Documentation",
  },
  {
    id: "tasks",
    icon: ClipboardCheck,
    label: "Tasks",
    description: "Assignments & Goals",
  },
  {
    id: "communication",
    icon: MessagesSquare,
    label: "Messages",
    description: "Team Communication",
  },
  {
    id: "organization",
    icon: Building2,
    label: "Organization",
    description: "Company Structure",
  },
  {
    id: "payroll",
    icon: WalletCards,
    label: "Payroll",
    description: "Salary & Benefits",
  },
  {
    id: "recruitment",
    icon: GraduationCap,
    label: "Recruitment",
    description: "Talent Acquisition",
  },
  {
    id: "meetings",
    icon: VideoIcon,
    label: "Meetings",
    description: "Virtual Meetings",
  },
  {
    id: "notifications",
    icon: BellRing,
    label: "Notifications",
    description: "Updates & Alerts",
  },
  {
    id: "analytics",
    icon: BarChart2,
    label: "Analytics",
    description: "HR Insights",
  },
  {
    id: "network",
    icon: Network,
    label: "Network",
    description: "Team Connections",
  },
  {
    id: "settings",
    icon: Settings,
    label: "Settings",
    description: "System Settings",
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
  const isMobile = useIsMobile();

  return (
    <aside
      className={cn(
        "bg-card border-r border-border fixed left-0 top-0 h-full z-50",
        "w-[280px] transition-all duration-300",
        isMobile ? "w-[70px] hover:w-[280px]" : "w-[280px]",
        "group",
        className
      )}
    >
      <div className="flex flex-col h-full">
        <div className="p-4 border-b border-border">
          <Logo 
            collapsed={isMobile} 
            className="transition-all duration-300"
          />
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
                    "w-full relative group/item p-2",
                    isMobile ? "justify-center" : "justify-start",
                    "hover:bg-muted/50 transition-all duration-200",
                    isActive && "bg-muted"
                  )}
                  onClick={() => onModuleChange(item.id)}
                >
                  <div className={cn(
                    "flex items-center justify-center h-10 w-10 rounded-xl transition-all duration-300",
                    isActive 
                      ? "bg-primary/15 text-primary shadow-lg shadow-primary/10" 
                      : "bg-muted/60 text-foreground hover:shadow-md",
                    "group-hover/item:bg-primary/10 group-hover/item:text-primary"
                  )}>
                    {Icon && <Icon className="h-5 w-5" />}
                    <Icon className={cn(
                      "h-5 w-5 transition-transform duration-300",
                      isActive ? "text-primary" : "text-foreground",
                      "group-hover/item:text-primary"
                    )} />
                  </div>
                  <div className={cn(
                    "flex flex-col items-start ml-3 transition-all duration-300",
                    isMobile && "opacity-0 group-hover:opacity-100"
                  )}>
                    <span className="font-medium text-foreground group-hover/item:text-primary transition-colors">
                      {item.label}
                    </span>
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
