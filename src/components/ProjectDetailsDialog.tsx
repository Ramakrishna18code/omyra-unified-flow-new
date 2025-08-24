import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { 
  CalendarIcon, 
  Plus, 
  X, 
  Users, 
  DollarSign, 
  TrendingUp, 
  Clock, 
  Target, 
  Edit,
  CheckCircle,
  AlertCircle,
  Mail,
  Phone,
  Building
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { type Project, type Employee } from '@/services/api';
import { apiService } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

interface ProjectDetailsDialogProps {
  project: Project;
  open: boolean;
  onClose: () => void;
  employees: Employee[];
  onUpdate: () => void;
}

const ProjectDetailsDialog: React.FC<ProjectDetailsDialogProps> = ({
  project,
  open,
  onClose,
  employees,
  onUpdate
}) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  
  // Team management
  const [showAddMember, setShowAddMember] = useState(false);
  const [newMember, setNewMember] = useState({
    employeeId: '',
    role: 'developer',
    allocation: 0
  });
  
  // Milestone management
  const [showAddMilestone, setShowAddMilestone] = useState(false);
  const [newMilestone, setNewMilestone] = useState({
    title: '',
    description: '',
    dueDate: ''
  });
  const [milestoneDate, setMilestoneDate] = useState<Date | undefined>();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'PPP');
  };

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

  const getMilestoneStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'in-progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'overdue': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleAddTeamMember = async () => {
    try {
      if (!newMember.employeeId || !newMember.allocation) {
        toast({
          title: "Validation Error",
          description: "Please select an employee and enter allocation amount",
          variant: "destructive",
        });
        return;
      }

      await apiService.addTeamMember(project._id, newMember);
      
      toast({
        title: "Success",
        description: "Team member added successfully",
      });
      
      setShowAddMember(false);
      setNewMember({ employeeId: '', role: 'developer', allocation: 0 });
      onUpdate();
    } catch (err) {
      console.error('Error adding team member:', err);
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to add team member",
        variant: "destructive",
      });
    }
  };

  const handleRemoveTeamMember = async (employeeId: string) => {
    try {
      await apiService.removeTeamMember(project._id, employeeId);
      
      toast({
        title: "Success",
        description: "Team member removed successfully",
      });
      
      onUpdate();
    } catch (err) {
      console.error('Error removing team member:', err);
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to remove team member",
        variant: "destructive",
      });
    }
  };

  const handleAddMilestone = async () => {
    try {
      if (!newMilestone.title || !newMilestone.dueDate) {
        toast({
          title: "Validation Error",
          description: "Please enter milestone title and due date",
          variant: "destructive",
        });
        return;
      }

      await apiService.addMilestone(project._id, newMilestone);
      
      toast({
        title: "Success",
        description: "Milestone added successfully",
      });
      
      setShowAddMilestone(false);
      setNewMilestone({ title: '', description: '', dueDate: '' });
      setMilestoneDate(undefined);
      onUpdate();
    } catch (err) {
      console.error('Error adding milestone:', err);
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to add milestone",
        variant: "destructive",
      });
    }
  };

  const handleUpdateMilestoneStatus = async (milestoneId: string, status: string) => {
    try {
      const updateData = {
        milestoneId,
        status,
        ...(status === 'completed' && { completedDate: new Date().toISOString() })
      };

      await apiService.updateMilestone(project._id, updateData);
      
      toast({
        title: "Success",
        description: "Milestone status updated successfully",
      });
      
      onUpdate();
    } catch (err) {
      console.error('Error updating milestone:', err);
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to update milestone",
        variant: "destructive",
      });
    }
  };

  const totalAllocations = project.team.reduce((sum, member) => 
    sum + (member.allocation?.[0]?.amount || 0), 0
  );

  const totalExpenses = project.expenses.reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{project.name}</DialogTitle>
          <DialogDescription>
            Detailed project information and management
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="team">Team</TabsTrigger>
            <TabsTrigger value="milestones">Milestones</TabsTrigger>
            <TabsTrigger value="finances">Finances</TabsTrigger>
            <TabsTrigger value="client">Client</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <DollarSign className="h-8 w-8 text-green-600" />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-600">Budget</p>
                      <p className="text-2xl font-bold">{formatCurrency(project.project_value)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <TrendingUp className="h-8 w-8 text-blue-600" />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-600">Profit</p>
                      <p className="text-2xl font-bold text-green-600">{formatCurrency(project.profit)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <Target className="h-8 w-8 text-purple-600" />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-600">Progress</p>
                      <p className="text-2xl font-bold">{project.progress}%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <Users className="h-8 w-8 text-orange-600" />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-600">Team Size</p>
                      <p className="text-2xl font-bold">{project.team.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Project Details */}
            <Card>
              <CardHeader>
                <CardTitle>Project Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Description</Label>
                    <p className="mt-1">{project.description}</p>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div>
                        <Label className="text-sm font-medium text-gray-600">Status</Label>
                        <Badge className={getStatusColor(project.status)}>
                          {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                        </Badge>
                      </div>
                      
                      <div>
                        <Label className="text-sm font-medium text-gray-600">Priority</Label>
                        <Badge className={getPriorityColor(project.priority)}>
                          {project.priority.charAt(0).toUpperCase() + project.priority.slice(1)}
                        </Badge>
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm font-medium text-gray-600">Payment Terms</Label>
                      <p className="mt-1">{project.payment_terms}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Start Date</Label>
                    <p className="mt-1 flex items-center gap-2">
                      <CalendarIcon className="w-4 h-4" />
                      {formatDate(project.startDate)}
                    </p>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium text-gray-600">End Date</Label>
                    <p className={cn(
                      "mt-1 flex items-center gap-2",
                      project.isOverdue && "text-red-600"
                    )}>
                      <CalendarIcon className="w-4 h-4" />
                      {formatDate(project.endDate)}
                      {project.isOverdue && <AlertCircle className="w-4 h-4" />}
                    </p>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-600">Overall Progress</Label>
                  <div className="mt-2">
                    <Progress value={project.progress} className="h-3" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Team Tab */}
          <TabsContent value="team" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Team Members ({project.team.length})</CardTitle>
                <Button onClick={() => setShowAddMember(!showAddMember)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Member
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Add Team Member Form */}
                {showAddMember && (
                  <Card>
                    <CardContent className="p-4">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                        <div>
                          <Label>Employee</Label>
                          <Select 
                            value={newMember.employeeId} 
                            onValueChange={(value) => setNewMember(prev => ({ ...prev, employeeId: value }))}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select employee" />
                            </SelectTrigger>
                            <SelectContent>
                              {employees
                                .filter(emp => !project.team.some(member => member.employee._id === emp._id))
                                .map((emp) => (
                                <SelectItem key={emp._id} value={emp._id}>
                                  {emp.name} - {emp.department}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label>Role</Label>
                          <Select 
                            value={newMember.role} 
                            onValueChange={(value) => setNewMember(prev => ({ ...prev, role: value }))}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="project-manager">Project Manager</SelectItem>
                              <SelectItem value="developer">Developer</SelectItem>
                              <SelectItem value="designer">Designer</SelectItem>
                              <SelectItem value="tester">Tester</SelectItem>
                              <SelectItem value="analyst">Analyst</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label>Allocation</Label>
                          <Input
                            type="number"
                            value={newMember.allocation}
                            onChange={(e) => setNewMember(prev => ({ ...prev, allocation: parseFloat(e.target.value) || 0 }))}
                            placeholder="Enter allocation"
                          />
                        </div>

                        <div className="flex gap-2">
                          <Button onClick={handleAddTeamMember}>Add</Button>
                          <Button variant="outline" onClick={() => setShowAddMember(false)}>Cancel</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Team Members List */}
                <div className="space-y-4">
                  {project.team.map((member) => (
                    <Card key={member._id}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                              <Users className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                              <h4 className="font-semibold">{member.employee.name}</h4>
                              <p className="text-sm text-gray-600">{member.employee.email}</p>
                              <p className="text-sm text-gray-500">{member.employee.department}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-4">
                            <div className="text-center">
                              <p className="text-sm font-medium">Role</p>
                              <Badge variant="outline">
                                {member.role.split('-').map(word => 
                                  word.charAt(0).toUpperCase() + word.slice(1)
                                ).join(' ')}
                              </Badge>
                            </div>
                            
                            <div className="text-center">
                              <p className="text-sm font-medium">Allocation</p>
                              <p className="font-semibold">
                                {formatCurrency(member.allocation?.[0]?.amount || 0)}
                              </p>
                            </div>
                            
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleRemoveTeamMember(member.employee._id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {project.team.length === 0 && (
                  <div className="text-center text-gray-500 py-8">
                    No team members assigned yet. Add members to start building your team.
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Milestones Tab */}
          <TabsContent value="milestones" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Project Milestones ({project.milestones.length})</CardTitle>
                <Button onClick={() => setShowAddMilestone(!showAddMilestone)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Milestone
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Add Milestone Form */}
                {showAddMilestone && (
                  <Card>
                    <CardContent className="p-4 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label>Title</Label>
                          <Input
                            value={newMilestone.title}
                            onChange={(e) => setNewMilestone(prev => ({ ...prev, title: e.target.value }))}
                            placeholder="Enter milestone title"
                          />
                        </div>
                        
                        <div>
                          <Label>Due Date</Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full justify-start text-left font-normal",
                                  !milestoneDate && "text-muted-foreground"
                                )}
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {milestoneDate ? format(milestoneDate, "PPP") : <span>Pick a date</span>}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <Calendar
                                mode="single"
                                selected={milestoneDate}
                                onSelect={(date) => {
                                  setMilestoneDate(date);
                                  setNewMilestone(prev => ({ 
                                    ...prev, 
                                    dueDate: date?.toISOString() || '' 
                                  }));
                                }}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                      </div>
                      
                      <div>
                        <Label>Description</Label>
                        <Textarea
                          value={newMilestone.description}
                          onChange={(e) => setNewMilestone(prev => ({ ...prev, description: e.target.value }))}
                          placeholder="Enter milestone description"
                          rows={3}
                        />
                      </div>
                      
                      <div className="flex gap-2">
                        <Button onClick={handleAddMilestone}>Add Milestone</Button>
                        <Button variant="outline" onClick={() => setShowAddMilestone(false)}>Cancel</Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Milestones List */}
                <div className="space-y-4">
                  {project.milestones.map((milestone) => (
                    <Card key={milestone._id}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-semibold">{milestone.title}</h4>
                              <Badge className={getMilestoneStatusColor(milestone.status)}>
                                {milestone.status.charAt(0).toUpperCase() + milestone.status.slice(1)}
                              </Badge>
                            </div>
                            
                            {milestone.description && (
                              <p className="text-sm text-gray-600 mb-2">{milestone.description}</p>
                            )}
                            
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                <span>Due: {formatDate(milestone.dueDate)}</span>
                              </div>
                              
                              {milestone.completedDate && (
                                <div className="flex items-center gap-1">
                                  <CheckCircle className="w-4 h-4 text-green-600" />
                                  <span>Completed: {formatDate(milestone.completedDate)}</span>
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Select
                              value={milestone.status}
                              onValueChange={(value) => handleUpdateMilestoneStatus(milestone._id, value)}
                            >
                              <SelectTrigger className="w-32">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="in-progress">In Progress</SelectItem>
                                <SelectItem value="completed">Completed</SelectItem>
                                <SelectItem value="overdue">Overdue</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {project.milestones.length === 0 && (
                  <div className="text-center text-gray-500 py-8">
                    No milestones added yet. Add milestones to track project progress.
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Finances Tab */}
          <TabsContent value="finances" className="space-y-6">
            {/* Financial Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <DollarSign className="h-8 w-8 text-blue-600" />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-600">Total Budget</p>
                      <p className="text-2xl font-bold">{formatCurrency(project.project_value)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <Users className="h-8 w-8 text-orange-600" />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-600">Team Allocations</p>
                      <p className="text-2xl font-bold">{formatCurrency(totalAllocations)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <TrendingUp className="h-8 w-8 text-green-600" />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-600">Estimated Profit</p>
                      <p className="text-2xl font-bold text-green-600">{formatCurrency(project.profit)}</p>
                      <p className="text-xs text-gray-500">
                        {((project.profit / project.project_value) * 100).toFixed(1)}% margin
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Expenses */}
            <Card>
              <CardHeader>
                <CardTitle>Project Expenses ({project.expenses.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {project.expenses.length > 0 ? (
                  <div className="space-y-4">
                    {project.expenses.map((expense) => (
                      <div key={expense._id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h4 className="font-medium">{expense.description}</h4>
                          <p className="text-sm text-gray-600 capitalize">{expense.category}</p>
                          <p className="text-sm text-gray-500">{formatDate(expense.date)}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{formatCurrency(expense.amount)}</p>
                        </div>
                      </div>
                    ))}
                    
                    <div className="border-t pt-4">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold">Total Expenses:</span>
                        <span className="text-lg font-bold">{formatCurrency(totalExpenses)}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    No expenses recorded for this project yet.
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Client Tab */}
          <TabsContent value="client" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Client Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {project.client.name ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label className="text-sm font-medium text-gray-600">Client Name</Label>
                        <p className="text-lg font-semibold">{project.client.name}</p>
                      </div>
                      
                      {project.client.company && (
                        <div>
                          <Label className="text-sm font-medium text-gray-600">Company</Label>
                          <div className="flex items-center gap-2">
                            <Building className="w-4 h-4 text-gray-500" />
                            <p className="font-medium">{project.client.company}</p>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {project.client.email && (
                        <div>
                          <Label className="text-sm font-medium text-gray-600">Email</Label>
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-gray-500" />
                            <a 
                              href={`mailto:${project.client.email}`} 
                              className="text-blue-600 hover:underline"
                            >
                              {project.client.email}
                            </a>
                          </div>
                        </div>
                      )}
                      
                      {project.client.phone && (
                        <div>
                          <Label className="text-sm font-medium text-gray-600">Phone</Label>
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-gray-500" />
                            <a 
                              href={`tel:${project.client.phone}`} 
                              className="text-blue-600 hover:underline"
                            >
                              {project.client.phone}
                            </a>
                          </div>
                        </div>
                      )}
                    </div>

                    <div>
                      <Label className="text-sm font-medium text-gray-600">Payment Information</Label>
                      <div className="mt-2 p-4 bg-gray-50 rounded-lg">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm font-medium">Payment Type</p>
                            <p className="capitalize">{project.payment_type.replace('-', ' ')}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Payment Terms</p>
                            <p>{project.payment_terms}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    No client information available for this project.
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectDetailsDialog;
