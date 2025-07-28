import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import AttendanceManagement from './AttendanceManagement';
import PayrollManagement from './PayrollManagement';
import DocumentManagement from './DocumentManagement';
import AnalyticsReports from './AnalyticsReports';
import RecruitmentManagement from './RecruitmentManagement';
import EmployeeManagement from './EmployeeManagement';
import MeetingsManagement from './MeetingsManagement';
import Settings from './Settings';
import { 
  Users, 
  DollarSign, 
  FileText, 
  Calendar, 
  Bell, 
  Settings as SettingsIcon,
  Menu,
  Search,
  Moon,
  Sun,
  Building2,
  TrendingUp,
  Clock,
  UserCheck,
  BarChart3,
  ChevronRight,
  ChevronDown,
  Home,
  ChevronLeft,
  Maximize2,
  Minimize2,
  PanelLeftClose,
  PanelLeftOpen,
  ChevronsLeft,
  ChevronsRight,
  HelpCircle
} from 'lucide-react';

interface DashboardProps {
  userRole?: 'admin' | 'hr' | 'manager' | 'employee' | 'intern';
}

const Dashboard: React.FC<DashboardProps> = ({ userRole = 'admin' }) => {
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sidebarMode, setSidebarMode] = useState<'full' | 'mini' | 'hidden'>('full');
  const [sidebarHovered, setSidebarHovered] = useState(false);
  const [activeModule, setActiveModule] = useState('overview');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  // Daily timeline state
  const [currentTime, setCurrentTime] = useState(new Date());
  const [workDayProgress, setWorkDayProgress] = useState(0);
  const [timeOfDay, setTimeOfDay] = useState('');
  const [showTimeModal, setShowTimeModal] = useState(false);
  
  // Update time every minute
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now);
      
      // Calculate work day progress (9 AM to 6 PM = 9 hours)
      const hour = now.getHours();
      const minute = now.getMinutes();
      const totalMinutes = hour * 60 + minute;
      const workStart = 9 * 60; // 9 AM in minutes
      const workEnd = 18 * 60; // 6 PM in minutes
      
      if (totalMinutes < workStart) {
        setWorkDayProgress(0);
        setTimeOfDay('Early Morning');
      } else if (totalMinutes > workEnd) {
        setWorkDayProgress(100);
        setTimeOfDay('Evening');
      } else {
        const progress = ((totalMinutes - workStart) / (workEnd - workStart)) * 100;
        setWorkDayProgress(Math.min(100, Math.max(0, progress)));
        
        if (hour < 12) setTimeOfDay('Morning');
        else if (hour < 17) setTimeOfDay('Afternoon');
        else setTimeOfDay('Evening');
      }
    };
    
    updateTime();
    const interval = setInterval(updateTime, 60000); // Update every minute
    
    return () => clearInterval(interval);
  }, []);

  // Toggle sidebar modes
  const toggleSidebar = () => {
    if (sidebarMode === 'full') {
      setSidebarMode('mini');
    } else if (sidebarMode === 'mini') {
      setSidebarMode('hidden');
    } else {
      setSidebarMode('full');
    }
  };

  // Get sidebar width based on mode and hover state
  const getSidebarWidth = () => {
    if (sidebarMode === 'hidden') return 'w-0';
    if (sidebarMode === 'mini') return sidebarHovered ? 'w-64' : 'w-16';
    return 'w-64';
  };

  // Get sidebar visibility
  const getSidebarVisibility = () => {
    if (sidebarMode === 'hidden') return 'translate-x-0 lg:-translate-x-full';
    return 'translate-x-0';
  };

  // Handle module changes with loading state
  const handleModuleChange = (moduleId: string) => {
    setIsLoading(true);
    setTimeout(() => {
      setActiveModule(moduleId);
      setIsLoading(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    }, 300);
  };

  // Auto-adjust sidebar for mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setSidebarMode('hidden');
      } else {
        setSidebarMode('full');
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);  const modules = [
    { id: 'overview', icon: Home, label: 'Overview', description: 'Dashboard home' },
    { id: 'employees', icon: Users, label: 'Employees', description: 'Manage workforce' },
    { id: 'attendance', icon: Calendar, label: 'Attendance', description: 'Track presence' },
    { id: 'payroll', icon: DollarSign, label: 'Payroll', description: 'Process payments' },
    { id: 'meetings', icon: Calendar, label: 'Meetings', description: 'Schedule & conduct' },
    { id: 'documents', icon: FileText, label: 'Documents', description: 'File management' },
    { id: 'analytics', icon: BarChart3, label: 'Analytics', description: 'View insights' },
    { id: 'recruitment', icon: UserCheck, label: 'Recruitment', description: 'Hire talent' },
    { id: 'settings', icon: SettingsIcon, label: 'Settings', description: 'System config' }
  ];

  const quickStats = [
    {
      title: 'Total Employees',
      value: '247',
      change: '+12%',
      icon: Users,
      color: 'primary'
    },
    {
      title: 'Monthly Revenue',
      value: '$125.8K',
      change: '+8.2%',
      icon: DollarSign,
      color: 'accent'
    },
    {
      title: 'Active Projects',
      value: '18',
      change: '+3',
      icon: FileText,
      color: 'warning'
    },
    {
      title: 'Pending Approvals',
      value: '7',
      change: '-2',
      icon: Clock,
      color: 'destructive'
    }
  ];

  const recentActivities = [
    { type: 'New hire', description: 'Sarah Johnson joined as UI Designer', time: '2 hours ago' },
    { type: 'Leave request', description: 'Mark Davis requested 3 days leave', time: '4 hours ago' },
    { type: 'Project update', description: 'Mobile app project completed Phase 2', time: '6 hours ago' },
    { type: 'Expense approved', description: 'Travel expense of $340 approved for Alex', time: '1 day ago' }
  ];

  const toggleTheme = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted transition-all duration-300 animate-fade-in">
      {/* Enhanced Top Navigation */}
      <header className="glass-card border-b border-border/50 backdrop-blur-xl sticky top-0 z-50 animate-slide-in-down">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={toggleSidebar}
              className="hover-scale group"
            >
              {sidebarMode === 'full' ? (
                <PanelLeftClose className="h-5 w-5 group-hover:animate-bounce-in" />
              ) : sidebarMode === 'mini' ? (
                <PanelLeftOpen className="h-5 w-5 group-hover:animate-bounce-in" />
              ) : (
                <Menu className="h-5 w-5 group-hover:animate-bounce-in" />
              )}
            </Button>
            
            <div className="flex items-center gap-3 animate-fade-in-left">
              <div className="p-2 rounded-xl bg-primary-gradient shadow-lg hover-glow">
                <Building2 className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                  Omyra HRM
                </h1>
                <p className="text-xs text-muted-foreground">Enterprise Suite</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 animate-fade-in-right">
            {/* Enhanced Search */}
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search employees, projects..."
                className="pl-10 pr-4 py-2 w-64 neu-inset rounded-xl border-0 bg-muted/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-300"
              />
            </div>

            {/* Enhanced Notifications */}
            <Button variant="ghost" size="icon-sm" className="relative hover-scale">
              <Bell className="h-5 w-5" />
              <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs bg-destructive">
                3
              </Badge>
            </Button>

            {/* Theme Toggle */}
            <Button variant="ghost" size="icon-sm" onClick={toggleTheme} className="hover-rotate">
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>

            {/* Settings */}
            <Button variant="ghost" size="icon-sm" className="hover-scale">
              <SettingsIcon className="h-5 w-5" />
            </Button>

            {/* Compact Daily Timeline */}
            <div 
              className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border border-blue-200/30 dark:border-blue-800/30 hover-lift shadow-sm cursor-pointer transition-all duration-300 hover:shadow-md hover:scale-105"
              onClick={() => setShowTimeModal(true)}
            >
              <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <div className="flex flex-col items-center">
                <div className="text-xs font-mono text-blue-700 dark:text-blue-300 font-semibold">
                  {currentTime.toLocaleTimeString('en-US', { 
                    hour: '2-digit', 
                    minute: '2-digit',
                    hour12: true 
                  })}
                </div>
                <div className="text-xs text-blue-600/70 dark:text-blue-400/70 capitalize">
                  {timeOfDay}
                </div>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-16 bg-blue-200/50 dark:bg-blue-800/30 rounded-full h-1.5 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${workDayProgress}%` }}
                  ></div>
                </div>
                <div className="text-xs text-blue-600/70 dark:text-blue-400/70 mt-1 font-medium">
                  {Math.round(workDayProgress)}%
                </div>
              </div>
            </div>

            {/* Mobile Timeline (Icon Only) */}
            <div 
              className="sm:hidden flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 relative overflow-hidden shadow-lg cursor-pointer hover:scale-110 transition-transform duration-300"
              onClick={() => setShowTimeModal(true)}
            >
              <Clock className="h-4 w-4 text-white" />
              <div 
                className="absolute bottom-0 left-0 bg-white/30 transition-all duration-1000"
                style={{ height: `${workDayProgress}%`, width: '100%' }}
              ></div>
            </div>

            {/* Enhanced User Profile */}
            <div className="flex items-center gap-3 pl-4 border-l border-border/50">
              <div className="h-8 w-8 rounded-full bg-primary-gradient flex items-center justify-center hover-glow">
                <span className="text-sm font-medium text-primary-foreground">JD</span>
              </div>
              <div className="hidden md:block text-right">
                <p className="text-sm font-medium">John Doe</p>
                <p className="text-xs text-muted-foreground capitalize">{userRole}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Enhanced Animated Sidebar with Multiple Modes */}
        <aside 
          className={`
            ${getSidebarWidth()} ${getSidebarVisibility()}
            transition-all duration-500 ease-in-out
            bg-gradient-to-b from-sidebar/90 to-sidebar/70
            backdrop-blur-xl 
            border-r border-sidebar-border/30
            min-h-[calc(100vh-73px)]
            fixed lg:relative
            z-40
            shadow-2xl lg:shadow-lg
            animate-fade-in-left
            group/sidebar
            overflow-hidden
          `}
          onMouseEnter={() => setSidebarHovered(true)}
          onMouseLeave={() => setSidebarHovered(false)}
        >
          {/* Sidebar Toggle Button */}
          {sidebarMode !== 'hidden' && (
            <Button
              variant="ghost"
              size="icon"
              className={`
                absolute top-4 -right-3 z-50
                w-6 h-6 rounded-full
                bg-primary text-primary-foreground
                shadow-lg hover:shadow-xl
                transition-all duration-300
                hover:scale-110
                ${sidebarMode === 'mini' && !sidebarHovered ? 'opacity-0 group-hover/sidebar:opacity-100' : ''}
              `}
              onClick={toggleSidebar}
            >
              {sidebarMode === 'full' || (sidebarMode === 'mini' && sidebarHovered) ? (
                <ChevronsLeft className="h-3 w-3" />
              ) : (
                <ChevronsRight className="h-3 w-3" />
              )}
            </Button>
          )}

          {/* Sidebar Header */}
          <div className={`
            p-4 border-b border-sidebar-border/20
            transition-all duration-300
            ${sidebarMode === 'mini' && !sidebarHovered ? 'px-3' : 'px-4'}
          `}>
            <div className={`
              flex items-center gap-3 transition-all duration-300
              ${sidebarMode === 'mini' && !sidebarHovered ? 'justify-center' : ''}
            `}>
              <div className="p-2 rounded-lg bg-primary-gradient shadow-lg animate-glow hover:scale-110 transition-transform">
                <Building2 className="h-5 w-5 text-white" />
              </div>
              {(sidebarMode === 'full' || (sidebarMode === 'mini' && sidebarHovered)) && (
                <div className="animate-fade-in-right">
                  <h3 className="font-semibold text-sm">HRM Navigation</h3>
                  <p className="text-xs text-muted-foreground">Choose a module</p>
                </div>
              )}
            </div>
          </div>

          {/* Enhanced Navigation with Smart Animations */}
          <nav className={`
            p-4 space-y-2 transition-all duration-300
            ${sidebarMode === 'mini' && !sidebarHovered ? 'px-2' : 'px-4'}
          `}>
            {modules.map((module, index) => (
              <div 
                key={module.id} 
                className="stagger-item group/item relative"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <Button
                  variant={activeModule === module.id ? "neu-primary" : "ghost"}
                  className={`
                    w-full relative overflow-hidden
                    ${sidebarMode === 'mini' && !sidebarHovered ? 
                      'justify-center px-2 h-12' : 
                      'justify-start gap-3 px-4'
                    }
                    ${activeModule === module.id ? 
                      'shadow-lg animate-glow bg-primary/10 border-primary/20' : 
                      'hover-lift hover:bg-accent/10'
                    }
                    transition-all duration-300 ease-in-out
                    group-hover/item:scale-105
                    group-hover/item:shadow-md
                  `}
                  onClick={() => handleModuleChange(module.id)}
                  disabled={isLoading}
                >
                  {/* Animated loading ripple */}
                  {isLoading && activeModule === module.id && (
                    <div className="absolute inset-0 bg-primary/20"></div>
                  )}
                  
                  {/* Enhanced icon with better animations */}
                  <div className={`
                    relative transition-all duration-300
                    ${activeModule === module.id ? 'text-primary' : ''}
                    group-hover/item:scale-110
                    group-hover/item:rotate-3
                  `}>
                    <module.icon className="h-5 w-5" />
                    {/* Icon glow effect for active module - static version */}
                    {activeModule === module.id && (
                      <div className="absolute inset-0 opacity-30">
                        <module.icon className="h-5 w-5 text-primary/30" />
                      </div>
                    )}
                  </div>
                  
                  {/* Enhanced text with slide animation */}
                  {(sidebarMode === 'full' || (sidebarMode === 'mini' && sidebarHovered)) && (
                    <div className="flex-1 text-left animate-fade-in-right">
                      <span className="font-medium block">{module.label}</span>
                      <p className="text-xs text-muted-foreground truncate">{module.description}</p>
                    </div>
                  )}
                  
                  {/* Arrow indicator with bounce animation */}
                  {(sidebarMode === 'full' || (sidebarMode === 'mini' && sidebarHovered)) && activeModule === module.id && (
                    <ChevronRight className="h-4 w-4 animate-bounce-x" />
                  )}
                  
                  {/* Enhanced active indicator */}
                  {activeModule === module.id && (
                    <>
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary to-accent animate-slide-in-up"></div>
                      <div className="absolute left-1 top-1/2 -translate-y-1/2 w-2 h-2 bg-primary rounded-full"></div>
                    </>
                  )}
                  
                  {/* Hover effect gradient */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover/item:opacity-100 transition-opacity duration-300 -skew-x-12 transform translate-x-full group-hover/item:-translate-x-full"></div>
                </Button>
                
                {/* Enhanced tooltip for mini mode */}
                {sidebarMode === 'mini' && !sidebarHovered && (
                  <div className="absolute left-full ml-3 px-3 py-2 bg-black/90 text-white text-sm rounded-lg opacity-0 group-hover/item:opacity-100 transition-all duration-300 pointer-events-none z-50 backdrop-blur-sm border border-white/10">
                    <div className="font-medium">{module.label}</div>
                    <div className="text-xs text-gray-300">{module.description}</div>
                    {/* Tooltip arrow */}
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-2 h-2 bg-black/90 rotate-45 border-l border-b border-white/10"></div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Enhanced Footer with Smart Layout */}
          <div className={`
            mt-auto p-4 border-t border-border/10 space-y-3
            ${sidebarMode === 'mini' && !sidebarHovered ? 'px-2' : 'px-4'}
          `}>
            {/* Quick Actions Row */}
            <div className={`
              flex gap-2 transition-all duration-300
              ${sidebarMode === 'mini' && !sidebarHovered ? 'justify-center' : 'justify-between'}
            `}>
              <Button 
                variant="outline" 
                size="sm" 
                className={`
                  group/action hover-lift transition-all duration-300
                  ${sidebarMode === 'mini' && !sidebarHovered ? 'w-10 h-10 p-0' : 'flex-1'}
                  hover:shadow-lg hover:scale-105
                `}
              >
                <SettingsIcon className="h-4 w-4 group-hover/action:rotate-90 transition-transform duration-300" />
                {(sidebarMode === 'full' || (sidebarMode === 'mini' && sidebarHovered)) && (
                  <span className="ml-2 animate-fade-in">Settings</span>
                )}
              </Button>
              
              {(sidebarMode === 'full' || (sidebarMode === 'mini' && sidebarHovered)) && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="group/action hover-lift hover:shadow-lg hover:scale-105 transition-all duration-300"
                >
                  <HelpCircle className="h-4 w-4 group-hover/action:scale-110 transition-transform duration-300" />
                  <span className="ml-2 animate-fade-in">Help</span>
                </Button>
              )}
            </div>
            
            {/* User Profile Section */}
            <div className={`
              flex items-center gap-3 p-3 rounded-xl bg-accent/20 hover:bg-accent/30 
              hover-lift cursor-pointer transition-all duration-300
              ${sidebarMode === 'mini' && !sidebarHovered ? 'justify-center p-2' : ''}
              hover:shadow-lg group/profile
            `}>
              <div className="relative">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-semibold shadow-lg group-hover/profile:scale-110 transition-transform duration-300">
                  JD
                </div>
                {/* Online status indicator */}
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-background"></div>
              </div>
              
              {(sidebarMode === 'full' || (sidebarMode === 'mini' && sidebarHovered)) && (
                <div className="flex-1 min-w-0 animate-fade-in-right">
                  <div className="font-medium text-sm truncate group-hover/profile:text-primary transition-colors duration-300">
                    John Doe
                  </div>
                  <div className="text-xs text-muted-foreground truncate">
                    HR Manager
                  </div>
                </div>
              )}
              
              {(sidebarMode === 'full' || (sidebarMode === 'mini' && sidebarHovered)) && (
                <ChevronDown className="h-4 w-4 text-muted-foreground group-hover/profile:text-primary group-hover/profile:rotate-180 transition-all duration-300" />
              )}
            </div>
            
            {/* Enhanced Version Info */}
            {(sidebarMode === 'full' || (sidebarMode === 'mini' && sidebarHovered)) && (
              <div className="text-center text-xs text-muted-foreground animate-fade-in">
                <div className="flex items-center justify-center gap-1 hover:text-primary transition-colors duration-300 cursor-pointer">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>v2.1.0 • All systems operational</span>
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* Enhanced Overlay with Smart Visibility */}
        {(sidebarMode !== 'hidden') && (
          <div 
            className={`
              fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden
              transition-all duration-500 ease-in-out
              ${sidebarMode === 'full' ? 'opacity-100 visible' : 'opacity-0 invisible'}
            `}
            onClick={() => setSidebarMode('hidden')}
          />
        )}

        {/* Enhanced Main Content with Smart Margins */}
        <main className="flex-1 p-6 transition-all duration-500 ease-in-out bg-gradient-to-br from-background via-background/95 to-accent/5 backdrop-blur-sm">
          {/* Success Toast */}
          {showSuccess && (
            <div className="fixed top-20 right-6 z-50 bg-accent text-white px-6 py-3 rounded-lg shadow-lg animate-slide-in-down">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                Module loaded successfully!
              </div>
            </div>
          )}

          {/* Loading Overlay */}
          {isLoading && (
            <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 flex items-center justify-center">
              <div className="bg-card p-8 rounded-2xl shadow-2xl animate-scale-in">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-lg font-medium">Loading module...</span>
                </div>
              </div>
            </div>
          )}

          {activeModule === 'overview' && (
            <div className="space-y-8 animate-fade-in">
              {/* Enhanced Welcome Section */}
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 animate-fade-in-up">
                <div className="space-y-2">
                  <h2 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent animate-gradient">
                    Good morning, John! 👋
                  </h2>
                  <p className="text-lg text-muted-foreground animate-fade-in-up" style={{animationDelay: '200ms'}}>
                    Here's what's happening at your company today.
                  </p>
                </div>
                <div className="flex gap-3 animate-fade-in-right">
                  <Button 
                    variant="outline" 
                    className="hover-lift group"
                    onClick={() => handleModuleChange('meetings')}
                    disabled={isLoading}
                  >
                    <Calendar className="h-4 w-4 group-hover:animate-bounce-in" />
                    Schedule Meeting
                  </Button>
                  <Button 
                    variant="neu-primary" 
                    className="hover-glow group"
                    onClick={() => handleModuleChange('employees')}
                    disabled={isLoading}
                  >
                    <Users className="h-4 w-4 group-hover:animate-bounce-in" />
                    Add Employee
                  </Button>
                </div>
              </div>

              {/* Enhanced Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {quickStats.map((stat, index) => (
                  <Card 
                    key={index} 
                    className={`
                      neu-surface p-6 hover-lift group cursor-pointer
                      stagger-item animate-fade-in-up
                      relative overflow-hidden
                    `} 
                    style={{animationDelay: `${index * 100}ms`}}
                    onClick={() => {
                      // Navigate to relevant module based on stat type
                      if (stat.title.includes('Employees')) handleModuleChange('employees');
                      else if (stat.title.includes('Revenue')) handleModuleChange('analytics');
                      else if (stat.title.includes('Projects')) handleModuleChange('documents');
                      else if (stat.title.includes('Approvals')) handleModuleChange('settings');
                    }}
                  >
                    {/* Hover gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    <div className="relative flex items-center justify-between">
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground group-hover:text-primary transition-colors">
                          {stat.title}
                        </p>
                        <p className="text-3xl font-bold group-hover:scale-105 transition-transform">
                          {stat.value}
                        </p>
                        <div className="flex items-center gap-2">
                          <TrendingUp className={`h-4 w-4 ${
                            stat.change.startsWith('+') ? 'text-accent' : 'text-destructive'
                          } group-hover:animate-bounce-in`} />
                          <span className={`text-sm font-medium ${
                            stat.change.startsWith('+') ? 'text-accent' : 'text-destructive'
                          }`}>
                            {stat.change}
                          </span>
                        </div>
                      </div>
                      <div className={`
                        p-3 rounded-xl bg-gradient-to-r 
                        ${stat.color === 'primary' ? 'from-primary/10 to-primary/20' : ''}
                        ${stat.color === 'accent' ? 'from-accent/10 to-accent/20' : ''}
                        ${stat.color === 'warning' ? 'from-warning/10 to-warning/20' : ''}
                        ${stat.color === 'destructive' ? 'from-destructive/10 to-destructive/20' : ''}
                        group-hover:scale-110 group-hover:animate-glow transition-all duration-300
                      `}>
                        <stat.icon className={`h-8 w-8 ${
                          stat.color === 'primary' ? 'text-primary' : ''
                        }${stat.color === 'accent' ? 'text-accent' : ''}${
                          stat.color === 'warning' ? 'text-warning' : ''
                        }${stat.color === 'destructive' ? 'text-destructive' : ''}
                        group-hover:animate-floating`} />
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Enhanced Recent Activities */}
              <Card className="neu-surface p-6 animate-fade-in-up" style={{animationDelay: '600ms'}}>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold animate-fade-in-left">Recent Activities</h3>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="hover-lift"
                    onClick={() => handleModuleChange('analytics')}
                    disabled={isLoading}
                  >
                    View All
                  </Button>
                </div>
                
                <div className="space-y-4">
                  {recentActivities.map((activity, index) => (
                    <div 
                      key={index} 
                      className={`
                        flex items-start gap-4 p-4 rounded-xl 
                        bg-muted/30 hover:bg-muted/50 
                        transition-all duration-300 cursor-pointer
                        hover-lift group stagger-item
                      `} 
                      style={{animationDelay: `${700 + index * 100}ms`}}
                      onClick={() => {
                        // Navigate based on activity type
                        if (activity.type === 'New hire') handleModuleChange('employees');
                        else if (activity.type === 'Leave request') handleModuleChange('attendance');
                        else if (activity.type === 'Project update') handleModuleChange('documents');
                        else if (activity.type === 'Expense approved') handleModuleChange('payroll');
                      }}
                    >
                      <div className="h-2 w-2 rounded-full bg-primary mt-2 group-hover:scale-125 transition-transform"></div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs group-hover:scale-105 transition-transform">
                            {activity.type}
                          </Badge>
                          <span className="text-sm text-muted-foreground">{activity.time}</span>
                        </div>
                        <p className="text-sm mt-1 group-hover:text-primary transition-colors">{activity.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}
          
          {/* Module Components with animations */}
          {activeModule === 'employees' && (
            <div className="animate-fade-in">
              <EmployeeManagement />
            </div>
          )}
          {activeModule === 'attendance' && (
            <div className="animate-fade-in">
              <AttendanceManagement />
            </div>
          )}
          {activeModule === 'payroll' && (
            <div className="animate-fade-in">
              <PayrollManagement />
            </div>
          )}
          {activeModule === 'meetings' && (
            <div className="animate-fade-in">
              <MeetingsManagement />
            </div>
          )}
          {activeModule === 'documents' && (
            <div className="animate-fade-in">
              <DocumentManagement />
            </div>
          )}
          {activeModule === 'analytics' && (
            <div className="animate-fade-in">
              <AnalyticsReports />
            </div>
          )}
          {activeModule === 'recruitment' && (
            <div className="animate-fade-in">
              <RecruitmentManagement />
            </div>
          )}
          {activeModule === 'settings' && (
            <div className="animate-fade-in">
              <Settings />
            </div>
          )}
        </main>
      </div>

      {/* Beautiful Time Display Modal */}
      {showTimeModal && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-lg z-50 flex items-center justify-center animate-fade-in"
          onClick={() => setShowTimeModal(false)}
        >
          <div 
            className="relative bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-blue-950 dark:to-indigo-950 p-8 rounded-3xl shadow-2xl border border-blue-200/30 dark:border-blue-800/30 max-w-md w-full mx-4 animate-bounce-in backdrop-blur-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button 
              onClick={() => setShowTimeModal(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/80 dark:bg-black/40 hover:bg-white dark:hover:bg-black/60 flex items-center justify-center transition-all duration-300 hover:scale-110"
            >
              <span className="text-gray-600 dark:text-gray-300 text-lg">×</span>
            </button>

            {/* Main Time Display */}
            <div className="text-center space-y-6">
              {/* Digital Clock */}
              <div className="animate-fade-in-up">
                <div className="text-6xl md:text-7xl font-mono font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent animate-glow">
                  {currentTime.toLocaleTimeString('en-US', { 
                    hour: '2-digit', 
                    minute: '2-digit',
                    hour12: false 
                  })}
                </div>
                <div className="text-xl text-blue-600 dark:text-blue-400 font-medium mt-2 animate-fade-in-up" style={{animationDelay: '200ms'}}>
                  {currentTime.toLocaleTimeString('en-US', { 
                    hour12: true 
                  }).slice(-2)}
                </div>
              </div>

              {/* Date and Day */}
              <div className="animate-fade-in-up" style={{animationDelay: '300ms'}}>
                <div className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
                  {currentTime.toLocaleDateString('en-US', { 
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </div>
                <div className="text-lg text-blue-600 dark:text-blue-400 capitalize font-medium mt-1">
                  {timeOfDay}
                </div>
              </div>

              {/* Work Day Progress */}
              <div className="animate-fade-in-up" style={{animationDelay: '400ms'}}>
                <div className="bg-white/50 dark:bg-black/20 rounded-2xl p-6 backdrop-blur-sm">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Work Day Progress</span>
                    <span className="text-lg font-bold text-blue-600 dark:text-blue-400">{Math.round(workDayProgress)}%</span>
                  </div>
                  
                  <div className="relative">
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-full transition-all duration-1000 ease-out relative overflow-hidden"
                        style={{ width: `${workDayProgress}%` }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
                      </div>
                    </div>
                    
                    {/* Time markers */}
                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-2">
                      <span>9:00 AM</span>
                      <span>12:00 PM</span>
                      <span>3:00 PM</span>
                      <span>6:00 PM</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Time Zone and Additional Info */}
              <div className="animate-fade-in-up" style={{animationDelay: '500ms'}}>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="bg-white/30 dark:bg-black/20 rounded-xl p-3 backdrop-blur-sm">
                    <div className="text-xs text-gray-600 dark:text-gray-400">Time Zone</div>
                    <div className="text-sm font-medium text-gray-800 dark:text-gray-200">
                      {Intl.DateTimeFormat().resolvedOptions().timeZone}
                    </div>
                  </div>
                  <div className="bg-white/30 dark:bg-black/20 rounded-xl p-3 backdrop-blur-sm">
                    <div className="text-xs text-gray-600 dark:text-gray-400">Week Day</div>
                    <div className="text-sm font-medium text-gray-800 dark:text-gray-200">
                      Day {Math.ceil((currentTime.getDate()) / 7)} of Month
                    </div>
                  </div>
                </div>
              </div>

              {/* Motivational Message */}
              <div className="animate-fade-in-up" style={{animationDelay: '600ms'}}>
                <div className="bg-gradient-to-r from-blue-500/10 to-indigo-500/10 dark:from-blue-400/10 dark:to-indigo-400/10 rounded-xl p-4 border border-blue-200/30 dark:border-blue-700/30">
                  <div className="text-sm text-center text-gray-700 dark:text-gray-300">
                    {workDayProgress < 25 ? "🌅 Good morning! Ready to make today productive?" :
                     workDayProgress < 50 ? "☀️ You're making great progress! Keep it up!" :
                     workDayProgress < 75 ? "🌤️ Afternoon productivity in full swing!" :
                     workDayProgress < 100 ? "🌆 Almost done! Finish strong!" :
                     "🌙 Work day complete! Time to relax and recharge!"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
