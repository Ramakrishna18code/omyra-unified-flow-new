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
  Send,
  Search,
  Filter,
  Calculator,
  FileText,
  CreditCard,
  TrendingUp
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
      position: 'UI Designer',
      baseSalary: 6500,
      allowances: 800,
      deductions: 750,
      netSalary: 6550,
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Payroll Management</h1>
          <p className="text-muted-foreground">Manage employee salaries and compensation</p>
        </div>
        
        <div className="flex gap-3">
          <Button variant="outline">
            <Download className="h-4 w-4" />
            Export Payroll
          </Button>
          <Button variant="secondary">
            <Calculator className="h-4 w-4" />
            Run Payroll
          </Button>
          <Button variant="neu-primary">
            <Send className="h-4 w-4" />
            Process Payments
          </Button>
        </div>
      </div>

      {/* Payroll Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="neu-surface p-4">
          <div className="flex items-center gap-3">
            <DollarSign className="h-8 w-8 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Total Payroll</p>
              <p className="text-2xl font-bold">{formatCurrency(payrollStats.totalPayroll)}</p>
            </div>
          </div>
        </Card>
        
        <Card className="neu-surface p-4">
          <div className="flex items-center gap-3">
            <Users className="h-8 w-8 text-accent" />
            <div>
              <p className="text-sm text-muted-foreground">Employees</p>
              <p className="text-2xl font-bold">{payrollStats.totalEmployees}</p>
            </div>
          </div>
        </Card>
        
        <Card className="neu-surface p-4">
          <div className="flex items-center gap-3">
            <TrendingUp className="h-8 w-8 text-warning" />
            <div>
              <p className="text-sm text-muted-foreground">Avg Salary</p>
              <p className="text-2xl font-bold">{formatCurrency(payrollStats.avgSalary)}</p>
            </div>
          </div>
        </Card>
        
        <Card className="neu-surface p-4">
          <div className="flex items-center gap-3">
            <CreditCard className="h-8 w-8 text-destructive" />
            <div>
              <p className="text-sm text-muted-foreground">Pending</p>
              <p className="text-2xl font-bold">{payrollStats.pendingPayments}</p>
            </div>
          </div>
        </Card>
        
        <Card className="neu-surface p-4">
          <div className="flex items-center gap-3">
            <Calculator className="h-8 w-8 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Processed</p>
              <p className="text-2xl font-bold">{formatCurrency(payrollStats.processedAmount)}</p>
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
              type="month"
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="neu-inset border-0 bg-muted/30"
            />
            
            <Button variant="outline">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
          </div>
        </div>
      </Card>

      {/* Payroll Table */}
      <Card className="neu-surface">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold">Payroll Details</h3>
            <Badge variant="outline">
              {new Date(selectedPeriod).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long' 
              })}
            </Badge>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-left p-4 font-medium text-muted-foreground">Employee</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Position</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Base Salary</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Allowances</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Deductions</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Net Salary</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Status</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {payrollData
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
                        <span className="text-sm">{record.position}</span>
                      </td>
                      <td className="p-4">
                        <span className="font-medium">{formatCurrency(record.baseSalary)}</span>
                      </td>
                      <td className="p-4">
                        <span className="text-accent font-medium">+{formatCurrency(record.allowances)}</span>
                      </td>
                      <td className="p-4">
                        <span className="text-destructive font-medium">-{formatCurrency(record.deductions)}</span>
                      </td>
                      <td className="p-4">
                        <span className="font-bold text-lg">{formatCurrency(record.netSalary)}</span>
                      </td>
                      <td className="p-4">
                        <Badge className={`${getStatusColor(record.status)} flex items-center gap-1 w-fit`}>
                          <span className="capitalize">{record.status}</span>
                        </Badge>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <FileText className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="neu-surface p-6 hover:scale-105 transition-transform">
          <div className="flex items-center gap-4">
            <Calculator className="h-12 w-12 text-primary" />
            <div>
              <h3 className="font-semibold">Calculate Salary</h3>
              <p className="text-sm text-muted-foreground">Compute employee compensation</p>
            </div>
          </div>
        </Card>
        
        <Card className="neu-surface p-6 hover:scale-105 transition-transform">
          <div className="flex items-center gap-4">
            <FileText className="h-12 w-12 text-accent" />
            <div>
              <h3 className="font-semibold">Generate Payslips</h3>
              <p className="text-sm text-muted-foreground">Create detailed pay statements</p>
            </div>
          </div>
        </Card>
        
        <Card className="neu-surface p-6 hover:scale-105 transition-transform">
          <div className="flex items-center gap-4">
            <CreditCard className="h-12 w-12 text-warning" />
            <div>
              <h3 className="font-semibold">Process Payments</h3>
              <p className="text-sm text-muted-foreground">Execute salary transfers</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default PayrollManagement;