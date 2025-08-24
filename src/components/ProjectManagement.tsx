import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Search, Filter, AlertCircle, Target, DollarSign, TrendingUp, BarChart3, Users } from 'lucide-react';
import { apiService, type Project, type ProjectCreateData, type Employee, type ProjectAnalytics, type ProfitsSummary } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import ProjectForm from './ProjectForm';
import ProjectCard from './ProjectCard';
import ProjectsList from './ProjectsList';
import ProjectAnalyticsDashboard from './ProjectAnalyticsDashboard';
import ProjectDetailsDialog from './ProjectDetailsDialog';

interface ProjectManagementProps {
  onClose?: () => void;
}

const ProjectManagement: React.FC<ProjectManagementProps> = ({ onClose }) => {
  const { toast } = useToast();
  
  // State management
  const [projects, setProjects] = useState<Project[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Current view states
  const [activeView, setActiveView] = useState<'list' | 'grid' | 'kanban' | 'analytics'>('grid');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showProjectDialog, setShowProjectDialog] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  
  // Analytics states
  const [profitsSummary, setProfitsSummary] = useState<ProfitsSummary | null>(null);
  const [projectAnalytics, setProjectAnalytics] = useState<ProjectAnalytics[]>([]);
  
  // Form states
  const [formData, setFormData] = useState<Partial<ProjectCreateData>>({
    name: '',
    project_value: 0,
    description: '',
    status: 'planning',
    priority: 'medium',
    payment_type: 'milestone',
    payment_terms: '',
    startDate: '',
    endDate: '',
    client: {
      name: '',
      email: '',
      company: '',
      phone: ''
    },
    team: [],
    expenses: []
  });
  
  // Filter and search states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');

  // Fetch data on component mount
  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch projects and employees in parallel
      const [projectsResponse, employeesResponse] = await Promise.all([
        apiService.getProjects(),
        apiService.getAllEmployees()
      ]);
      
      setProjects(projectsResponse.projects);
      setEmployees(employeesResponse);
      
      // Fetch analytics data with the fetched projects
      await fetchAnalyticsData(projectsResponse.projects);
      
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
      toast({
        title: "Error",
        description: "Failed to load project data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalyticsData = async (projectsList?: Project[]) => {
    try {
      const profitsData = await apiService.getTotalProfits();
      setProfitsSummary(profitsData.summary);
      
      // Use provided projects list or current state
      const projectsToAnalyze = projectsList || projects;
      
      if (projectsToAnalyze.length > 0) {
        // Fetch analytics for each project
        const analyticsPromises = projectsToAnalyze.map(project => 
          apiService.getProjectAnalytics(project._id)
        );
        const analyticsData = await Promise.all(analyticsPromises);
        setProjectAnalytics(analyticsData);
      }
    } catch (err) {
      console.error('Error fetching analytics:', err);
    }
  };

  const handleCreateProject = async () => {
    try {
      if (!formData.name || !formData.project_value || !formData.endDate) {
        toast({
          title: "Validation Error",
          description: "Please fill in all required fields",
          variant: "destructive",
        });
        return;
      }

      const projectData: ProjectCreateData = {
        ...formData as ProjectCreateData,
        startDate: formData.startDate || new Date().toISOString(),
      };

      const newProject = await apiService.createProject(projectData);
      setProjects(prev => [...prev, newProject]);
      setShowProjectDialog(false);
      resetForm();
      
      toast({
        title: "Success",
        description: "Project created successfully",
      });
      
      await fetchAnalyticsData();
    } catch (err) {
      console.error('Error creating project:', err);
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to create project",
        variant: "destructive",
      });
    }
  };

  const handleUpdateProject = async () => {
    try {
      if (!editingProject) return;

      const updateData = { ...formData };
      const updatedProject = await apiService.updateProject(editingProject._id, updateData);
      
      setProjects(prev => prev.map(p => p._id === updatedProject._id ? updatedProject : p));
      setEditingProject(null);
      setShowProjectDialog(false);
      resetForm();
      
      toast({
        title: "Success",
        description: "Project updated successfully",
      });
      
      await fetchAnalyticsData();
    } catch (err) {
      console.error('Error updating project:', err);
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to update project",
        variant: "destructive",
      });
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    try {
      await apiService.deleteProject(projectId);
      setProjects(prev => prev.filter(p => p._id !== projectId));
      
      toast({
        title: "Success",
        description: "Project deleted successfully",
      });
      
      await fetchAnalyticsData();
    } catch (err) {
      console.error('Error deleting project:', err);
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to delete project",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      project_value: 0,
      description: '',
      status: 'planning',
      priority: 'medium',
      payment_type: 'milestone',
      payment_terms: '',
      startDate: '',
      endDate: '',
      client: {
        name: '',
        email: '',
        company: '',
        phone: ''
      },
      team: [],
      expenses: []
    });
  };

  const openEditDialog = (project: Project) => {
    setEditingProject(project);
    setFormData({
      name: project.name,
      project_value: project.project_value,
      description: project.description,
      status: project.status,
      priority: project.priority,
      payment_type: project.payment_type,
      payment_terms: project.payment_terms,
      startDate: project.startDate,
      endDate: project.endDate,
      client: project.client,
    });
    setShowProjectDialog(true);
  };

  // Filter projects based on search and filters
  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.client?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || project.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'active': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'planning': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'on-hold': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-96">
          <div className="text-center">
            <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
            <h3 className="text-lg font-semibold text-red-900 mb-2">Error Loading Projects</h3>
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={fetchInitialData} variant="outline">
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Project Management</h2>
          <p className="text-gray-600 dark:text-gray-300">Manage your projects, teams, and track progress</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Dialog open={showProjectDialog} onOpenChange={setShowProjectDialog}>
            <DialogTrigger asChild>
              <Button onClick={() => { resetForm(); setEditingProject(null); }}>
                <Plus className="w-4 h-4 mr-2" />
                New Project
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingProject ? 'Edit Project' : 'Create New Project'}
                </DialogTitle>
                <DialogDescription>
                  {editingProject ? 'Update project details and settings' : 'Fill in the details to create a new project'}
                </DialogDescription>
              </DialogHeader>
              
              <ProjectForm
                formData={formData}
                setFormData={setFormData}
                employees={employees}
                onSubmit={editingProject ? handleUpdateProject : handleCreateProject}
                onCancel={() => {
                  setShowProjectDialog(false);
                  setEditingProject(null);
                  resetForm();
                }}
                isEditing={!!editingProject}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Analytics Summary */}
      {profitsSummary && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <Target className="h-8 w-8 text-blue-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-600">Total Projects</p>
                  <p className="text-2xl font-bold">{profitsSummary?.totalProjects || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <DollarSign className="h-8 w-8 text-green-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-600">Total Budget</p>
                  <p className="text-2xl font-bold">${(profitsSummary?.totalBudget || 0).toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-purple-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-600">Total Profit</p>
                  <p className="text-2xl font-bold">${(profitsSummary?.totalProfit || 0).toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <BarChart3 className="h-8 w-8 text-orange-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-600">Profit Margin</p>
                  <p className="text-2xl font-bold">{profitsSummary?.profitMargin || '0%'}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-indigo-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-600">Allocations</p>
                  <p className="text-2xl font-bold">${(profitsSummary?.totalAllocations || 0).toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="planning">Planning</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="on-hold">On Hold</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
              </SelectContent>
            </Select>
            
            <div className="flex items-center gap-2">
              <Button
                variant={activeView === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveView('grid')}
              >
                Grid
              </Button>
              <Button
                variant={activeView === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveView('list')}
              >
                List
              </Button>
              <Button
                variant={activeView === 'analytics' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveView('analytics')}
              >
                Analytics
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Projects Display */}
      {activeView === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project._id}
              project={project}
              onEdit={() => openEditDialog(project)}
              onDelete={() => handleDeleteProject(project._id)}
              onView={() => setSelectedProject(project)}
              getStatusColor={getStatusColor}
              getPriorityColor={getPriorityColor}
            />
          ))}
        </div>
      )}

      {activeView === 'list' && (
        <ProjectsList
          projects={filteredProjects}
          onEdit={openEditDialog}
          onDelete={handleDeleteProject}
          onView={(project) => setSelectedProject(project)}
          getStatusColor={getStatusColor}
          getPriorityColor={getPriorityColor}
        />
      )}

      {activeView === 'analytics' && (
        <ProjectAnalyticsDashboard
          projects={projects}
          analytics={projectAnalytics}
          summary={profitsSummary}
        />
      )}

      {/* Project Details Dialog */}
      {selectedProject && (
        <ProjectDetailsDialog
          project={selectedProject}
          open={!!selectedProject}
          onClose={() => setSelectedProject(null)}
          employees={employees}
          onUpdate={fetchInitialData}
        />
      )}
    </div>
  );
};

export default ProjectManagement;
