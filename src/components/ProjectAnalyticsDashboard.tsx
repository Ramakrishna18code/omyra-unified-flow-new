import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Area, AreaChart } from 'recharts';
import { TrendingUp, DollarSign, Target, Users, Calendar, AlertCircle, CheckCircle } from 'lucide-react';
import { type Project, type ProjectAnalytics, type ProfitsSummary } from '@/services/api';

interface ProjectAnalyticsDashboardProps {
  projects: Project[];
  analytics: ProjectAnalytics[];
  summary?: ProfitsSummary | null;
}

const ProjectAnalyticsDashboard: React.FC<ProjectAnalyticsDashboardProps> = ({
  projects,
  analytics,
  summary
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Prepare data for charts
  const statusData = projects.reduce((acc, project) => {
    acc[project.status] = (acc[project.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const statusChartData = Object.entries(statusData).map(([status, count]) => ({
    name: status.charAt(0).toUpperCase() + status.slice(1),
    value: count,
    count
  }));

  const priorityData = projects.reduce((acc, project) => {
    acc[project.priority] = (acc[project.priority] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const priorityChartData = Object.entries(priorityData).map(([priority, count]) => ({
    name: priority.charAt(0).toUpperCase() + priority.slice(1),
    value: count,
    count
  }));

  const profitData = projects.map(project => ({
    name: project.name.length > 15 ? project.name.substring(0, 15) + '...' : project.name,
    profit: project.profit,
    budget: project.project_value,
    profitMargin: ((project.profit / project.project_value) * 100)
  }));

  const progressData = projects.map(project => ({
    name: project.name.length > 10 ? project.name.substring(0, 10) + '...' : project.name,
    progress: project.progress,
    milestones: project.milestones.length,
    completedMilestones: project.milestones.filter(m => m.status === 'completed').length
  }));

  const monthlyData = projects.reduce((acc, project) => {
    const month = new Date(project.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    if (!acc[month]) {
      acc[month] = { month, projects: 0, revenue: 0, profit: 0 };
    }
    acc[month].projects += 1;
    acc[month].revenue += project.project_value;
    acc[month].profit += project.profit;
    return acc;
  }, {} as Record<string, any>);

  const monthlyChartData = Object.values(monthlyData);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

  // Calculate summary metrics
  const totalProjects = projects.length;
  const activeProjects = projects.filter(p => p.status === 'active').length;
  const completedProjects = projects.filter(p => p.status === 'completed').length;
  const overdueProjects = projects.filter(p => p.isOverdue).length;
  const avgProgress = projects.reduce((sum, p) => sum + p.progress, 0) / totalProjects || 0;
  const totalTeamMembers = projects.reduce((sum, p) => sum + p.team.length, 0);

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Target className="h-8 w-8 text-blue-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Active Projects</p>
                <p className="text-2xl font-bold">{activeProjects}</p>
                <p className="text-xs text-gray-500">of {totalProjects} total</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold">{completedProjects}</p>
                <p className="text-xs text-gray-500">{((completedProjects / totalProjects) * 100).toFixed(1)}% success rate</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <AlertCircle className="h-8 w-8 text-red-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Overdue</p>
                <p className="text-2xl font-bold">{overdueProjects}</p>
                <p className="text-xs text-gray-500">{((overdueProjects / totalProjects) * 100).toFixed(1)}% of total</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-purple-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Team Members</p>
                <p className="text-2xl font-bold">{totalTeamMembers}</p>
                <p className="text-xs text-gray-500">across all projects</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Project Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Project Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, count }) => `${name}: ${count}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Priority Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Priority Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={priorityChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Project Profits */}
        <Card>
          <CardHeader>
            <CardTitle>Project Profitability</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={profitData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis tickFormatter={(value) => `$${(value / 1000)}k`} />
                <Tooltip 
                  formatter={(value: number, name: string) => [
                    formatCurrency(value), 
                    name === 'profit' ? 'Profit' : 'Budget'
                  ]}
                />
                <Bar dataKey="budget" fill="#e0e7ff" name="budget" />
                <Bar dataKey="profit" fill="#10b981" name="profit" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Project Progress */}
        <Card>
          <CardHeader>
            <CardTitle>Project Progress Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={progressData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name"
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis />
                <Tooltip />
                <Area 
                  type="monotone" 
                  dataKey="progress" 
                  stroke="#8884d8" 
                  fill="#8884d8"
                  fillOpacity={0.6}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Revenue Trend */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Revenue & Profit Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={monthlyChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={(value) => `$${(value / 1000)}k`} />
              <Tooltip 
                formatter={(value: number, name: string) => [
                  formatCurrency(value), 
                  name === 'revenue' ? 'Revenue' : name === 'profit' ? 'Profit' : 'Projects'
                ]}
              />
              <Line type="monotone" dataKey="revenue" stroke="#8884d8" strokeWidth={2} />
              <Line type="monotone" dataKey="profit" stroke="#82ca9d" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Project Performance Table */}
      <Card>
        <CardHeader>
          <CardTitle>Top Performing Projects</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {projects
              .sort((a, b) => b.profit - a.profit)
              .slice(0, 5)
              .map((project, index) => (
                <div key={project._id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full font-semibold">
                      {index + 1}
                    </div>
                    <div>
                      <h4 className="font-semibold">{project.name}</h4>
                      <p className="text-sm text-gray-600">{project.client.name}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Progress</p>
                      <div className="flex items-center gap-2">
                        <Progress value={project.progress} className="w-16 h-2" />
                        <span className="text-sm font-medium">{project.progress}%</span>
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Profit</p>
                      <p className="font-semibold text-green-600">{formatCurrency(project.profit)}</p>
                    </div>
                    
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Margin</p>
                      <p className="font-semibold">
                        {((project.profit / project.project_value) * 100).toFixed(1)}%
                      </p>
                    </div>
                    
                    <Badge className={
                      project.status === 'completed' ? 'bg-green-100 text-green-800 border-green-200' :
                      project.status === 'active' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                      'bg-yellow-100 text-yellow-800 border-yellow-200'
                    }>
                      {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                    </Badge>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectAnalyticsDashboard;
