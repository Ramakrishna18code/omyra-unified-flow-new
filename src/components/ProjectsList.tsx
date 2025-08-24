import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Edit, Trash2, Eye, Calendar, DollarSign, Users, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { type Project } from '@/services/api';

interface ProjectsListProps {
  projects: Project[];
  onEdit: (project: Project) => void;
  onDelete: (projectId: string) => void;
  onView: (project: Project) => void;
  getStatusColor: (status: string) => string;
  getPriorityColor: (priority: string) => string;
}

const ProjectsList: React.FC<ProjectsListProps> = ({
  projects,
  onEdit,
  onDelete,
  onView,
  getStatusColor,
  getPriorityColor
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'N/A';
      return format(date, 'MMM dd, yyyy');
    } catch {
      return 'N/A';
    }
  };

  const getDaysUntilDeadline = (endDate: string | null | undefined) => {
    if (!endDate) return null;
    try {
      const deadline = new Date(endDate);
      if (isNaN(deadline.getTime())) return null;
      const today = new Date();
      const diffTime = deadline.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    } catch {
      return null;
    }
  };

  if (projects.length === 0) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Projects Found</h3>
            <p className="text-gray-600">There are no projects matching your current filters.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[250px]">Project</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Budget</TableHead>
                <TableHead>Profit</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Team</TableHead>
                <TableHead>Timeline</TableHead>
                <TableHead>Client</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.map((project) => {
                const daysLeft = getDaysUntilDeadline(project.endDate);
                
                return (
                  <TableRow key={project._id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                    <TableCell>
                      <div>
                        <div className="font-medium text-gray-900 dark:text-gray-100">
                          {project.name}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-300 truncate max-w-[200px]">
                          {project.description}
                        </div>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <Badge className={getStatusColor(project.status)}>
                          {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                        </Badge>
                        {project.isOverdue && (
                          <Badge className="bg-red-100 text-red-800 border-red-200 text-xs">
                            Overdue
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <Badge className={getPriorityColor(project.priority)}>
                        {project.priority.charAt(0).toUpperCase() + project.priority.slice(1)}
                      </Badge>
                    </TableCell>
                    
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4 text-green-600" />
                        <span className="font-medium">{formatCurrency(project.project_value)}</span>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <span className={`font-medium ${project.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {formatCurrency(project.profit)}
                        </span>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="w-full max-w-[100px]">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-gray-600">{project.progress}%</span>
                        </div>
                        <Progress value={project.progress} className="h-1.5" />
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4 text-blue-600" />
                        <span>{project.team?.length || 0}</span>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-xs text-gray-600">
                          <Calendar className="w-3 h-3" />
                          <span>{formatDate(project.startDate)}</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-600">
                          <Calendar className="w-3 h-3" />
                          <span>{formatDate(project.endDate)}</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs">
                          <Clock className="w-3 h-3" />
                          <span className={daysLeft !== null ? (daysLeft < 0 ? 'text-red-600' : daysLeft < 7 ? 'text-orange-600' : 'text-gray-600') : 'text-gray-600'}>
                            {daysLeft !== null ? (
                              daysLeft > 0 ? `${daysLeft}d left` : 
                              daysLeft === 0 ? 'Due today' : 
                              `${Math.abs(daysLeft)}d overdue`
                            ) : 'No deadline'}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div>
                        {project.client?.name && (
                          <>
                            <div className="font-medium text-sm">{project.client.name}</div>
                            {project.client.company && (
                              <div className="text-xs text-gray-600">{project.client.company}</div>
                            )}
                          </>
                        )}
                      </div>
                    </TableCell>
                    
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="sm" onClick={() => onView(project)}>
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => onEdit(project)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => onDelete(project._id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectsList;
