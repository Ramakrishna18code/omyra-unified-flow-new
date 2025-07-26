import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
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
  AlertTriangle
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Attendance Management</h1>
          <p className="text-muted-foreground">Track and manage employee attendance</p>
        </div>
        
        <div className="flex gap-3">
          <Button variant="outline">
            <Download className="h-4 w-4" />
            Export Report
          </Button>
          <Button variant="neu-primary">
            <Clock className="h-4 w-4" />
            Clock In/Out
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="neu-surface p-4">
          <div className="flex items-center gap-3">
            <Users className="h-8 w-8 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Total</p>
              <p className="text-2xl font-bold">{stats.totalEmployees}</p>
            </div>
          </div>
        </Card>
        
        <Card className="neu-surface p-4">
          <div className="flex items-center gap-3">
            <CheckCircle className="h-8 w-8 text-accent" />
            <div>
              <p className="text-sm text-muted-foreground">Present</p>
              <p className="text-2xl font-bold text-accent">{stats.present}</p>
            </div>
          </div>
        </Card>
        
        <Card className="neu-surface p-4">
          <div className="flex items-center gap-3">
            <XCircle className="h-8 w-8 text-destructive" />
            <div>
              <p className="text-sm text-muted-foreground">Absent</p>
              <p className="text-2xl font-bold text-destructive">{stats.absent}</p>
            </div>
          </div>
        </Card>
        
        <Card className="neu-surface p-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-8 w-8 text-warning" />
            <div>
              <p className="text-sm text-muted-foreground">Late</p>
              <p className="text-2xl font-bold text-warning">{stats.late}</p>
            </div>
          </div>
        </Card>
        
        <Card className="neu-surface p-4">
          <div className="flex items-center gap-3">
            <TrendingUp className="h-8 w-8 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Avg Hours</p>
              <p className="text-2xl font-bold">{stats.avgHours}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="neu-surface p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search employees..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 neu-inset border-0 bg-muted/30"
            />
          </div>
          
          <div className="flex gap-3">
            <Input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="neu-inset border-0 bg-muted/30"
            />
            
            <Button variant="outline">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
          </div>
        </div>
      </Card>

      {/* Attendance Table */}
      <Card className="neu-surface">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold">Daily Attendance</h3>
            <Badge variant="outline">
              {new Date(selectedDate).toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </Badge>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-left p-4 font-medium text-muted-foreground">Employee</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Clock In</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Clock Out</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Hours</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Location</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Status</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {attendanceData
                  .filter(record => 
                    record.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    record.employeeId.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map((record) => (
                    <tr key={record.id} className="border-b border-border/30 hover:bg-muted/20 transition-colors">
                      <td className="p-4">
                        <div>
                          <p className="font-medium">{record.employeeName}</p>
                          <p className="text-sm text-muted-foreground">{record.employeeId}</p>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="font-mono">{record.clockIn || '-'}</span>
                      </td>
                      <td className="p-4">
                        <span className="font-mono">{record.clockOut || '-'}</span>
                      </td>
                      <td className="p-4">
                        <span className="font-medium">
                          {record.hoursWorked ? `${record.hoursWorked}h` : '-'}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
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
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm">Edit</Button>
                          <Button variant="ghost" size="sm">View</Button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AttendanceManagement;