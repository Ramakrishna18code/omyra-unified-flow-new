import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  DollarSign, 
  Users, 
  Calendar, 
  Download,
  Eye,
  Edit2,
  Send,
  Search,
  Filter,
  Calculator,
  CreditCard,
  TrendingUp,
  FileText
} from 'lucide-react';

interface PayrollRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  position: string;
  baseSalary: number;
  allowances: number;
  deductions: number;
  netSalary: number;
  status: 'pending' | 'processed' | 'paid';
  payPeriod: string;
}

const PayrollManagement: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('2024-01');
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

  const payrollData: PayrollRecord[] = [
    {
      id: '1',
      employeeId: 'EMP001',
      employeeName: 'John Doe',
      position: 'Senior Developer',
      baseSalary: 8500,
      allowances: 1200,
      deductions: 980,
      netSalary: 8720,
      status: 'paid',
      payPeriod: '2024-01'
    },
    {
      id: '2',
      employeeId: 'EMP002',
      employeeName: 'Sarah Johnson',
      position: 'Marketing Manager',
      baseSalary: 7300,
      allowances: 1000,
      deductions: 750,
      netSalary: 7550,
      status: 'processed',
      payPeriod: '2024-01'
    },
    {
      id: '3',
      employeeId: 'EMP003',
      employeeName: 'Mike Wilson',
      position: 'Project Manager',
      baseSalary: 7500,
      allowances: 1000,
      deductions: 890,
      netSalary: 7610,
      status: 'pending',
      payPeriod: '2024-01'
    }
  ];

  const payrollStats = {
    totalPayroll: 156780,
    totalEmployees: 247,
    avgSalary: 6350,
    pendingPayments: 12,
    processedAmount: 89456
  };

  const getStatusColor = (status: PayrollRecord['status']) => {
    switch (status) {
      case 'paid': return 'bg-accent/10 text-accent border-accent/20';
      case 'processed': return 'bg-primary/10 text-primary border-primary/20';
      case 'pending': return 'bg-warning/10 text-warning border-warning/20';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Success Toast */}
      {showSuccess && (
        <div className="fixed top-20 right-6 z-50 bg-accent text-white px-6 py-3 rounded-lg shadow-lg animate-slide-in-down">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-white rounded-full"></div>
            Payroll action completed successfully!
          </div>
        </div>
      )}

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 flex items-center justify-center">
          <div className="bg-card p-8 rounded-2xl shadow-2xl animate-scale-in">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              <span className="text-lg font-medium">Processing payroll...</span>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 animate-fade-in-up">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Payroll Management
          </h1>
          <p className="text-muted-foreground">Manage employee salaries and compensation</p>
        </div>
        
        <div className="flex gap-3 animate-fade-in-right">
          <Button 
            variant="outline" 
            className="hover-lift group"
            onClick={() => handleAction('export')}
            disabled={isLoading}
          >
            <Download className="h-4 w-4 group-hover:animate-bounce-in" />
            Export Payroll
          </Button>
          <Button 
            variant="secondary" 
            className="hover-lift group"
            onClick={() => handleAction('calculate')}
            disabled={isLoading}
          >
            <Calculator className="h-4 w-4 group-hover:animate-bounce-in" />
            Run Payroll
          </Button>
          <Button 
            variant="neu-primary" 
            className="hover-glow group"
            onClick={() => handleAction('process')}
            disabled={isLoading}
          >
            <Send className="h-4 w-4 group-hover:animate-bounce-in" />
            Process Payments
          </Button>
        </div>
      </div>

      {/* Payroll Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 animate-fade-in-up" style={{animationDelay: '200ms'}}>
        <Card 
          className="neu-surface p-4 hover-lift group cursor-pointer stagger-item"
          onClick={() => handleAction('view-stats', 'total-payroll')}
        >
          <div className="flex items-center gap-3">
            <DollarSign className="h-8 w-8 text-primary group-hover:animate-floating" />
            <div>
              <p className="text-sm text-muted-foreground group-hover:text-primary transition-colors">Total Payroll</p>
              <p className="text-2xl font-bold group-hover:scale-105 transition-transform">{formatCurrency(payrollStats.totalPayroll)}</p>
            </div>
          </div>
        </Card>
        
        <Card 
          className="neu-surface p-4 hover-lift group cursor-pointer stagger-item"
          onClick={() => handleAction('view-stats', 'employees')}
        >
          <div className="flex items-center gap-3">
            <Users className="h-8 w-8 text-accent group-hover:animate-floating" />
            <div>
              <p className="text-sm text-muted-foreground group-hover:text-accent transition-colors">Employees</p>
              <p className="text-2xl font-bold group-hover:scale-105 transition-transform">{payrollStats.totalEmployees}</p>
            </div>
          </div>
        </Card>
        
        <Card 
          className="neu-surface p-4 hover-lift group cursor-pointer stagger-item"
          onClick={() => handleAction('view-stats', 'avg-salary')}
        >
          <div className="flex items-center gap-3">
            <TrendingUp className="h-8 w-8 text-warning group-hover:animate-floating" />
            <div>
              <p className="text-sm text-muted-foreground group-hover:text-warning transition-colors">Avg Salary</p>
              <p className="text-2xl font-bold group-hover:scale-105 transition-transform">{formatCurrency(payrollStats.avgSalary)}</p>
            </div>
          </div>
        </Card>
        
        <Card 
          className="neu-surface p-4 hover-lift group cursor-pointer stagger-item"
          onClick={() => handleAction('view-stats', 'pending')}
        >
          <div className="flex items-center gap-3">
            <CreditCard className="h-8 w-8 text-destructive group-hover:animate-floating" />
            <div>
              <p className="text-sm text-muted-foreground group-hover:text-destructive transition-colors">Pending</p>
              <p className="text-2xl font-bold group-hover:scale-105 transition-transform">{payrollStats.pendingPayments}</p>
            </div>
          </div>
        </Card>
        
        <Card 
          className="neu-surface p-4 hover-lift group cursor-pointer stagger-item"
          onClick={() => handleAction('view-stats', 'processed')}
        >
          <div className="flex items-center gap-3">
            <Calculator className="h-8 w-8 text-primary group-hover:animate-floating" />
            <div>
              <p className="text-sm text-muted-foreground group-hover:text-primary transition-colors">Processed</p>
              <p className="text-2xl font-bold group-hover:scale-105 transition-transform">{formatCurrency(payrollStats.processedAmount)}</p>
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
              type="month"
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="neu-inset hover-lift"
            />
            
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
        </div>
      </Card>

      {/* Payroll Table */}
      <Card className="neu-surface animate-fade-in-up" style={{animationDelay: '400ms'}}>
        <div className="p-6 border-b border-border/50">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Payroll Records</h3>
              <p className="text-sm text-muted-foreground">
                {payrollData.length} employees for {selectedPeriod}
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
                <Calculator className="h-4 w-4 group-hover:animate-spin" />
                Recalculate
              </Button>
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-border/50">
              <tr>
                <th className="text-left p-4 font-medium">Employee</th>
                <th className="text-left p-4 font-medium">Position</th>
                <th className="text-left p-4 font-medium">Base Salary</th>
                <th className="text-left p-4 font-medium">Allowances</th>
                <th className="text-left p-4 font-medium">Deductions</th>
                <th className="text-left p-4 font-medium">Net Salary</th>
                <th className="text-left p-4 font-medium">Status</th>
                <th className="text-left p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {payrollData.map((record, index) => (
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
                    <span className="font-medium group-hover:text-primary transition-colors">{record.position}</span>
                  </td>
                  <td className="p-4">
                    <span className="font-medium">{formatCurrency(record.baseSalary)}</span>
                  </td>
                  <td className="p-4">
                    <span className="text-accent font-medium">{formatCurrency(record.allowances)}</span>
                  </td>
                  <td className="p-4">
                    <span className="text-destructive font-medium">{formatCurrency(record.deductions)}</span>
                  </td>
                  <td className="p-4">
                    <span className="font-bold text-primary">{formatCurrency(record.netSalary)}</span>
                  </td>
                  <td className="p-4">
                    <Badge className={getStatusColor(record.status)}>
                      {record.status}
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
                          handleAction('view', record.id);
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
                          handleAction('download', record.id);
                        }}
                        disabled={isLoading}
                      >
                        <Download className="h-4 w-4 group-hover:animate-bounce-in" />
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
          onClick={() => handleAction('run-payroll')}
        >
          <div className="flex items-center gap-4">
            <Calculator className="h-12 w-12 text-primary group-hover:animate-floating" />
            <div>
              <h3 className="font-semibold group-hover:text-primary transition-colors">Run Payroll</h3>
              <p className="text-sm text-muted-foreground">Calculate salaries for current period</p>
            </div>
          </div>
        </Card>
        
        <Card 
          className="neu-surface p-6 hover-lift group cursor-pointer"
          onClick={() => handleAction('process-payments')}
        >
          <div className="flex items-center gap-4">
            <Send className="h-12 w-12 text-accent group-hover:animate-floating" />
            <div>
              <h3 className="font-semibold group-hover:text-accent transition-colors">Process Payments</h3>
              <p className="text-sm text-muted-foreground">Send payments to employees</p>
            </div>
          </div>
        </Card>
        
        <Card 
          className="neu-surface p-6 hover-lift group cursor-pointer"
          onClick={() => handleAction('generate-reports')}
        >
          <div className="flex items-center gap-4">
            <FileText className="h-12 w-12 text-warning group-hover:animate-floating" />
            <div>
              <h3 className="font-semibold group-hover:text-warning transition-colors">Generate Reports</h3>
              <p className="text-sm text-muted-foreground">Create payroll summaries</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default PayrollManagement;
