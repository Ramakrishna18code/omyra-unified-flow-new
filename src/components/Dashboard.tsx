import React, { useState } from 'react';
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
  BarChart3
} from 'lucide-react';

interface DashboardProps {
  userRole?: 'admin' | 'hr' | 'manager' | 'employee' | 'intern';
}

const Dashboard: React.FC<DashboardProps> = ({ userRole = 'admin' }) => {
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeModule, setActiveModule] = useState('overview');

  const modules = [
    { id: 'overview', icon: Building2, label: 'Overview' },
    { id: 'employees', icon: Users, label: 'Employees' },
    { id: 'attendance', icon: Calendar, label: 'Attendance' },
    { id: 'payroll', icon: DollarSign, label: 'Payroll' },
    { id: 'documents', icon: FileText, label: 'Documents' },
    { id: 'analytics', icon: BarChart3, label: 'Analytics' },
    { id: 'recruitment', icon: UserCheck, label: 'Recruitment' },
    { id: 'settings', icon: SettingsIcon, label: 'Settings' }
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
    <div className={`min-h-screen bg-gradient-to-br from-background via-background to-muted transition-all duration-300`}>
      {/* Top Navigation */}
      <header className="glass-card border-b border-border/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </Button>
            
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-primary-gradient shadow-lg">
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

          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search employees, projects..."
                className="pl-10 pr-4 py-2 w-64 neu-inset rounded-xl border-0 bg-muted/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>

            {/* Notifications */}
            <Button variant="ghost" size="icon-sm" className="relative">
              <Bell className="h-5 w-5" />
              <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs bg-destructive">
                3
              </Badge>
            </Button>

            {/* Theme Toggle */}
            <Button variant="ghost" size="icon-sm" onClick={toggleTheme}>
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>

            {/* Settings */}
            <Button variant="ghost" size="icon-sm">
              <SettingsIcon className="h-5 w-5" />
            </Button>

            {/* User Profile */}
            <div className="flex items-center gap-3 pl-4 border-l border-border/50">
              <div className="h-8 w-8 rounded-full bg-primary-gradient flex items-center justify-center">
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
        {/* Sidebar */}
        <aside className={`
          ${sidebarOpen ? 'w-64' : 'w-16'} 
          transition-all duration-300 
          bg-sidebar/50 
          backdrop-blur-xl 
          border-r border-sidebar-border/50 
          min-h-[calc(100vh-73px)]
          fixed lg:relative
          z-40
        `}>
          <nav className="p-4 space-y-2">
            {modules.map((module, index) => (
              <Button
                key={index}
                variant={activeModule === module.id ? "neu-primary" : "ghost"}
                className={`
                  w-full justify-start gap-3 
                  ${!sidebarOpen && 'px-2'}
                  ${activeModule === module.id ? 'shadow-lg' : ''}
                `}
                onClick={() => setActiveModule(module.id)}
              >
                <module.icon className="h-5 w-5" />
                {sidebarOpen && <span>{module.label}</span>}
              </Button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {activeModule === 'overview' && (
            <div className="space-y-6">
              {/* Welcome Section */}
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                  <h2 className="text-3xl font-bold">Good morning, John! 👋</h2>
                  <p className="text-muted-foreground">Here's what's happening at your company today.</p>
                </div>
                <div className="flex gap-3">
                  <Button variant="outline">
                    <Calendar className="h-4 w-4" />
                    Schedule Meeting
                  </Button>
                  <Button variant="neu-primary">
                    <Users className="h-4 w-4" />
                    Add Employee
                  </Button>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {quickStats.map((stat, index) => (
                  <Card key={index} className="neu-surface p-6 hover:scale-105 transition-transform duration-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">{stat.title}</p>
                        <p className="text-3xl font-bold mt-1">{stat.value}</p>
                        <p className={`text-sm mt-1 ${
                          stat.change.startsWith('+') ? 'text-accent' : 'text-destructive'
                        }`}>
                          {stat.change} from last month
                        </p>
                      </div>
                      <div className={`p-3 rounded-xl bg-${stat.color}/10`}>
                        <stat.icon className={`h-6 w-6 text-${stat.color}`} />
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Recent Activities */}
              <Card className="neu-surface p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold">Recent Activities</h3>
                  <Button variant="ghost" size="sm">View All</Button>
                </div>
                
                <div className="space-y-4">
                  {recentActivities.map((activity, index) => (
                    <div key={index} className="flex items-start gap-4 p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors">
                      <div className="h-2 w-2 rounded-full bg-primary mt-2"></div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {activity.type}
                          </Badge>
                          <span className="text-sm text-muted-foreground">{activity.time}</span>
                        </div>
                        <p className="text-sm mt-1">{activity.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}
          
          {activeModule === 'employees' && <EmployeeManagement />}
          {activeModule === 'attendance' && <AttendanceManagement />}
          {activeModule === 'payroll' && <PayrollManagement />}
          {activeModule === 'documents' && <DocumentManagement />}
          {activeModule === 'analytics' && <AnalyticsReports />}
          {activeModule === 'recruitment' && <RecruitmentManagement />}
          {activeModule === 'settings' && <Settings />}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;