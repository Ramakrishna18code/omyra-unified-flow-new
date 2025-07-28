import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import Layout from './Layout';
import { 
  Users, 
  DollarSign, 
  FileText, 
  Calendar, 
  TrendingUp,
  Clock,
  UserCheck,
  BarChart3,
  Activity
} from 'lucide-react';

interface DashboardProps {
  userRole?: 'admin' | 'hr' | 'manager' | 'employee' | 'intern';
}

const Dashboard: React.FC<DashboardProps> = ({ userRole = 'admin' }) => {
  const navigate = useNavigate();

  const quickStats = [
    {
      title: 'Total Employees',
      value: '247',
      change: '+12%',
      icon: Users,
      color: 'primary',
      trend: 'up'
    },
    {
      title: 'Present Today',
      value: '231',
      change: '93.5%',
      icon: UserCheck,
      color: 'accent',
      trend: 'up'
    },
    {
      title: 'Monthly Payroll',
      value: '$890.2K',
      change: '+8.2%',
      icon: DollarSign,
      color: 'warning',
      trend: 'up'
    },
    {
      title: 'Open Positions',
      value: '7',
      change: '+2',
      icon: Clock,
      color: 'destructive',
      trend: 'up'
    }
  ];

  const recentActivities = [
    { 
      type: 'Employee Update', 
      description: 'Sarah Johnson updated her profile information', 
      time: '2 hours ago',
      icon: Users,
      color: 'blue'
    },
    { 
      type: 'Leave Request', 
      description: 'Mark Davis requested 3 days vacation leave', 
      time: '4 hours ago',
      icon: Calendar,
      color: 'yellow'
    },
    { 
      type: 'Payroll Processing', 
      description: 'Monthly payroll processed for Engineering team', 
      time: '6 hours ago',
      icon: DollarSign,
      color: 'green'
    },
    { 
      type: 'New Hire', 
      description: 'Alex Thompson joined as Software Engineer', 
      time: '1 day ago',
      icon: UserCheck,
      color: 'purple'
    },
    { 
      type: 'Document Upload', 
      description: 'Q4 performance reports uploaded to system', 
      time: '2 days ago',
      icon: FileText,
      color: 'orange'
    }
  ];

  const upcomingTasks = [
    { task: 'Review pending leave requests', priority: 'high', due: 'Today' },
    { task: 'Conduct interview with John Smith', priority: 'medium', due: 'Tomorrow' },
    { task: 'Submit monthly HR report', priority: 'high', due: 'Dec 15' },
    { task: 'Performance review meeting', priority: 'low', due: 'Dec 18' }
  ];

  const handleModuleChange = (path: string) => {
    navigate(path);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <Layout 
      title="Dashboard Overview" 
      description="Welcome to your HRM dashboard - manage your workforce efficiently"
    >
      {/* Welcome Section */}
      <div className="space-y-6 animate-in fade-in-50 duration-700">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold">Good morning, John! 👋</h2>
            <p className="text-muted-foreground">Here's what's happening at your company today.</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => handleModuleChange('/attendance')}>
              <Calendar className="h-4 w-4" />
              View Attendance
            </Button>
            <Button onClick={() => handleModuleChange('/employees')}>
              <Users className="h-4 w-4" />
              Manage Employees
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickStats.map((stat, index) => (
            <Card key={index} className="neu-surface p-6 hover:scale-105 transition-transform duration-200 cursor-pointer animate-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: `${index * 100}ms` }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-3xl font-bold mt-1">{stat.value}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <TrendingUp className={`h-3 w-3 ${
                      stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                    }`} />
                    <p className={`text-sm ${
                      stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {stat.change}
                    </p>
                  </div>
                </div>
                <div className={`p-3 rounded-xl bg-${stat.color}/10`}>
                  <stat.icon className={`h-6 w-6 text-${stat.color}`} />
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activities */}
          <Card className="neu-surface p-6 lg:col-span-2 animate-in slide-in-from-left-5 duration-700">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold">Recent Activities</h3>
              <Button variant="ghost" size="sm">View All</Button>
            </div>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-start gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors duration-200">
                  <div className={`p-2 rounded-lg bg-${activity.color}-100 dark:bg-${activity.color}-900/20`}>
                    <activity.icon className={`h-4 w-4 text-${activity.color}-600 dark:text-${activity.color}-400`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{activity.type}</p>
                    <p className="text-sm text-muted-foreground">{activity.description}</p>
                    <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Upcoming Tasks */}
          <Card className="neu-surface p-6 animate-in slide-in-from-right-5 duration-700">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold">Upcoming Tasks</h3>
              <Badge variant="secondary">{upcomingTasks.length}</Badge>
            </div>
            <div className="space-y-3">
              {upcomingTasks.map((task, index) => (
                <div key={index} className="p-3 rounded-lg border border-border/50 hover:bg-muted/50 transition-colors duration-200">
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-2 h-2 rounded-full ${getPriorityColor(task.priority)}`}></div>
                    <span className="text-xs font-medium text-muted-foreground uppercase">{task.priority}</span>
                  </div>
                  <p className="text-sm font-medium mb-1">{task.task}</p>
                  <p className="text-xs text-muted-foreground">Due: {task.due}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="neu-surface p-4 hover:scale-105 transition-transform duration-200 cursor-pointer animate-in zoom-in-50 duration-500" onClick={() => handleModuleChange('/employees')}>
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-primary" />
              <div>
                <h3 className="font-semibold">Manage Employees</h3>
                <p className="text-sm text-muted-foreground">Add, edit, or view employee details</p>
              </div>
            </div>
          </Card>
          
          <Card className="neu-surface p-4 hover:scale-105 transition-transform duration-200 cursor-pointer animate-in zoom-in-50 duration-500" onClick={() => handleModuleChange('/attendance')} style={{ animationDelay: '100ms' }}>
            <div className="flex items-center gap-3">
              <Clock className="h-8 w-8 text-accent" />
              <div>
                <h3 className="font-semibold">Track Attendance</h3>
                <p className="text-sm text-muted-foreground">Monitor working hours and presence</p>
              </div>
            </div>
          </Card>
          
          <Card className="neu-surface p-4 hover:scale-105 transition-transform duration-200 cursor-pointer animate-in zoom-in-50 duration-500" onClick={() => handleModuleChange('/payroll')} style={{ animationDelay: '200ms' }}>
            <div className="flex items-center gap-3">
              <DollarSign className="h-8 w-8 text-warning" />
              <div>
                <h3 className="font-semibold">Process Payroll</h3>
                <p className="text-sm text-muted-foreground">Manage salaries and benefits</p>
              </div>
            </div>
          </Card>
          
          <Card className="neu-surface p-4 hover:scale-105 transition-transform duration-200 cursor-pointer animate-in zoom-in-50 duration-500" onClick={() => handleModuleChange('/analytics')} style={{ animationDelay: '300ms' }}>
            <div className="flex items-center gap-3">
              <BarChart3 className="h-8 w-8 text-destructive" />
              <div>
                <h3 className="font-semibold">View Analytics</h3>
                <p className="text-sm text-muted-foreground">Insights and reports</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
      {/* Top Navigation */}
      <header className="glass-card border-b border-border/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
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
            {/* Current Time */}
            <div className="hidden md:flex flex-col items-end">
              <div className="text-sm font-medium">{formatTime(currentTime)}</div>
              <div className="text-xs text-muted-foreground">{formatDate(currentTime)}</div>
            </div>

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
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs bg-destructive">
                3
              </Badge>
            </Button>

            {/* Theme Toggle */}
            <Button variant="ghost" size="icon" onClick={toggleTheme}>
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>

            {/* User Profile Dropdown */}
            <div className="flex items-center gap-3 pl-4 border-l border-border/50">
              <div className="h-8 w-8 rounded-full bg-primary-gradient flex items-center justify-center">
                <span className="text-sm font-medium text-primary-foreground">JD</span>
              </div>
              <div className="hidden md:block">
                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <p className="text-sm font-medium">John Doe</p>
                    <p className="text-xs text-muted-foreground capitalize">{userRole}</p>
                  </div>
                  <Button variant="ghost" size="icon" onClick={handleLogout}>
                    <LogOut className="h-4 w-4" />
                  </Button>
                </div>
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
          ${!sidebarOpen && 'lg:block hidden'}
        `}>
          <nav className="p-4 space-y-2">
            {modules.map((module, index) => (
              <Button
                key={index}
                variant={activeModule === module.id ? "default" : "ghost"}
                className={`
                  w-full justify-start gap-3 
                  ${!sidebarOpen && 'px-2'}
                  ${activeModule === module.id ? 'bg-primary text-primary-foreground shadow-lg' : ''}
                `}
                onClick={() => handleModuleChange(module.id, module.path)}
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
                  <Button variant="outline" onClick={() => handleModuleChange('attendance', '/attendance')}>
                    <Calendar className="h-4 w-4" />
                    View Attendance
                  </Button>
                  <Button onClick={() => handleModuleChange('employees', '/employees')}>
                    <Users className="h-4 w-4" />
                    Manage Employees
                  </Button>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {quickStats.map((stat, index) => (
                  <Card key={index} className="neu-surface p-6 hover:scale-105 transition-transform duration-200 cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">{stat.title}</p>
                        <p className="text-3xl font-bold mt-1">{stat.value}</p>
                        <div className="flex items-center gap-1 mt-1">
                          <TrendingUp className={`h-3 w-3 ${
                            stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                          }`} />
                          <p className={`text-sm ${
                            stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {stat.change}
                          </p>
                        </div>
                      </div>
                      <div className={`p-3 rounded-xl bg-${stat.color}/10`}>
                        <stat.icon className={`h-6 w-6 text-${stat.color}`} />
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Dashboard Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Activities */}
                <Card className="neu-surface p-6 lg:col-span-2">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold">Recent Activities</h3>
                    <Button variant="ghost" size="sm">View All</Button>
                  </div>
                  
                  <div className="space-y-4">
                    {recentActivities.map((activity, index) => (
                      <div key={index} className="flex items-start gap-4 p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors">
                        <div className={`p-2 rounded-lg bg-${activity.color}-100 dark:bg-${activity.color}-900/20`}>
                          <activity.icon className={`h-4 w-4 text-${activity.color}-600`} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
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

                {/* Upcoming Tasks */}
                <Card className="neu-surface p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold">Upcoming Tasks</h3>
                    <Badge variant="outline">{upcomingTasks.length}</Badge>
                  </div>
                  
                  <div className="space-y-4">
                    {upcomingTasks.map((task, index) => (
                      <div key={index} className="p-3 rounded-lg border border-border/50 hover:bg-muted/30 transition-colors">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <p className="text-sm font-medium">{task.task}</p>
                            <p className="text-xs text-muted-foreground mt-1">Due: {task.due}</p>
                          </div>
                          <div className={`h-2 w-2 rounded-full ${getPriorityColor(task.priority)} mt-2`} />
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </div>
          )}
          
