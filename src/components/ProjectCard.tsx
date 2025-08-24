import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Calendar, DollarSign, Users, Edit, Trash2, Eye, Clock, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';
import { type Project } from '@/services/api';

interface ProjectCardProps {
  project: Project;
  onEdit: () => void;
  onDelete: () => void;
  onView: () => void;
  getStatusColor: (status: string) => string;
  getPriorityColor: (priority: string) => string;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
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

  const getDaysUntilDeadline = () => {
    if (!project.endDate) return null;
    try {
      const endDate = new Date(project.endDate);
      if (isNaN(endDate.getTime())) return null;
      const today = new Date();
      const diffTime = endDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    } catch {
      return null;
    }
  };

  const daysLeft = getDaysUntilDeadline();

  return (
    <Card className="group hover:shadow-lg transition-all duration-200 cursor-pointer">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
              {project.name}
            </CardTitle>
            <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
              {project.description}
            </p>
          </div>
          <div className="flex items-center gap-1 ml-2">
            <Button variant="ghost" size="sm" onClick={onView}>
              <Eye className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={onEdit}>
              <Edit className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={onDelete} className="text-red-600 hover:text-red-700">
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge className={getStatusColor(project.status)}>
            {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
          </Badge>
          <Badge className={getPriorityColor(project.priority)}>
            {project.priority.charAt(0).toUpperCase() + project.priority.slice(1)}
          </Badge>
          {project.isOverdue && (
            <Badge className="bg-red-100 text-red-800 border-red-200">
              Overdue
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Project Value and Profit */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-green-600" />
            <div>
              <p className="text-xs text-gray-600">Budget</p>
              <p className="font-semibold">{formatCurrency(project.project_value)}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-blue-600" />
            <div>
              <p className="text-xs text-gray-600">Profit</p>
              <p className="font-semibold text-green-600">{formatCurrency(project.profit)}</p>
            </div>
          </div>
        </div>

        {/* Progress */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Progress</span>
            <span className="text-sm text-gray-600">{project.progress}%</span>
          </div>
          <Progress value={project.progress} className="h-2" />
        </div>

        {/* Team and Timeline */}
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>{project.team?.length || 0} members</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>
              {daysLeft !== null ? (
                daysLeft > 0 ? `${daysLeft} days left` : 
                daysLeft === 0 ? 'Due today' : 
                `${Math.abs(daysLeft)} days overdue`
              ) : 'No deadline'}
            </span>
          </div>
        </div>

        {/* Dates */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>Start: {formatDate(project.startDate)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>End: {formatDate(project.endDate)}</span>
          </div>
        </div>

        {/* Client */}
        {project.client?.name && (
          <div className="pt-2 border-t">
            <p className="text-xs text-gray-600">Client</p>
            <p className="font-medium text-sm">{project.client.name}</p>
            {project.client.company && (
              <p className="text-xs text-gray-500">{project.client.company}</p>
            )}
          </div>
        )}

        {/* Milestones Summary */}
        {project.milestones?.length > 0 && (
          <div className="pt-2 border-t">
            <p className="text-xs text-gray-600 mb-1">Milestones</p>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-green-600">
                {(project.milestones || []).filter(m => m.status === 'completed').length} completed
              </span>
              <span className="text-gray-400">•</span>
              <span className="text-gray-600">
                {(project.milestones || []).length} total
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProjectCard;
