import React, { useState, useEffect } from 'react';
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
import { employeeStorage, type Employee } from '@/lib/storage';

const EmployeeManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [isAddEmployeeOpen, setIsAddEmployeeOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    position: '',
    department: '',
    salary: '',
    startDate: ''
  });

  // Load employees on component mount
  useEffect(() => {
    const loadEmployees = () => {
      const storedEmployees = employeeStorage.getAll();
      setEmployees(storedEmployees);
    };
    loadEmployees();
  }, []);

  // Handle form submission
  const handleAddEmployee = () => {
    setIsLoading(true);
    try {
      const newEmployee = employeeStorage.add({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        position: formData.position,
        department: formData.department,
        salary: parseFloat(formData.salary) || 0,
        startDate: formData.startDate,
        status: 'active'
      });
      
      setEmployees(prev => [...prev, newEmployee]);
      setFormData({
        name: '',
        email: '',
        phone: '',
        position: '',
        department: '',
        salary: '',
        startDate: ''
      });
      setIsAddEmployeeOpen(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error('Error adding employee:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle actions with loading states
  const handleAction = (action: string, employeeId?: string) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    }, 800);
  };

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
      case 'active': return 'bg-accent/10 text-accent border-accent/20';
      case 'inactive': return 'bg-destructive/10 text-destructive border-destructive/20';
      case 'on-leave': return 'bg-warning/10 text-warning border-warning/20';
      default: return 'bg-muted/10 text-muted-foreground border-muted/20';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Success Toast */}
      {showSuccess && (
        <div className="fixed top-20 right-6 z-50 bg-accent text-white px-6 py-3 rounded-lg shadow-lg animate-slide-in-down">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-white rounded-full"></div>
            Action completed successfully!
          </div>
        </div>
      )}

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 flex items-center justify-center">
          <div className="bg-card p-8 rounded-2xl shadow-2xl animate-scale-in">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              <span className="text-lg font-medium">Processing...</span>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 animate-fade-in-up">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Employee Management
          </h1>
          <p className="text-muted-foreground">Manage your workforce and employee information</p>
        </div>
        
        <div className="flex gap-3 animate-fade-in-right">
          <Button 
            variant="outline" 
            className="hover-lift group"
            onClick={() => handleAction('import')}
            disabled={isLoading}
          >
            <Upload className="h-4 w-4 group-hover:animate-bounce-in" />
            Import CSV
          </Button>
          
          <Button 
            variant="outline" 
            className="hover-lift group"
            onClick={() => handleAction('export')}
            disabled={isLoading}
          >
            <Download className="h-4 w-4 group-hover:animate-bounce-in" />
            Export Data
          </Button>
          
          <Dialog open={isAddEmployeeOpen} onOpenChange={setIsAddEmployeeOpen}>
            <DialogTrigger asChild>
              <Button variant="neu-primary" className="hover-glow group" disabled={isLoading}>
                <Plus className="h-4 w-4 group-hover:animate-bounce-in" />
                Add Employee
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl animate-scale-in">
              <DialogHeader>
                <DialogTitle className="text-xl font-semibold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Add New Employee
                </DialogTitle>
                <DialogDescription>
                  Enter the employee details to add them to the system.
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid grid-cols-2 gap-4 py-4">
                <div className="space-y-2 animate-fade-in-up" style={{animationDelay: '100ms'}}>
                  <label className="text-sm font-medium">Full Name</label>
                  <Input 
                    placeholder="Enter full name" 
                    className="neu-inset focus:shadow-lg transition-all duration-300"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                
                <div className="space-y-2 animate-fade-in-up" style={{animationDelay: '150ms'}}>
                  <label className="text-sm font-medium">Employee ID</label>
                  <Input placeholder="Auto-generated" disabled className="neu-inset bg-muted/50" />
                </div>
                
                <div className="space-y-2 animate-fade-in-up" style={{animationDelay: '200ms'}}>
                  <label className="text-sm font-medium">Email</label>
                  <Input 
                    type="email" 
                    placeholder="employee@company.com" 
                    className="neu-inset focus:shadow-lg transition-all duration-300"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>
                
                <div className="space-y-2 animate-fade-in-up" style={{animationDelay: '250ms'}}>
                  <label className="text-sm font-medium">Phone</label>
                  <Input 
                    placeholder="+1 (555) 123-4567" 
                    className="neu-inset focus:shadow-lg transition-all duration-300"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  />
                </div>
                
                <div className="space-y-2 animate-fade-in-up" style={{animationDelay: '300ms'}}>
                  <label className="text-sm font-medium">Position</label>
                  <Input 
                    placeholder="Job title" 
                    className="neu-inset focus:shadow-lg transition-all duration-300"
                    value={formData.position}
                    onChange={(e) => setFormData(prev => ({ ...prev, position: e.target.value }))}
                  />
                </div>
                
                <div className="space-y-2 animate-fade-in-up" style={{animationDelay: '350ms'}}>
                  <label className="text-sm font-medium">Department</label>
                  <Select value={formData.department} onValueChange={(value) => setFormData(prev => ({ ...prev, department: value }))}>
                    <SelectTrigger className="neu-inset hover-lift">
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent className="animate-scale-in">
                      <SelectItem value="Engineering">Engineering</SelectItem>
                      <SelectItem value="Marketing">Marketing</SelectItem>
                      <SelectItem value="Sales">Sales</SelectItem>
                      <SelectItem value="Human Resources">Human Resources</SelectItem>
                      <SelectItem value="Finance">Finance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Join Date</label>
                  <Input 
                    type="date" 
                    value={formData.startDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Salary</label>
                  <Input 
                    placeholder="75000" 
                    type="number"
                    value={formData.salary}
                    onChange={(e) => setFormData(prev => ({ ...prev, salary: e.target.value }))}
                  />
                </div>
              </div>
              
              <div className="flex justify-end gap-3 animate-fade-in-up" style={{animationDelay: '500ms'}}>
                <Button 
                  variant="outline" 
                  onClick={() => setIsAddEmployeeOpen(false)}
                  className="hover-lift"
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button 
                  variant="neu-primary" 
                  className="hover-glow group"
                  onClick={handleAddEmployee}
                  disabled={isLoading || !formData.name || !formData.email}
                >
                  <Plus className="h-4 w-4 group-hover:animate-bounce-in" />
                  Add Employee
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filters and Search */}
      <Card className="neu-surface p-6 animate-fade-in-up" style={{animationDelay: '200ms'}}>
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative group">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4 group-focus-within:text-primary transition-colors" />
            <Input
              placeholder="Search employees by name, email, or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 neu-inset focus:shadow-lg transition-all duration-300"
            />
          </div>
          
          <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
            <SelectTrigger className="w-48 neu-inset hover-lift">
              <SelectValue placeholder="Department" />
            </SelectTrigger>
            <SelectContent className="animate-scale-in">
              <SelectItem value="all">All Departments</SelectItem>
              <SelectItem value="Engineering">Engineering</SelectItem>
              <SelectItem value="Marketing">Marketing</SelectItem>
              <SelectItem value="Sales">Sales</SelectItem>
              <SelectItem value="Human Resources">Human Resources</SelectItem>
              <SelectItem value="Finance">Finance</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-36 neu-inset hover-lift">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="animate-scale-in">
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="On Leave">On Leave</SelectItem>
              <SelectItem value="Inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
          
          <Button 
            variant="outline" 
            size="icon" 
            className="hover-scale group"
            onClick={() => handleAction('filter')}
            disabled={isLoading}
          >
            <Filter className="h-4 w-4 group-hover:animate-bounce-in" />
          </Button>
        </div>
      </Card>

      {/* Employee Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 animate-fade-in-up" style={{animationDelay: '300ms'}}>
        <Card className="neu-surface p-6 hover-lift group cursor-pointer stagger-item">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300 group-hover:animate-glow">
              <Users className="h-6 w-6 text-primary group-hover:animate-floating" />
            </div>
            <div>
              <p className="text-2xl font-bold group-hover:scale-105 transition-transform">247</p>
              <p className="text-sm text-muted-foreground group-hover:text-primary transition-colors">Total Employees</p>
            </div>
          </div>
        </Card>
        
        <Card className="neu-surface p-6 hover-lift group cursor-pointer stagger-item">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-accent/10 group-hover:bg-accent/20 transition-colors duration-300 group-hover:animate-glow">
              <Users className="h-6 w-6 text-accent group-hover:animate-floating" />
            </div>
            <div>
              <p className="text-2xl font-bold group-hover:scale-105 transition-transform">18</p>
              <p className="text-sm text-muted-foreground group-hover:text-accent transition-colors">New Hires (This Month)</p>
            </div>
          </div>
        </Card>
        
        <Card className="neu-surface p-6 hover-lift group cursor-pointer stagger-item">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-warning/10 group-hover:bg-warning/20 transition-colors duration-300 group-hover:animate-glow">
              <Users className="h-6 w-6 text-warning group-hover:animate-floating" />
            </div>
            <div>
              <p className="text-2xl font-bold group-hover:scale-105 transition-transform">5</p>
              <p className="text-sm text-muted-foreground group-hover:text-warning transition-colors">On Leave</p>
            </div>
          </div>
        </Card>
        
        <Card className="neu-surface p-6 hover-lift group cursor-pointer stagger-item">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-destructive/10 group-hover:bg-destructive/20 transition-colors duration-300 group-hover:animate-glow">
              <Users className="h-6 w-6 text-destructive group-hover:animate-floating" />
            </div>
            <div>
              <p className="text-2xl font-bold group-hover:scale-105 transition-transform">3.2%</p>
              <p className="text-sm text-muted-foreground group-hover:text-destructive transition-colors">Attrition Rate</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Employee Table */}
      <Card className="neu-surface animate-fade-in-up" style={{animationDelay: '400ms'}}>
        <div className="p-6 border-b border-border/50">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Employee Directory</h3>
              <p className="text-sm text-muted-foreground">
                {filteredEmployees.length} of {employees.length} employees
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
                <Search className="h-4 w-4 group-hover:animate-spin" />
                Refresh
              </Button>
            </div>
          </div>
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
              {filteredEmployees.map((employee, index) => (
                <TableRow 
                  key={employee.id} 
                  className="hover:bg-muted/50 transition-colors cursor-pointer group stagger-item"
                  style={{animationDelay: `${500 + index * 100}ms`}}
                  onClick={() => handleAction('view', employee.id)}
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary-gradient flex items-center justify-center group-hover:animate-glow">
                        <span className="text-sm font-medium text-primary-foreground">
                          {employee.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium group-hover:text-primary transition-colors">{employee.name}</p>
                        <p className="text-sm text-muted-foreground">{employee.id}</p>
                      </div>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm group-hover:text-primary transition-colors">
                        <Mail className="h-3 w-3 group-hover:animate-bounce-in" />
                        {employee.email}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Phone className="h-3 w-3 group-hover:animate-bounce-in" />
                        {employee.phone}
                      </div>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div>
                      <p className="font-medium group-hover:text-primary transition-colors">{employee.position}</p>
                      <p className="text-sm text-muted-foreground">Dept: {employee.department}</p>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <span className="font-medium group-hover:text-primary transition-colors">{employee.department}</span>
                  </TableCell>
                  
                  <TableCell>
                    <Badge className={getStatusColor(employee.status)}>
                      {employee.status}
                    </Badge>
                  </TableCell>
                  
                  <TableCell>
                    <div className="flex items-center gap-2 text-sm group-hover:text-primary transition-colors">
                      <Calendar className="h-3 w-3 group-hover:animate-bounce-in" />
                      {new Date(employee.startDate).toLocaleDateString()}
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="hover-scale group"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAction('view', employee.id);
                        }}
                        disabled={isLoading}
                      >
                        <Eye className="h-4 w-4 group-hover:animate-bounce-in" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="hover-scale group"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAction('edit', employee.id);
                        }}
                        disabled={isLoading}
                      >
                        <Edit className="h-4 w-4 group-hover:animate-bounce-in" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="hover-scale group"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAction('menu', employee.id);
                        }}
                        disabled={isLoading}
                      >
                        <MoreHorizontal className="h-4 w-4 group-hover:animate-floating" />
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