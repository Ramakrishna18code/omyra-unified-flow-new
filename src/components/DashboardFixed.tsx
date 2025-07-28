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
  Home
} from 'lucide-react';

interface DashboardProps {
  userRole?: 'admin' | 'hr' | 'manager' | 'employee' | 'intern';
}

const Dashboard: React.FC<DashboardProps> = ({ userRole = 'admin' }) => {
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeModule, setActiveModule] = useState('overview');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

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

  // Auto-hide sidebar on mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const modules = [
    { id: 'overview', icon: Home, label: 'Overview', description: 'Dashboard home' },
    { id: 'employees', icon: Users, label: 'Employees', description: 'Manage workforce' },
    { id: 'attendance', icon: Calendar, label: 'Attendance', description: 'Track presence' },
    { id: 'payroll', icon: DollarSign, label: 'Payroll', description: 'Process payments' },
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
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden hover-scale"
            >
              <Menu className="h-5 w-5" />
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
              <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs bg-destructive animate-pulse-soft">
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
        {/* Enhanced Animated Sidebar */}
        <aside className={`
          ${sidebarOpen ? 'w-64 translate-x-0' : 'w-16 -translate-x-full lg:translate-x-0'} 
          transition-all duration-500 ease-in-out
          bg-gradient-to-b from-sidebar/80 to-sidebar/60
          backdrop-blur-xl 
          border-r border-sidebar-border/30
          min-h-[calc(100vh-73px)]
          fixed lg:relative
          z-40
          shadow-2xl lg:shadow-none
          animate-fade-in-left
        `}>
          {/* Sidebar Header */}
          <div className="p-4 border-b border-sidebar-border/20">
            <div className={`flex items-center gap-3 ${!sidebarOpen ? 'justify-center' : ''}`}>
              <div className="p-2 rounded-lg bg-primary-gradient shadow-lg animate-glow">
                <Building2 className="h-5 w-5 text-white" />
              </div>
              {sidebarOpen && (
                <div className="animate-fade-in-right">
                  <h3 className="font-semibold text-sm">Navigation</h3>
                  <p className="text-xs text-muted-foreground">Choose a module</p>
                </div>
              )}
            </div>
          </div>

          {/* Enhanced Navigation */}
          <nav className="p-4 space-y-2">
            {modules.map((module, index) => (
              <div key={module.id} className="stagger-item group relative">
                <Button
                  variant={activeModule === module.id ? "neu-primary" : "ghost"}
                  className={`
                    w-full justify-start gap-3 relative overflow-hidden
                    ${!sidebarOpen ? 'px-3 justify-center' : 'px-4'}
                    ${activeModule === module.id ? 'shadow-lg animate-glow' : 'hover-lift'}
                    transition-all duration-300 ease-in-out
                    group-hover:scale-105
                  `}
                  onClick={() => handleModuleChange(module.id)}
                  disabled={isLoading}
                >
                  {/* Loading ripple effect */}
                  {isLoading && activeModule === module.id && (
                    <div className="absolute inset-0 bg-primary/20 animate-ripple"></div>
                  )}
                  
                  <module.icon className={`h-5 w-5 transition-transform duration-300 ${
                    activeModule === module.id ? 'animate-pulse-soft' : 'group-hover:scale-110'
                  }`} />
                  
                  {sidebarOpen && (
                    <div className="flex-1 text-left animate-fade-in-right">
                      <span className="font-medium">{module.label}</span>
                      <p className="text-xs text-muted-foreground">{module.description}</p>
                    </div>
                  )}
                  
                  {sidebarOpen && activeModule === module.id && (
                    <ChevronRight className="h-4 w-4 animate-bounce-in" />
                  )}
                  
                  {/* Active indicator */}
                  {activeModule === module.id && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary animate-slide-in-up"></div>
                  )}
                </Button>
                
                {/* Tooltip for collapsed sidebar */}
                {!sidebarOpen && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-black/80 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-50">
                    {module.label}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Sidebar Footer */}
          {sidebarOpen && (
            <div className="absolute bottom-4 left-4 right-4 animate-fade-in-up">
              <Card className="p-3 bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-accent rounded-full animate-pulse-soft"></div>
                  <span className="text-xs text-muted-foreground">System Online</span>
                </div>
              </Card>
            </div>
          )}
        </aside>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-30 lg:hidden animate-fade-in"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Enhanced Main Content */}
        <main className="flex-1 p-6 transition-all duration-300">
          {/* Success Toast */}
          {showSuccess && (
            <div className="fixed top-20 right-6 z-50 bg-accent text-white px-6 py-3 rounded-lg shadow-lg animate-slide-in-down">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse-soft"></div>
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
                  <Button variant="outline" className="hover-lift group">
                    <Calendar className="h-4 w-4 group-hover:animate-bounce-in" />
                    Schedule Meeting
                  </Button>
                  <Button variant="neu-primary" className="hover-glow group">
                    <Users className="h-4 w-4 group-hover:animate-pulse-soft" />
                    Add Employee
                  </Button>
                </div>
              </div>

              {/* Enhanced Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {quickStats.map((stat, index) => (
                  <Card key={index} className={`
                    neu-surface p-6 hover-lift group cursor-pointer
                    stagger-item animate-fade-in-up
                    relative overflow-hidden
                  `} style={{animationDelay: `${index * 100}ms`}}>
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
                  <Button variant="ghost" size="sm" className="hover-lift">
                    View All
                  </Button>
                </div>
                
                <div className="space-y-4">
                  {recentActivities.map((activity, index) => (
                    <div key={index} className={`
                      flex items-start gap-4 p-4 rounded-xl 
                      bg-muted/30 hover:bg-muted/50 
                      transition-all duration-300 cursor-pointer
                      hover-lift group stagger-item
                    `} style={{animationDelay: `${700 + index * 100}ms`}}>
                      <div className="h-2 w-2 rounded-full bg-primary mt-2 group-hover:animate-pulse-soft"></div>
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
    </div>
  );
};

export default Dashboard;
