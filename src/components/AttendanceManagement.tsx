import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Clock, 
  Calendar, 
  MapPin, 
  Users, 
  TrendingUp,
  Download,
  Filter,
  Search,
  CheckCircle,
  XCircle,
  AlertTriangle,
  MoreHorizontal
} from 'lucide-react';

interface AttendanceRecord {
  id: string;
  employeeName: string;
  employeeId: string;
  date: string;
  clockIn: string;
  clockOut?: string;
  hoursWorked?: number;
  status: 'present' | 'late' | 'absent' | 'half-day';
  location: string;
}

const AttendanceManagement: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Handle actions with loading states
  const handleAction = (action: string, recordId?: string) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    }, 800);
  };

  const attendanceData: AttendanceRecord[] = [
    {
      id: '1',
      employeeName: 'John Doe',
      employeeId: 'EMP001',
      date: selectedDate,
      clockIn: '09:00',
      clockOut: '18:00',
      hoursWorked: 9,
      status: 'present',
      location: 'Office'
    },
    {
      id: '2',
      employeeName: 'Sarah Johnson',
      employeeId: 'EMP002',
      date: selectedDate,
      clockIn: '09:15',
      clockOut: '18:30',
      hoursWorked: 9.25,
      status: 'late',
      location: 'Remote'
    },
    {
      id: '3',
      employeeName: 'Mike Wilson',
      employeeId: 'EMP003',
      date: selectedDate,
      clockIn: '',
      clockOut: '',
      hoursWorked: 0,
      status: 'absent',
      location: ''
    }
  ];

  const stats = {
    totalEmployees: 247,
    present: 234,
    absent: 8,
    late: 5,
    avgHours: 8.2
  };

  const getStatusIcon = (status: AttendanceRecord['status']) => {
    switch (status) {
      case 'present': return <CheckCircle className="h-4 w-4 text-accent" />;
      case 'late': return <AlertTriangle className="h-4 w-4 text-warning" />;
      case 'absent': return <XCircle className="h-4 w-4 text-destructive" />;
      case 'half-day': return <Clock className="h-4 w-4 text-primary" />;
    }
  };

  const getStatusColor = (status: AttendanceRecord['status']) => {
    switch (status) {
      case 'present': return 'bg-accent/10 text-accent border-accent/20';
      case 'late': return 'bg-warning/10 text-warning border-warning/20';
      case 'absent': return 'bg-destructive/10 text-destructive border-destructive/20';
      case 'half-day': return 'bg-primary/10 text-primary border-primary/20';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Success Toast */}
      {showSuccess && (
        <div className="fixed top-20 right-6 z-50 bg-accent text-white px-6 py-3 rounded-lg shadow-lg animate-slide-in-down">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-white rounded-full"></div>
            Attendance updated successfully!
          </div>
        </div>
      )}

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 flex items-center justify-center">
          <div className="bg-card p-8 rounded-2xl shadow-2xl animate-scale-in">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              <span className="text-lg font-medium">Processing attendance...</span>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 animate-fade-in-up">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Attendance Management
          </h1>
          <p className="text-muted-foreground">Track and manage employee attendance</p>
        </div>
        
        <div className="flex gap-3 animate-fade-in-right">
          <Button 
            variant="outline" 
            className="hover-lift group"
            onClick={() => handleAction('export')}
            disabled={isLoading}
          >
            <Download className="h-4 w-4 group-hover:animate-bounce-in" />
            Export Report
          </Button>
          <Button 
            variant="neu-primary" 
            className="hover-glow group"
            onClick={() => handleAction('clock')}
            disabled={isLoading}
          >
            <Clock className="h-4 w-4 group-hover:animate-bounce-in" />
            Clock In/Out
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 animate-fade-in-up" style={{animationDelay: '200ms'}}>
        <Card 
          className="neu-surface p-4 hover-lift group cursor-pointer stagger-item"
          onClick={() => handleAction('view-stats', 'total')}
        >
          <div className="flex items-center gap-3">
            <Users className="h-8 w-8 text-primary group-hover:animate-floating" />
            <div>
              <p className="text-sm text-muted-foreground group-hover:text-primary transition-colors">Total</p>
              <p className="text-2xl font-bold group-hover:scale-105 transition-transform">{stats.totalEmployees}</p>
            </div>
          </div>
        </Card>
        
        <Card 
          className="neu-surface p-4 hover-lift group cursor-pointer stagger-item"
          onClick={() => handleAction('view-stats', 'present')}
        >
          <div className="flex items-center gap-3">
            <CheckCircle className="h-8 w-8 text-accent group-hover:animate-floating" />
            <div>
              <p className="text-sm text-muted-foreground group-hover:text-accent transition-colors">Present</p>
              <p className="text-2xl font-bold text-accent group-hover:scale-105 transition-transform">{stats.present}</p>
            </div>
          </div>
        </Card>
        
        <Card 
          className="neu-surface p-4 hover-lift group cursor-pointer stagger-item"
          onClick={() => handleAction('view-stats', 'absent')}
        >
          <div className="flex items-center gap-3">
            <XCircle className="h-8 w-8 text-destructive group-hover:animate-floating" />
            <div>
              <p className="text-sm text-muted-foreground group-hover:text-destructive transition-colors">Absent</p>
              <p className="text-2xl font-bold text-destructive group-hover:scale-105 transition-transform">{stats.absent}</p>
            </div>
          </div>
        </Card>
        
        <Card 
          className="neu-surface p-4 hover-lift group cursor-pointer stagger-item"
          onClick={() => handleAction('view-stats', 'late')}
        >
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-8 w-8 text-warning group-hover:animate-floating" />
            <div>
              <p className="text-sm text-muted-foreground group-hover:text-warning transition-colors">Late</p>
              <p className="text-2xl font-bold text-warning group-hover:scale-105 transition-transform">{stats.late}</p>
            </div>
          </div>
        </Card>
        
        <Card 
          className="neu-surface p-4 hover-lift group cursor-pointer stagger-item"
          onClick={() => handleAction('view-stats', 'hours')}
        >
          <div className="flex items-center gap-3">
            <TrendingUp className="h-8 w-8 text-primary group-hover:animate-floating" />
            <div>
              <p className="text-sm text-muted-foreground group-hover:text-primary transition-colors">Avg Hours</p>
              <p className="text-2xl font-bold group-hover:scale-105 transition-transform">{stats.avgHours}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="neu-surface p-6 animate-fade-in-up" style={{animationDelay: '300ms'}}>
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative group">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
              placeholder="Search employees..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 neu-inset focus:shadow-lg transition-all duration-300"
            />
          </div>
          
          <div className="flex gap-3">
            <Input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="neu-inset hover-lift transition-all duration-300"
            />
            
            <Button 
              variant="outline" 
              className="hover-lift group"
              onClick={() => handleAction('filter')}
              disabled={isLoading}
            >
              <Filter className="h-4 w-4 group-hover:animate-bounce-in" />
              Filter
            </Button>
          </div>
        </div>
      </Card>

      {/* Attendance Table */}
      <Card className="neu-surface animate-fade-in-up" style={{animationDelay: '400ms'}}>
        <div className="p-6 border-b border-border/50">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Daily Attendance</h3>
              <p className="text-sm text-muted-foreground">
                {attendanceData.filter(record => 
                  record.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  record.employeeId.toLowerCase().includes(searchTerm.toLowerCase())
                ).length} employees for {new Date(selectedDate).toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="hover-lift group"
                onClick={() => handleAction('refresh')}
                disabled={isLoading}
              >
                <Clock className="h-4 w-4 group-hover:animate-spin" />
                Refresh
              </Button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-border/50">
              <tr>
                <th className="text-left p-4 font-medium">Employee</th>
                <th className="text-left p-4 font-medium">Clock In</th>
                <th className="text-left p-4 font-medium">Clock Out</th>
                <th className="text-left p-4 font-medium">Hours</th>
                <th className="text-left p-4 font-medium">Location</th>
                <th className="text-left p-4 font-medium">Status</th>
                <th className="text-left p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {attendanceData
                .filter(record => 
                  record.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  record.employeeId.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((record, index) => (
                  <tr 
                    key={record.id} 
                    className="border-b border-border/20 hover:bg-muted/50 transition-colors cursor-pointer group stagger-item"
                    style={{animationDelay: `${500 + index * 100}ms`}}
                    onClick={() => handleAction('view', record.id)}
                  >
                    <td className="p-4">
                      <div>
                        <p className="font-medium group-hover:text-primary transition-colors">{record.employeeName}</p>
                        <p className="text-sm text-muted-foreground">{record.employeeId}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="font-mono group-hover:text-primary transition-colors">{record.clockIn || '-'}</span>
                    </td>
                    <td className="p-4">
                      <span className="font-mono group-hover:text-primary transition-colors">{record.clockOut || '-'}</span>
                    </td>
                    <td className="p-4">
                      <span className="font-medium group-hover:text-primary transition-colors">
                        {record.hoursWorked ? `${record.hoursWorked}h` : '-'}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 group-hover:text-primary transition-colors">
                        <MapPin className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                        <span>{record.location || '-'}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge className={`${getStatusColor(record.status)} flex items-center gap-1 w-fit`}>
                        {getStatusIcon(record.status)}
                        <span className="capitalize">{record.status}</span>
                      </Badge>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="hover-scale group"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAction('edit', record.id);
                          }}
                          disabled={isLoading}
                        >
                          Edit
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="hover-scale group"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAction('view-details', record.id);
                          }}
                          disabled={isLoading}
                        >
                          View
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-fade-in-up" style={{animationDelay: '500ms'}}>
        <Card 
          className="neu-surface p-6 hover-lift group cursor-pointer"
          onClick={() => handleAction('clock-management')}
        >
          <div className="flex items-center gap-4">
            <Clock className="h-12 w-12 text-primary group-hover:animate-floating" />
            <div>
              <h3 className="font-semibold group-hover:text-primary transition-colors">Clock Management</h3>
              <p className="text-sm text-muted-foreground">Manage employee clock in/out times</p>
            </div>
          </div>
        </Card>
        
        <Card 
          className="neu-surface p-6 hover-lift group cursor-pointer"
          onClick={() => handleAction('attendance-reports')}
        >
          <div className="flex items-center gap-4">
            <Calendar className="h-12 w-12 text-accent group-hover:animate-floating" />
            <div>
              <h3 className="font-semibold group-hover:text-accent transition-colors">Attendance Reports</h3>
              <p className="text-sm text-muted-foreground">Generate detailed attendance reports</p>
            </div>
          </div>
        </Card>
        
        <Card 
          className="neu-surface p-6 hover-lift group cursor-pointer"
          onClick={() => handleAction('location-tracking')}
        >
          <div className="flex items-center gap-4">
            <MapPin className="h-12 w-12 text-warning group-hover:animate-floating" />
            <div>
              <h3 className="font-semibold group-hover:text-warning transition-colors">Location Tracking</h3>
              <p className="text-sm text-muted-foreground">Track employee work locations</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AttendanceManagement;