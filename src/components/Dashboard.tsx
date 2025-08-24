import React, { useState, useEffect } from 'react';
import { Button, type ButtonProps } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import AttendanceManagement from './AttendanceManagement';
import PayrollManagement from './PayrollManagement';
import DocumentManagement from './DocumentManagement';
import AnalyticsReports from './AnalyticsReports';
import RecruitmentManagement from './RecruitmentManagement';
import EmployeeManagement from './EmployeeManagement';
import MeetingsManagement from './Settings';
import ClientInformation from './ClientInformation';
import ProjectManagement from './ProjectManagement';
import { dashboardService, type DashboardStats, type Project, type Employee } from '../services/dashboardService';
import { logAuthStatus } from '../utils/authStatus';

interface DashboardProps {
  userRole?: 'admin' | 'hr' | 'manager' | 'employee' | 'intern';
  user?: any;
  onLogout?: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ userRole = 'admin', user, onLogout }) => {
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sidebarMode, setSidebarMode] = useState<'full' | 'mini' | 'hidden'>('full');
  const [sidebarHovered, setSidebarHovered] = useState(false);
  const [activeModule, setActiveModule] = useState('overview');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  // Dashboard data state
  const [dashboardStats, setDashboardStats] = useState<DashboardStats>({
    employeeCount: 0,
    totalProfits: 0,
    totalProjects: 0,
    totalBudget: 0,
    totalAllocations: 0
  });
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [projectDetails, setProjectDetails] = useState<Project[]>([]);
  const [dashboardLoading, setDashboardLoading] = useState(true);
  const [dashboardError, setDashboardError] = useState<string | null>(null);
  
  // Daily timeline state
  const [currentTime, setCurrentTime] = useState(new Date());
  const [workDayProgress, setWorkDayProgress] = useState(0);
  const [timeOfDay, setTimeOfDay] = useState('');
  const [showTimeModal, setShowTimeModal] = useState(false);
  
  // Project state - now using backend integration
  const [projects, setProjects] = useState<any[]>([]);
  const [projectsLoading, setProjectsLoading] = useState(false);
  const [projectsError, setProjectsError] = useState<string | null>(null);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [newProject, setNewProject] = useState({ name: '', owner: '', team: '', file: null, budget: '' });
  const [draggedProject, setDraggedProject] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [projectPage, setProjectPage] = useState<'list' | 'details' | 'edit' | 'kanban'>('list');
  const [editProject, setEditProject] = useState(null);

  // Notification state
  const [notifications, setNotifications] = useState([
    { id: 1, message: '3 new leave requests', read: false },
    { id: 2, message: 'Payroll processed', read: true },
    { id: 3, message: 'New employee added', read: false },
  ]);
  const [showNotifications, setShowNotifications] = useState(false);

  // Add state for employee access roles
  const [employeeAccessRoles, setEmployeeAccessRoles] = useState(['admin', 'hr']);

  // Fetch dashboard data on component mount
  useEffect(() => {
    const fetchDashboardData = async () => {
      if (userRole === 'admin') {
        try {
          setDashboardLoading(true);
          setDashboardError(null);
          
          // Check if user is authenticated first
          const token = localStorage.getItem('token');
          if (!token) {
            console.warn('⚠️ No authentication token found. User needs to login first.');
            setDashboardError('Please login to view dashboard data');
            setDashboardLoading(false);
            return;
          }
          
          console.log('🔄 Loading dashboard data...');
          
          // Fetch comprehensive dashboard stats
          const stats = await dashboardService.getDashboardStats();
          setDashboardStats(stats);
          
          // Fetch all employees
          const employeesData = await dashboardService.getAllEmployees();
          setEmployees(employeesData.employees);
          
          // Fetch project details
          const profitsData = await dashboardService.getTotalProfits();
          setProjectDetails(profitsData.projectDetails);
          
          console.log('✅ Dashboard data loaded successfully');
        } catch (error: any) {
          console.error('❌ Error loading dashboard data:', error);
          if (error.message.includes('Authentication required') || error.message.includes('Session expired')) {
            setDashboardError('Please login to access dashboard');
          } else {
            setDashboardError('Failed to load dashboard data');
          }
        } finally {
          setDashboardLoading(false);
        }
      }
    };

    fetchDashboardData();
  }, [userRole]);

  // Fetch projects data
  const fetchProjectsData = async () => {
    if (userRole === 'admin') {
      try {
        setProjectsLoading(true);
        setProjectsError(null);
        
        // Check if user is authenticated first
        const token = localStorage.getItem('token');
        if (!token) {
          console.warn('⚠️ No authentication token found. User needs to login first.');
          setProjectsError('Please login to view projects data');
          setProjectsLoading(false);
          return;
        }
        
        console.log('🔄 Loading projects data...');
        
        // Fetch all projects
        const projectsData = await dashboardService.getAllProjects();
        
        // Transform backend projects to frontend format
        const transformedProjects = projectsData.projects.map((project: any) => ({
          id: project._id,
          name: project.name,
          budget: `$${(project.budget / 1000).toFixed(1)}K`,
          status: project.team && project.team.length > 0 ? 'In Progress' : 'Assigned',
          owner: project.team && project.team.length > 0 && project.team[0]?.employee?.name ? project.team[0].employee.name : 'Unassigned',
          team: project.team?.map((member: any) => member?.employee?.name).filter(Boolean) || [],
          file: null,
          _id: project._id,
          rawBudget: project.budget,
          allocation: project.team?.reduce((acc: number, member: any) => acc + (member?.allocation || 0), 0) || 0
        }));
        
        setProjects(transformedProjects);
        console.log('✅ Projects data loaded successfully', transformedProjects);
      } catch (error: any) {
        console.error('❌ Error loading projects data:', error);
        if (error.message.includes('Authentication required') || error.message.includes('Session expired')) {
          setProjectsError('Please login to access projects');
        } else {
          setProjectsError('Failed to load projects data');
        }
      } finally {
        setProjectsLoading(false);
      }
    }
  };

  // Fetch projects when activeModule changes to projects
  useEffect(() => {
    if (activeModule === 'projects') {
      fetchProjectsData();
    }
  }, [activeModule, userRole]);

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
    { id: 'overview', label: 'Overview', description: 'Dashboard home' },
    { id: 'employees', label: 'Employees', description: 'Manage workforce' },
    { id: 'projects', label: 'Projects', description: 'Company projects' },
    { id: 'documents', label: 'Documents', description: 'File management' },
    { id: 'analytics', label: 'Analytics', description: 'View insights' },
    { id: 'recruitment', label: 'Recruitment', description: 'Hire talent' },
    { id: 'settings', label: 'Settings', description: 'System config' }
  ];

  const quickStats = [
    {
      title: 'Total Employees',
      value: (dashboardStats.employeeCount || 0).toString(),
      change: `+${employees.length > 0 ? Math.round((employees.length / 10) * 100) / 10 : 0}%`,
      color: 'primary'
    },
    {
      title: 'Total Projects',
      value: (dashboardStats.totalProjects || 0).toString(),
      change: '+8.2%',
      color: 'accent'
    },
    {
      title: 'Total Budget',
      value: `$${((dashboardStats.totalBudget || 0) / 1000).toFixed(1)}K`,
      change: '+15%',
      color: 'warning'
    },
    {
      title: 'Total Profits',
      value: `$${((dashboardStats.totalProfits || 0) / 1000).toFixed(1)}K`,
      change: `+${dashboardStats.totalProfits && dashboardStats.totalBudget ? Math.round((dashboardStats.totalProfits / dashboardStats.totalBudget) * 100) : 0}%`,
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

  // Settings/help handlers
  const handleSettings = () => {
    setActiveModule('settings');
  };
  const handleHelp = () => {
    alert('Help & Support coming soon!');
  };

  // Project management handlers
  const handleCreateProject = async (projectData: { name: string; budget: string; allocations?: Record<string, number> }) => {
    try {
      setProjectsLoading(true);
      
      // Convert budget string to number (remove $ and K, convert to actual value)
      const budgetValue = parseFloat(projectData.budget.replace(/[$,K]/g, '')) * (projectData.budget.includes('K') ? 1000 : 1);
      
      const newProjectData = {
        name: projectData.name,
        budget: budgetValue,
        allocations: projectData.allocations || {}
      };
      
      await dashboardService.createProject(newProjectData);
      await fetchProjectsData(); // Refresh projects list
      setShowProjectModal(false);
      setNewProject({ name: '', owner: '', team: '', file: null, budget: '' });
      
      console.log('✅ Project created successfully');
    } catch (error) {
      console.error('❌ Error creating project:', error);
      alert('Failed to create project. Please try again.');
    } finally {
      setProjectsLoading(false);
    }
  };

  const handleUpdateProject = async (projectId: string, updateData: { budget?: number; allocations?: Record<string, number> }) => {
    try {
      setProjectsLoading(true);
      
      await dashboardService.updateProject(projectId, updateData);
      await fetchProjectsData(); // Refresh projects list
      
      console.log('✅ Project updated successfully');
    } catch (error) {
      console.error('❌ Error updating project:', error);
      alert('Failed to update project. Please try again.');
    } finally {
      setProjectsLoading(false);
    }
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
                <span className="h-5 w-5 group-hover:animate-bounce-in">◀</span>
              ) : sidebarMode === 'mini' ? (
                <span className="h-5 w-5 group-hover:animate-bounce-in">▶</span>
              ) : (
                <span className="h-5 w-5 group-hover:animate-bounce-in">☰</span>
              )}
            </Button>
            
            <div className="flex items-center gap-3 animate-fade-in-left">
              <div className="p-2 rounded-xl bg-primary-gradient shadow-lg hover-glow">
                {/* Logo here */}
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
              <input
                type="text"
                placeholder="Search employees, projects..."
                className="pl-10 pr-4 py-2 w-64 neu-inset rounded-xl border-0 bg-muted/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-300"
              />
            </div>

            {/* Enhanced Notifications */}
            <div className="relative">
              <Button variant={"outline" as ButtonProps["variant"]} size={"icon" as ButtonProps["size"]} className="hover-scale" onClick={() => setShowNotifications(!showNotifications)}>
                <span className="h-5 w-5">🔔</span>
                {notifications.filter(n => !n.read).length > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs bg-destructive">
                    {notifications.filter(n => !n.read).length}
                  </Badge>
                )}
              </Button>
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-900 border border-border rounded-xl shadow-lg z-50">
                  <div className="p-3 font-semibold border-b border-border">Notifications</div>
                  <ul className="max-h-60 overflow-y-auto">
                    {notifications.map(n => (
                      <li key={n.id} className={`p-3 text-sm ${n.read ? 'text-muted-foreground' : 'font-bold'}`}>{n.message}</li>
                    ))}
                  </ul>
                  <div className="p-2 text-center">
                    <Button size="sm" variant="ghost" onClick={() => setShowNotifications(false)}>Close</Button>
                  </div>
                </div>
              )}
            </div>

            {/* Theme Toggle */}
            <Button variant="ghost" size="icon-sm" onClick={toggleTheme} className="hover-rotate">
              {darkMode ? <span className="h-5 w-5">☀️</span> : <span className="h-5 w-5">🌙</span>}
            </Button>

            {/* Debug Auth Status Button (only in development) */}
            {process.env.NODE_ENV === 'development' && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="hover-scale" 
                onClick={() => logAuthStatus()}
                title="Check Authentication Status"
              >
                🔍 Auth
              </Button>
            )}

            {/* Settings */}
            <Button variant="ghost" size="icon-sm" className="hover-scale" onClick={handleSettings}>
              <span className="h-5 w-5">⚙️</span>
            </Button>
            {/* Help */}
            <Button variant="ghost" size="icon-sm" className="hover-scale" onClick={handleHelp}>
              <span className="h-5 w-5">❓</span>
            </Button>

            {/* Compact Daily Timeline */}
            <div 
              className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border border-blue-200/30 dark:border-blue-800/30 hover-lift shadow-sm cursor-pointer transition-all duration-300 hover:shadow-md hover:scale-105"
              onClick={() => setShowTimeModal(true)}
            >
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
              <div className="absolute bottom-0 left-0 bg-white/30 transition-all duration-1000" style={{ height: `${workDayProgress}%`, width: '100%' }}></div>
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
                <span className="h-3 w-3 inline-block">◀</span>
              ) : (
                <span className="h-3 w-3 inline-block">{'>'}{'>'}</span>
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
                  
                  {/* No icon, just label */}
                  {(sidebarMode === 'full' || (sidebarMode === 'mini' && sidebarHovered)) && (
                    <div className="flex-1 text-left animate-fade-in-right">
                      <span className="font-medium block">{module.label}</span>
                      <p className="text-xs text-muted-foreground truncate">{module.description}</p>
                    </div>
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
                {/* Settings icon removed */}
                {(sidebarMode === 'full' || (sidebarMode === 'mini' && sidebarHovered)) && (
                  <span className="ml-2 animate-fade-in">Settings</span>
                )}
              </Button>
              
              {(sidebarMode === 'full' || (sidebarMode === 'mini' && sidebarHovered)) && (
                <Button 
                  size="sm"
                  className="group/action hover-lift hover:shadow-lg hover:scale-105 transition-all duration-300"
                >
                  {/* Help icon removed */}
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
                <Button variant="outline" size="sm" className="ml-2" onClick={() => alert('Logged out!')}>Logout</Button>
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
              {/* Dashboard Loading State */}
              {dashboardLoading && (
                <div className="flex items-center justify-center p-8 bg-card rounded-2xl shadow-xl animate-pulse">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-lg font-medium">Loading dashboard data...</span>
                  </div>
                </div>
              )}

              {/* Dashboard Error State */}
              {dashboardError && (
                <div className="flex items-center justify-center p-8 bg-destructive/10 border border-destructive/20 rounded-2xl">
                  <div className="text-center">
                    <div className="text-destructive font-semibold mb-2">⚠️ Error Loading Dashboard</div>
                    <div className="text-sm text-muted-foreground">{dashboardError}</div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-4"
                      onClick={async () => {
                        // Check authentication first
                        const token = localStorage.getItem('token');
                        if (!token) {
                          setDashboardError('Please login to access dashboard');
                          return;
                        }

                        setDashboardLoading(true);
                        setDashboardError(null);
                        try {
                          const stats = await dashboardService.getDashboardStats();
                          setDashboardStats(stats);
                          const employeesData = await dashboardService.getAllEmployees();
                          setEmployees(employeesData.employees);
                          const profitsData = await dashboardService.getTotalProfits();
                          setProjectDetails(profitsData.projectDetails);
                        } catch (error: any) {
                          if (error.message.includes('Authentication required') || error.message.includes('Session expired')) {
                            setDashboardError('Please login to access dashboard');
                          } else {
                            setDashboardError('Failed to load dashboard data');
                          }
                        } finally {
                          setDashboardLoading(false);
                        }
                      }}
                    >
                      Retry
                    </Button>
                  </div>
                </div>
              )}

              {/* Dashboard Content - Only show when not loading and no error */}
              {!dashboardLoading && !dashboardError && (
                <>
                  {/* Enhanced Welcome Section */}
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 animate-fade-in-up">
                    <div className="space-y-2">
                      <h2 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent animate-gradient">
                        {(() => {
                          const hour = currentTime.getHours();
                          let greeting = 'Good morning';
                          let emoji = '🌅';
                          
                          if (hour >= 5 && hour < 12) {
                            greeting = 'Good morning';
                            emoji = '🌅';
                          } else if (hour >= 12 && hour < 17) {
                            greeting = 'Good afternoon';
                            emoji = '☀️';
                          } else if (hour >= 17 && hour < 21) {
                            greeting = 'Good evening';
                            emoji = '🌆';
                          } else {
                            greeting = 'Good night';
                            emoji = '🌙';
                          }
                          
                          return `${greeting}, ${user?.name || 'John'}! ${emoji}`;
                        })()}
                      </h2>
                      {/* <p className="text-lg text-muted-foreground animate-fade-in-up" style={{animationDelay: '200ms'}}>
                        {(() => {
                          const hour = currentTime.getHours();
                          if (hour >= 5 && hour < 12) {
                            return "Ready to start a productive day at your company!";
                          } else if (hour >= 12 && hour < 17) {
                            return "Here's what's happening at your company this afternoon.";
                          } else if (hour >= 17 && hour < 21) {
                            return "Wrapping up the day - here's your company overview.";
                          } else {
                            return "Working late? Here's your company status.";
                          }
                        })()}
                      </p> */}
                      {/* {(dashboardStats.employeeCount || 0) > 0 && (
                        <p className="text-sm text-muted-foreground animate-fade-in-up" style={{animationDelay: '300ms'}}>
                          Managing {dashboardStats.employeeCount} employees across {dashboardStats.totalProjects || 0} projects with ${((dashboardStats.totalBudget || 0) / 1000).toFixed(1)}K total budget
                        </p>
                      )} */}
                    </div>
                    <div className="flex gap-3 animate-fade-in-right">
                        <Button 
                        className="hover-lift group"
                        onClick={() => handleModuleChange('meetings')}
                        disabled={isLoading}
                        >
                        {(() => {
                          const hour = currentTime.getHours();
                          if (hour >= 5 && hour < 12) {
                            return "Start Meeting";
                          } else if (hour >= 12 && hour < 17) {
                            return "Schedule Meeting";
                          } else {
                            return "Plan Meeting";
                          }
                        })()}
                        </Button>
                        <Button 
                        className="hover-glow group"
                        onClick={() => handleModuleChange('employees')}
                        disabled={isLoading}
                        >
                        {(() => {
                          const hour = currentTime.getHours();
                          if (hour >= 5 && hour < 12) {
                            return "Add Employee";
                          } else if (hour >= 12 && hour < 17) {
                            return "Manage Team";
                          } else {
                            return "View Employees";
                          }
                        })()}
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
                          else if (stat.title.includes('Projects')) handleModuleChange('projects');
                          else if (stat.title.includes('Budget')) handleModuleChange('analytics');
                          else if (stat.title.includes('Profits')) handleModuleChange('analytics');
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
                              <span className={`text-sm font-medium ${stat.change.startsWith('+') ? 'text-accent' : 'text-destructive'}`}>{stat.change}</span>
                            </div>
                            <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.color === 'primary' ? 'from-primary/10 to-primary/20' : ''}${stat.color === 'accent' ? 'from-accent/10 to-accent/20' : ''}${stat.color === 'warning' ? 'from-warning/10 to-warning/20' : ''}${stat.color === 'destructive' ? 'from-destructive/10 to-destructive/20' : ''} group-hover:scale-110 group-hover:animate-glow transition-all duration-300`}>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>

                  {/* Real-time Project Summary */}
                  {projectDetails.length > 0 && (
                    <Card className="neu-surface p-6 animate-fade-in-up" style={{animationDelay: '500ms'}}>
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-semibold animate-fade-in-left">Project Overview</h3>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="hover-lift"
                          onClick={() => handleModuleChange('projects')}
                          disabled={isLoading}
                        >
                          View All Projects
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {projectDetails.slice(0, 6).map((project, index) => (
                          <div 
                            key={project.projectId} 
                            className={`
                              p-4 rounded-xl bg-muted/30 hover:bg-muted/50 
                              transition-all duration-300 cursor-pointer
                              hover-lift group stagger-item border border-border/20
                            `} 
                            style={{animationDelay: `${600 + index * 100}ms`}}
                          >
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <h4 className="font-semibold text-sm group-hover:text-primary transition-colors">
                                  {project.projectName}
                                </h4>
                                <Badge variant={project.profit > 0 ? 'default' : 'destructive'} className="text-xs">
                                  ${(project.profit / 1000).toFixed(1)}K
                                </Badge>
                              </div>
                              <div className="text-xs text-muted-foreground space-y-1">
                                <div>Budget: ${(project.budget / 1000).toFixed(1)}K</div>
                                <div>Team: {project.team.length} members</div>
                                <div className="flex items-center gap-1">
                                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                  <span>Profit Margin: {((project.profit / project.budget) * 100).toFixed(1)}%</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </Card>
                  )}

                  {/* Client Information Section */}
                  <div className="mt-8">
                    <ClientInformation />
                  </div>

                  {/* Enhanced Recent Activities with Real Employee Data */}
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
                      {employees.slice(0, 4).map((employee, index) => (
                        <div 
                          key={employee._id} 
                          className={`
                            flex items-start gap-4 p-4 rounded-xl 
                            bg-muted/30 hover:bg-muted/50 
                            transition-all duration-300 cursor-pointer
                            hover-lift group stagger-item
                          `} 
                          style={{animationDelay: `${700 + index * 100}ms`}}
                          onClick={() => handleModuleChange('employees')}
                        >
                          <div className="h-2 w-2 rounded-full bg-primary mt-2 group-hover:scale-125 transition-transform"></div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <Badge className="text-xs group-hover:scale-105 transition-transform">
                                Employee
                              </Badge>
                              <span className="text-sm text-muted-foreground">
                                {new Date(employee.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-sm mt-1 group-hover:text-primary transition-colors">
                              {employee.name} ({employee.email}) joined as {employee.role}
                            </p>
                          </div>
                        </div>
                      ))}
                      
                      {employees.length === 0 && (
                        <div className="text-center py-8 text-muted-foreground">
                          <div className="text-sm">No recent activities</div>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="mt-2"
                            onClick={() => handleModuleChange('employees')}
                          >
                            Add First Employee
                          </Button>
                        </div>
                      )}
                    </div>
                  </Card>
                </>
              )}
            </div>
          )}
          
          {/* Module Components with animations */}
          {activeModule === 'employees' && employeeAccessRoles.includes(userRole) && (
            <div className="animate-fade-in">
              <EmployeeManagement />
            </div>
          )}
          {activeModule === 'employees' && !employeeAccessRoles.includes(userRole) && (
            <div className="p-8 text-center text-destructive font-semibold">You do not have access to view Employees.</div>
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
            <div className="animate-fade-in space-y-6 p-8 bg-card rounded-2xl shadow-xl">
              <h2 className="text-2xl font-bold mb-4">Settings</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Access Control</h3>
                  <p className="text-sm text-muted-foreground mb-2">Select which roles can access the Employees section:</p>
                  <div className="flex gap-4">
                    {['admin', 'hr', 'manager', 'employee', 'intern'].map(role => (
                      <label key={role} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={employeeAccessRoles.includes(role)}
                          onChange={e => {
                            if (e.target.checked) {
                              setEmployeeAccessRoles([...employeeAccessRoles, role]);
                            } else {
                              setEmployeeAccessRoles(employeeAccessRoles.filter(r => r !== role));
                            }
                          }}
                        />
                        <span className="capitalize">{role}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">General Settings</h3>
                  <p className="text-sm text-muted-foreground">Other settings can be added here.</p>
                </div>
              </div>
              <Button variant="destructive" className="mt-4 w-full" onClick={() => alert('Logged out!')}>Logout</Button>
            </div>
          )}
          {activeModule === 'projects' && (
            <ProjectManagement />
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
            onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}
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
