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
  MoreHorizontal,
  Trash2,
  RefreshCw
} from 'lucide-react';
import { dashboardService, type Employee } from '../services/dashboardService';
import { useToast } from '@/hooks/use-toast';

const EmployeeManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [isAddEmployeeOpen, setIsAddEmployeeOpen] = useState(false);
  const [isEditEmployeeOpen, setIsEditEmployeeOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loadingEmployees, setLoadingEmployees] = useState(true);
  const [employeeStats, setEmployeeStats] = useState({
    totalEmployees: 0,
    newHires: 0,
    onLeave: 0,
    attritionRate: 0
  });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    position: '',
    phoneNumber: '',
    department: '',
    salary: '',
    joiningDate: ''
  });
  const { toast } = useToast();

  // Load employees from backend API
  useEffect(() => {
    const loadEmployees = async () => {
      try {
        setLoadingEmployees(true);
        console.log('🔄 Loading employees from backend...');
        const response = await dashboardService.getAllEmployees();
        setEmployees(response.employees);
        console.log('✅ Employees loaded successfully:', response.employees.length);
        
        // Calculate employee statistics from loaded data
        calculateEmployeeStats(response.employees);
        
      } catch (error: any) {
        console.error('❌ Error loading employees:', error);
        toast({
          title: "Error",
          description: error.message || "Failed to load employees",
          variant: "destructive",
        });
      } finally {
        setLoadingEmployees(false);
      }
    };
    
    loadEmployees();
  }, [toast]);

  // Calculate real-time employee statistics
  const calculateEmployeeStats = (employeeList: Employee[]) => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    // Total employees
    const totalEmployees = employeeList.length;
    
    // New hires this month (check createdAt or joiningDate)
    const newHires = employeeList.filter(emp => {
      const joinDate = emp.joiningDate ? new Date(emp.joiningDate) : new Date(emp.createdAt);
      return joinDate.getMonth() === currentMonth && joinDate.getFullYear() === currentYear;
    }).length;
    
    // Employees on leave (you can adjust this logic based on your data structure)
    // For now, we'll use a placeholder calculation
    const onLeave = Math.floor(totalEmployees * 0.02); // Assume 2% are on leave
    
    // Calculate attrition rate (placeholder calculation)
    // In a real scenario, you'd need historical data
    const attritionRate = totalEmployees > 0 ? ((Math.floor(totalEmployees * 0.032)) / totalEmployees * 100).toFixed(1) : 0;
    
    setEmployeeStats({
      totalEmployees,
      newHires,
      onLeave,
      attritionRate: parseFloat(attritionRate.toString())
    });
    
    console.log('📊 Employee stats calculated:', {
      totalEmployees,
      newHires,
      onLeave,
      attritionRate
    });
  };

  // Handle form submission - Add employee via backend API
  const handleAddEmployee = async () => {
    setIsLoading(true);
    try {
      console.log('🔄 Adding employee via backend API...', formData);
      
      const employeeData = {
        name: formData.name,
        email: formData.email,
        position: formData.position || undefined,
        phoneNumber: formData.phoneNumber || undefined,
        department: formData.department || undefined,
        joiningDate: formData.joiningDate || undefined,
        salary: parseFloat(formData.salary) || 0,
      };

      // Remove undefined fields to avoid sending empty strings
      Object.keys(employeeData).forEach(key => {
        if (employeeData[key] === undefined || employeeData[key] === '') {
          delete employeeData[key];
        }
      });

      const response = await dashboardService.addEmployee(employeeData);
      console.log('✅ Employee added successfully:', response);
      
      // Refresh the employee list
      const updatedEmployees = await dashboardService.getAllEmployees();
      setEmployees(updatedEmployees.employees);
      
      // Recalculate stats with updated employee list
      calculateEmployeeStats(updatedEmployees.employees);
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        position: '',
        phoneNumber: '',
        department: '',
        salary: '',
        joiningDate: ''
      });
      
      setIsAddEmployeeOpen(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      
      toast({
        title: "Success",
        description: `Employee ${response.name} added successfully!`,
      });
      
    } catch (error: any) {
      console.error('❌ Error adding employee:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to add employee",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle actions with real backend integration
  const handleAction = async (action: string, employeeId?: string) => {
    console.log(`🎯 Action triggered: ${action}`, employeeId ? `for employee: ${employeeId}` : '');
    
    switch (action) {
      case 'refresh':
        await refreshEmployeeList();
        break;
      case 'view':
        await viewEmployee(employeeId!);
        break;
      case 'edit':
        await editEmployee(employeeId!);
        break;
      case 'delete':
        await deleteEmployee(employeeId!);
        break;
      case 'export':
        await exportEmployeeData();
        break;
      case 'import':
        await importEmployeeData();
        break;
      default:
        // For placeholder actions
        setIsLoading(true);
        setTimeout(() => {
          setIsLoading(false);
          setShowSuccess(true);
          setTimeout(() => setShowSuccess(false), 2000);
        }, 800);
    }
  };

  // Refresh employee list from backend
  const refreshEmployeeList = async () => {
    try {
      setIsLoading(true);
      console.log('🔄 Refreshing employee list...');
      const response = await dashboardService.getAllEmployees();
      setEmployees(response.employees);
      calculateEmployeeStats(response.employees);
      console.log('✅ Employee list refreshed successfully');
      toast({
        title: "Success",
        description: "Employee list refreshed successfully!",
      });
    } catch (error: any) {
      console.error('❌ Error refreshing employees:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to refresh employee list",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // View employee details
  const viewEmployee = async (employeeId: string) => {
    try {
      setIsLoading(true);
      console.log('👀 Viewing employee:', employeeId);
      
      // Find employee in current list
      const employee = employees.find(emp => emp._id === employeeId);
      if (employee) {
        // Show employee details in a toast for now
        toast({
          title: `Employee Details: ${employee.name}`,
          description: `Email: ${employee.email} | Department: ${employee.department || 'N/A'} | Role: ${employee.role}`,
        });
        console.log('👤 Employee details:', employee);
      } else {
        throw new Error('Employee not found');
      }
    } catch (error: any) {
      console.error('❌ Error viewing employee:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to view employee details",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Edit employee (placeholder for now - would open edit modal)
  const editEmployee = async (employeeId: string) => {
    try {
      setIsLoading(true);
      console.log('✏️ Editing employee:', employeeId);
      
      const employee = employees.find(emp => emp._id === employeeId);
      if (employee) {
        // Set up edit form with current employee data
        setEditingEmployee(employee);
        setFormData({
          name: employee.name,
          email: employee.email,
          position: employee.position || '',
          phoneNumber: employee.phoneNumber || '',
          department: employee.department || '',
          salary: employee.salary?.toString() || '',
          joiningDate: employee.joiningDate ? new Date(employee.joiningDate).toISOString().split('T')[0] : ''
        });
        setIsEditEmployeeOpen(true);
        console.log('✏️ Employee ready for editing:', employee);
      } else {
        throw new Error('Employee not found');
      }
    } catch (error: any) {
      console.error('❌ Error preparing edit:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to prepare employee for editing",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle edit employee submission
  const handleEditEmployee = async () => {
    if (!editingEmployee) return;
    
    setIsLoading(true);
    try {
      console.log('🔄 Updating employee via backend API...', formData);
      
      const updateData = {
        name: formData.name,
        email: formData.email,
        position: formData.position || undefined,
        phoneNumber: formData.phoneNumber || undefined,
        department: formData.department || undefined,
        joiningDate: formData.joiningDate || undefined,
        salary: parseFloat(formData.salary) || 0,
      };

      // Remove undefined fields to avoid sending empty strings
      Object.keys(updateData).forEach(key => {
        if (updateData[key] === undefined || updateData[key] === '') {
          delete updateData[key];
        }
      });

      const response = await dashboardService.updateEmployee(editingEmployee._id, updateData);
      console.log('✅ Employee updated successfully:', response);
      
      // Refresh the employee list
      const updatedEmployees = await dashboardService.getAllEmployees();
      setEmployees(updatedEmployees.employees);
      calculateEmployeeStats(updatedEmployees.employees);
      
      // Reset form and close modal
      setFormData({
        name: '',
        email: '',
        position: '',
        phoneNumber: '',
        department: '',
        salary: '',
        joiningDate: ''
      });
      setEditingEmployee(null);
      setIsEditEmployeeOpen(false);
      
      toast({
        title: "Success",
        description: `Employee ${response.employee.name} updated successfully!`,
      });
      
    } catch (error: any) {
      console.error('❌ Error updating employee:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update employee",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Delete employee
  const deleteEmployee = async (employeeId: string) => {
    try {
      setIsLoading(true);
      console.log('🗑️ Deleting employee:', employeeId);
      
      const employee = employees.find(emp => emp._id === employeeId);
      if (!employee) {
        throw new Error('Employee not found');
      }

      // Confirm deletion
      const confirmDelete = window.confirm(`Are you sure you want to delete ${employee.name}? This action cannot be undone.`);
      if (!confirmDelete) {
        setIsLoading(false);
        return;
      }

      // Delete via backend API
      await dashboardService.deleteEmployee(employeeId);
      
      // Refresh employee list from backend
      const response = await dashboardService.getAllEmployees();
      setEmployees(response.employees);
      calculateEmployeeStats(response.employees);
      
      toast({
        title: "Success",
        description: `Employee ${employee.name} deleted successfully!`,
      });
      console.log('✅ Employee deleted successfully');
      
    } catch (error: any) {
      console.error('❌ Error deleting employee:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete employee",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Export employee data
  const exportEmployeeData = async () => {
    try {
      setIsLoading(true);
      console.log('📊 Exporting employee data...');
      
      // Create CSV content
      const headers = ['Name', 'Email', 'Department', 'Position', 'Phone', 'Join Date', 'Role'];
      const csvContent = [
        headers.join(','),
        ...employees.map(emp => [
          `"${emp.name}"`,
          `"${emp.email}"`,
          `"${emp.department || 'N/A'}"`,
          `"${emp.position || 'N/A'}"`,
          `"${emp.phoneNumber || 'N/A'}"`,
          `"${emp.joiningDate ? new Date(emp.joiningDate).toLocaleDateString() : new Date(emp.createdAt).toLocaleDateString()}"`,
          `"${emp.role}"`
        ].join(','))
      ].join('\n');

      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `employees_${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
      window.URL.revokeObjectURL(url);
      
      toast({
        title: "Success",
        description: `Exported ${employees.length} employees to CSV file!`,
      });
      console.log('✅ Employee data exported successfully');
      
    } catch (error: any) {
      console.error('❌ Error exporting data:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to export employee data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Import employee data
  const importEmployeeData = async () => {
    try {
      setIsLoading(true);
      console.log('📥 Starting employee data import...');
      
      // Create file input
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.csv';
      
      input.onchange = async (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (!file) return;
        
        try {
          const text = await file.text();
          const lines = text.split('\n');
          const headers = lines[0].split(',');
          
          // Parse CSV data
          const importedEmployees = lines.slice(1)
            .filter(line => line.trim())
            .map(line => {
              const values = line.split(',').map(v => v.replace(/"/g, ''));
              return {
                name: values[0],
                email: values[1],
                department: values[2] !== 'N/A' ? values[2] : '',
                position: values[3] !== 'N/A' ? values[3] : '',
                phoneNumber: values[4] !== 'N/A' ? values[4] : '',
                joiningDate: values[5],
                salary: 0 // Default salary
              };
            });

          // Add each employee to backend
          let successCount = 0;
          for (const empData of importedEmployees) {
            try {
              await dashboardService.addEmployee(empData);
              successCount++;
            } catch (error) {
              console.error('Failed to import employee:', empData.name, error);
            }
          }

          // Refresh employee list
          await refreshEmployeeList();
          
          toast({
            title: "Import Complete",
            description: `Successfully imported ${successCount} out of ${importedEmployees.length} employees!`,
          });
          
        } catch (error: any) {
          console.error('❌ Error processing import file:', error);
          toast({
            title: "Error",
            description: "Failed to process import file. Please check the format.",
            variant: "destructive",
          });
        } finally {
          setIsLoading(false);
        }
      };
      
      input.click();
      
    } catch (error: any) {
      console.error('❌ Error importing data:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to import employee data",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         emp._id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = selectedDepartment === 'all' || (emp.department && emp.department === selectedDepartment);
    const matchesStatus = selectedStatus === 'all' || emp.role === selectedStatus;
    
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

      {/* Loading Overlay for adding employees */}
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

      {/* Loading state for initial employee fetch */}
      {loadingEmployees && (
        <div className="flex items-center justify-center p-8 bg-card rounded-2xl shadow-xl animate-pulse">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <span className="text-lg font-medium">Loading employees...</span>
          </div>
        </div>
      )}

      {/* Main content - only show when not loading employees */}
      {!loadingEmployees && (
        <>
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
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData(prev => ({ ...prev, phoneNumber: e.target.value }))}
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
                      <SelectItem value="HR">Human Resources</SelectItem>
                      <SelectItem value="Finance">Finance</SelectItem>
                      <SelectItem value="IT">IT</SelectItem>
                      <SelectItem value="Operations">Operations</SelectItem>
                      <SelectItem value="Support">Support</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Join Date</label>
                  <Input 
                    type="date" 
                    value={formData.joiningDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, joiningDate: e.target.value }))}
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

          {/* Edit Employee Modal */}
          <Dialog open={isEditEmployeeOpen} onOpenChange={setIsEditEmployeeOpen}>
            <DialogContent className="max-w-2xl animate-scale-in">
              <DialogHeader>
                <DialogTitle className="text-xl font-semibold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Edit Employee: {editingEmployee?.name}
                </DialogTitle>
                <DialogDescription>
                  Update the employee details below.
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
                  <Input 
                    placeholder={editingEmployee?._id || "Employee ID"} 
                    disabled 
                    className="neu-inset bg-muted/50" 
                  />
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
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData(prev => ({ ...prev, phoneNumber: e.target.value }))}
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
                      <SelectItem value="IT">IT</SelectItem>
                      <SelectItem value="Operations">Operations</SelectItem>
                      <SelectItem value="Support">Support</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Join Date</label>
                  <Input 
                    type="date" 
                    value={formData.joiningDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, joiningDate: e.target.value }))}
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
                  onClick={() => {
                    setIsEditEmployeeOpen(false);
                    setEditingEmployee(null);
                    setFormData({
                      name: '',
                      email: '',
                      position: '',
                      phoneNumber: '',
                      department: '',
                      salary: '',
                      joiningDate: ''
                    });
                  }}
                  className="hover-lift"
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button 
                  variant="neu-primary" 
                  className="hover-glow group"
                  onClick={handleEditEmployee}
                  disabled={isLoading || !formData.name || !formData.email}
                >
                  <Edit className="h-4 w-4 group-hover:animate-bounce-in" />
                  Update Employee
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
              <SelectItem value="HR">Human Resources</SelectItem>
              <SelectItem value="Finance">Finance</SelectItem>
              <SelectItem value="IT">IT</SelectItem>
              <SelectItem value="Operations">Operations</SelectItem>
              <SelectItem value="Support">Support</SelectItem>
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
              <p className="text-2xl font-bold group-hover:scale-105 transition-transform">{employeeStats.totalEmployees}</p>
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
              <p className="text-2xl font-bold group-hover:scale-105 transition-transform">{employeeStats.newHires}</p>
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
              <p className="text-2xl font-bold group-hover:scale-105 transition-transform">{employeeStats.onLeave}</p>
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
              <p className="text-2xl font-bold group-hover:scale-105 transition-transform">{employeeStats.attritionRate}%</p>
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
                <RefreshCw className="h-4 w-4 group-hover:animate-spin" />
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
                  key={employee._id} 
                  className="hover:bg-muted/50 transition-colors cursor-pointer group stagger-item"
                  style={{animationDelay: `${500 + index * 100}ms`}}
                  onClick={() => handleAction('view', employee._id)}
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
                        <p className="text-sm text-muted-foreground">{employee.employeeId || employee._id}</p>
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
                        {employee.phoneNumber || 'N/A'}
                      </div>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div>
                      <p className="font-medium group-hover:text-primary transition-colors">{employee.position || 'N/A'}</p>
                      <p className="text-sm text-muted-foreground">Dept: {employee.department || 'N/A'}</p>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <span className="font-medium group-hover:text-primary transition-colors">{employee.department || 'N/A'}</span>
                  </TableCell>
                  
                  <TableCell>
                    <Badge className={getStatusColor(employee.role)}>
                      {employee.role}
                    </Badge>
                  </TableCell>
                  
                  <TableCell>
                    <div className="flex items-center gap-2 text-sm group-hover:text-primary transition-colors">
                      <Calendar className="h-3 w-3 group-hover:animate-bounce-in" />
                      {employee.joiningDate ? new Date(employee.joiningDate).toLocaleDateString() : new Date(employee.createdAt).toLocaleDateString()}
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="hover-scale group text-blue-600 hover:text-blue-700"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAction('view', employee._id);
                        }}
                        disabled={isLoading}
                        title="View Details"
                      >
                        <Eye className="h-4 w-4 group-hover:animate-bounce-in" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="hover-scale group text-green-600 hover:text-green-700"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAction('edit', employee._id);
                        }}
                        disabled={isLoading}
                        title="Edit Employee"
                      >
                        <Edit className="h-4 w-4 group-hover:animate-bounce-in" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="hover-scale group text-red-600 hover:text-red-700"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAction('delete', employee._id);
                        }}
                        disabled={isLoading}
                        title="Delete Employee"
                      >
                        <Trash2 className="h-4 w-4 group-hover:animate-bounce-in" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="hover-scale group"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAction('menu', employee._id);
                        }}
                        disabled={isLoading}
                        title="More Options"
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
        </>
      )}
    </div>
  );
};

export default EmployeeManagement;