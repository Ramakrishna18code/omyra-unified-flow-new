import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  DollarSign,
  Calendar,
  BarChart3,
  PieChart as PieChartIcon,
  Download,
  Filter,
  Eye
} from 'lucide-react';

const AnalyticsReports: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('6months');
  const [selectedReport, setSelectedReport] = useState('overview');

  // Sample data for charts
  const employeeGrowthData = [
    { month: 'Jan', employees: 210, hires: 15, departures: 8 },
    { month: 'Feb', employees: 217, hires: 12, departures: 5 },
    { month: 'Mar', employees: 224, hires: 18, departures: 11 },
    { month: 'Apr', employees: 231, hires: 14, departures: 7 },
    { month: 'May', employees: 238, hires: 16, departures: 9 },
    { month: 'Jun', employees: 247, hires: 19, departures: 10 }
  ];

  const departmentData = [
    { name: 'Engineering', value: 89, color: '#3B82F6' },
    { name: 'Sales', value: 45, color: '#10B981' },
    { name: 'Marketing', value: 32, color: '#F59E0B' },
    { name: 'HR', value: 28, color: '#EF4444' },
    { name: 'Finance', value: 24, color: '#8B5CF6' },
    { name: 'Operations', value: 29, color: '#06B6D4' }
  ];

  const payrollTrendsData = [
    { month: 'Jan', payroll: 1245000, avgSalary: 5929 },
    { month: 'Feb', payroll: 1278000, avgSalary: 5889 },
    { month: 'Mar', payroll: 1312000, avgSalary: 5857 },
    { month: 'Apr', payroll: 1356000, avgSalary: 5866 },
    { month: 'May', payroll: 1389000, avgSalary: 5836 },
    { month: 'Jun', payroll: 1425000, avgSalary: 5770 }
  ];

  const attendanceData = [
    { month: 'Jan', attendance: 94.2, remote: 28.5 },
    { month: 'Feb', attendance: 95.1, remote: 31.2 },
    { month: 'Mar', attendance: 93.8, remote: 29.8 },
    { month: 'Apr', attendance: 94.7, remote: 32.1 },
    { month: 'May', attendance: 95.3, remote: 34.5 },
    { month: 'Jun', attendance: 94.9, remote: 33.2 }
  ];

  const kpiData = [
    {
      title: 'Employee Satisfaction',
      value: '4.6/5',
      change: '+0.2',
      trend: 'up',
      description: 'Based on quarterly survey'
    },
    {
      title: 'Attrition Rate',
      value: '8.2%',
      change: '-1.3%',
      trend: 'down',
      description: 'Annual turnover rate'
    },
    {
      title: 'Average Tenure',
      value: '3.2 years',
      change: '+0.4',
      trend: 'up',
      description: 'Employee average stay'
    },
    {
      title: 'Training Hours',
      value: '42.5h',
      change: '+12.3h',
      trend: 'up',
      description: 'Per employee annually'
    }
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Analytics & Reports</h1>
          <p className="text-muted-foreground">Insights and data visualization for informed decisions</p>
        </div>
        
        <div className="flex gap-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2 rounded-xl neu-inset border-0 bg-muted/30 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            <option value="3months">Last 3 months</option>
            <option value="6months">Last 6 months</option>
            <option value="1year">Last year</option>
          </select>
          
          <Button variant="outline">
            <Download className="h-4 w-4" />
            Export Report
          </Button>
          
          <Button variant="neu-primary">
            <BarChart3 className="h-4 w-4" />
            Custom Report
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {kpiData.map((kpi, index) => (
          <Card key={index} className="neu-surface p-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-muted-foreground">{kpi.title}</h3>
                {kpi.trend === 'up' ? 
                  <TrendingUp className="h-4 w-4 text-accent" /> : 
                  <TrendingDown className="h-4 w-4 text-destructive" />
                }
              </div>
              
              <div className="space-y-1">
                <p className="text-2xl font-bold">{kpi.value}</p>
                <div className="flex items-center gap-2">
                  <Badge 
                    className={kpi.trend === 'up' ? 
                      'bg-accent/10 text-accent border-accent/20' : 
                      'bg-destructive/10 text-destructive border-destructive/20'
                    }
                  >
                    {kpi.change}
                  </Badge>
                  <span className="text-xs text-muted-foreground">{kpi.description}</span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Employee Growth Chart */}
        <Card className="neu-surface p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">Employee Growth</h3>
            <Button variant="ghost" size="sm">
              <Eye className="h-4 w-4" />
            </Button>
          </div>
          
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={employeeGrowthData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '0.75rem'
                }}
              />
              <Area 
                type="monotone" 
                dataKey="employees" 
                stroke="hsl(var(--primary))" 
                fill="hsl(var(--primary) / 0.2)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* Department Distribution */}
        <Card className="neu-surface p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">Department Distribution</h3>
            <Button variant="ghost" size="sm">
              <PieChartIcon className="h-4 w-4" />
            </Button>
          </div>
          
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={departmentData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={120}
                dataKey="value"
              >
                {departmentData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '0.75rem'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          
          <div className="grid grid-cols-2 gap-2 mt-4">
            {departmentData.map((dept, index) => (
              <div key={index} className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: dept.color }}
                ></div>
                <span className="text-sm">{dept.name}</span>
                <span className="text-sm text-muted-foreground ml-auto">{dept.value}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Payroll Trends */}
        <Card className="neu-surface p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">Payroll Trends</h3>
            <Button variant="ghost" size="sm">
              <DollarSign className="h-4 w-4" />
            </Button>
          </div>
          
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={payrollTrendsData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
              <Tooltip 
                formatter={(value: any) => [formatCurrency(value), 'Total Payroll']}
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '0.75rem'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="payroll" 
                stroke="hsl(var(--accent))" 
                strokeWidth={3}
                dot={{ fill: 'hsl(var(--accent))', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Attendance Overview */}
        <Card className="neu-surface p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">Attendance Overview</h3>
            <Button variant="ghost" size="sm">
              <Calendar className="h-4 w-4" />
            </Button>
          </div>
          
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={attendanceData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="month" />
              <YAxis domain={[80, 100]} />
              <Tooltip 
                formatter={(value: any, name: string) => [
                  `${value}%`, 
                  name === 'attendance' ? 'Office Attendance' : 'Remote Work'
                ]}
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '0.75rem'
                }}
              />
              <Bar dataKey="attendance" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              <Bar dataKey="remote" fill="hsl(var(--warning))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Report Summary */}
      <Card className="neu-surface p-6">
        <h3 className="text-lg font-semibold mb-4">Executive Summary</h3>
        <div className="prose prose-sm max-w-none text-muted-foreground">
          <p>
            The company has shown steady growth in Q1 2024 with a net increase of 37 employees, 
            representing a 17.6% growth rate. Employee satisfaction remains high at 4.6/5, while 
            the attrition rate has decreased to 8.2%, indicating improved retention strategies.
          </p>
          <p>
            Total payroll expenses have increased by 14.5% to support the growing workforce, 
            with an average salary competitive in the market. Remote work adoption continues 
            to be popular, comprising approximately 33% of work arrangements.
          </p>
        </div>
      </Card>
    </div>
  );
};

export default AnalyticsReports;