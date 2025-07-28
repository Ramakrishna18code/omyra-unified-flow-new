import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  Users, 
  Plus, 
  Search, 
  Filter,
  Edit,
  Eye,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Download,
  Upload,
  MoreHorizontal
} from 'lucide-react';

const EmployeeManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [isAddEmployeeOpen, setIsAddEmployeeOpen] = useState(false);

  // Sample employee data
  const employees = [
    {
      id: 'EMP001',
      name: 'John Anderson',
      email: 'john.anderson@company.com',
      phone: '+1 (555) 123-4567',
      position: 'Senior Software Engineer',
      department: 'Engineering',
      status: 'Active',
      joinDate: '2022-03-15',
      salary: '$95,000',
      location: 'San Francisco, CA',
      manager: 'Sarah Wilson',
      avatar: 'JA'
    },
    {
      id: 'EMP002',
      name: 'Emily Rodriguez',
      email: 'emily.rodriguez@company.com',
      phone: '+1 (555) 234-5678',
      position: 'Marketing Manager',
      department: 'Marketing',
      status: 'Active',
      joinDate: '2021-08-22',
      salary: '$75,000',
      location: 'New York, NY',
      manager: 'Michael Chen',
      avatar: 'ER'
    },
    {
      id: 'EMP003',
      name: 'David Kim',
      email: 'david.kim@company.com',
      phone: '+1 (555) 345-6789',
      position: 'HR Specialist',
      department: 'Human Resources',
      status: 'Active',
      joinDate: '2023-01-10',
      salary: '$65,000',
      location: 'Austin, TX',
      manager: 'Lisa Thompson',
      avatar: 'DK'
    },
    {
      id: 'EMP004',
      name: 'Sarah Miller',
      email: 'sarah.miller@company.com',
      phone: '+1 (555) 456-7890',
      position: 'Financial Analyst',
      department: 'Finance',
      status: 'On Leave',
      joinDate: '2020-11-05',
      salary: '$70,000',
      location: 'Chicago, IL',
      manager: 'Robert Davis',
      avatar: 'SM'
    },
    {
      id: 'EMP005',
      name: 'Alex Thompson',
      email: 'alex.thompson@company.com',
      phone: '+1 (555) 567-8901',
      position: 'Sales Representative',
      department: 'Sales',
      status: 'Active',
      joinDate: '2022-07-18',
      salary: '$60,000',
      location: 'Miami, FL',
      manager: 'Jennifer Lee',
      avatar: 'AT'
    }
  ];

  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         emp.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = selectedDepartment === 'all' || emp.department === selectedDepartment;
    const matchesStatus = selectedStatus === 'all' || emp.status === selectedStatus;
    
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-accent/10 text-accent border-accent/20';
      case 'On Leave': return 'bg-warning/10 text-warning border-warning/20';
      case 'Inactive': return 'bg-muted text-muted-foreground border-muted';
      default: return 'bg-muted text-muted-foreground border-muted';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Employee Management</h1>
          <p className="text-muted-foreground">Manage your workforce and employee information</p>
        </div>
        
        <div className="flex gap-3">
          <Button variant="outline">
            <Upload className="h-4 w-4" />
            Import CSV
          </Button>
          
          <Button variant="outline">
            <Download className="h-4 w-4" />
            Export Data
          </Button>
          
          <Dialog open={isAddEmployeeOpen} onOpenChange={setIsAddEmployeeOpen}>
            <DialogTrigger asChild>
              <Button variant="neu-primary">
                <Plus className="h-4 w-4" />
                Add Employee
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Employee</DialogTitle>
                <DialogDescription>
                  Enter the employee details to add them to the system.
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid grid-cols-2 gap-4 py-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Full Name</label>
                  <Input placeholder="Enter full name" />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Employee ID</label>
                  <Input placeholder="Auto-generated" disabled />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <Input type="email" placeholder="employee@company.com" />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Phone</label>
                  <Input placeholder="+1 (555) 123-4567" />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Position</label>
                  <Input placeholder="Job title" />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Department</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="engineering">Engineering</SelectItem>
                      <SelectItem value="marketing">Marketing</SelectItem>
                      <SelectItem value="sales">Sales</SelectItem>
                      <SelectItem value="hr">Human Resources</SelectItem>
                      <SelectItem value="finance">Finance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Join Date</label>
                  <Input type="date" />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Salary</label>
                  <Input placeholder="$75,000" />
                </div>
              </div>
              
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setIsAddEmployeeOpen(false)}>
                  Cancel
                </Button>
                <Button variant="neu-primary">
                  Add Employee
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filters and Search */}
      <Card className="neu-surface p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search employees by name, email, or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              <SelectItem value="Engineering">Engineering</SelectItem>
              <SelectItem value="Marketing">Marketing</SelectItem>
              <SelectItem value="Sales">Sales</SelectItem>
              <SelectItem value="Human Resources">Human Resources</SelectItem>
              <SelectItem value="Finance">Finance</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="On Leave">On Leave</SelectItem>
              <SelectItem value="Inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </Card>

      {/* Employee Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="neu-surface p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-primary/10">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">247</p>
              <p className="text-sm text-muted-foreground">Total Employees</p>
            </div>
          </div>
        </Card>
        
        <Card className="neu-surface p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-accent/10">
              <Users className="h-6 w-6 text-accent" />
            </div>
            <div>
              <p className="text-2xl font-bold">18</p>
              <p className="text-sm text-muted-foreground">New Hires (This Month)</p>
            </div>
          </div>
        </Card>
        
        <Card className="neu-surface p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-warning/10">
              <Users className="h-6 w-6 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold">5</p>
              <p className="text-sm text-muted-foreground">On Leave</p>
            </div>
          </div>
        </Card>
        
        <Card className="neu-surface p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-destructive/10">
              <Users className="h-6 w-6 text-destructive" />
            </div>
            <div>
              <p className="text-2xl font-bold">3.2%</p>
              <p className="text-sm text-muted-foreground">Attrition Rate</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Employee Table */}
      <Card className="neu-surface">
        <div className="p-6 border-b border-border/50">
          <h3 className="text-lg font-semibold">Employee Directory</h3>
          <p className="text-sm text-muted-foreground">
            {filteredEmployees.length} of {employees.length} employees
          </p>
        </div>
        
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Join Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEmployees.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary-gradient flex items-center justify-center">
                        <span className="text-sm font-medium text-primary-foreground">
                          {employee.avatar}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium">{employee.name}</p>
                        <p className="text-sm text-muted-foreground">{employee.id}</p>
                      </div>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-3 w-3" />
                        {employee.email}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Phone className="h-3 w-3" />
                        {employee.phone}
                      </div>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div>
                      <p className="font-medium">{employee.position}</p>
                      <p className="text-sm text-muted-foreground">Manager: {employee.manager}</p>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <span className="font-medium">{employee.department}</span>
                  </TableCell>
                  
                  <TableCell>
                    <Badge className={getStatusColor(employee.status)}>
                      {employee.status}
                    </Badge>
                  </TableCell>
                  
                  <TableCell>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-3 w-3" />
                      {new Date(employee.joinDate).toLocaleDateString()}
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
};

export default EmployeeManagement;