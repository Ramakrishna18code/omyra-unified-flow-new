import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Plus, X } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { type ProjectCreateData, type Employee } from '@/services/api';

interface ProjectFormProps {
  formData: Partial<ProjectCreateData>;
  setFormData: React.Dispatch<React.SetStateAction<Partial<ProjectCreateData>>>;
  employees: Employee[];
  onSubmit: () => void;
  onCancel: () => void;
  isEditing: boolean;
}

const ProjectForm: React.FC<ProjectFormProps> = ({
  formData,
  setFormData,
  employees,
  onSubmit,
  onCancel,
  isEditing
}) => {
  const [startDate, setStartDate] = useState<Date | undefined>(
    formData.startDate ? new Date(formData.startDate) : undefined
  );
  const [endDate, setEndDate] = useState<Date | undefined>(
    formData.endDate ? new Date(formData.endDate) : undefined
  );

  const updateFormData = (field: string, value: any) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof typeof prev] as any),
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const addTeamMember = () => {
    const newMember = {
      employee: '',
      role: 'developer',
      allocation: [{ date: new Date().toISOString(), amount: 0 }]
    };
    
    setFormData(prev => ({
      ...prev,
      team: [...(prev.team || []), newMember]
    }));
  };

  const removeTeamMember = (index: number) => {
    setFormData(prev => ({
      ...prev,
      team: prev.team?.filter((_, i) => i !== index) || []
    }));
  };

  const updateTeamMember = (index: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      team: prev.team?.map((member, i) => 
        i === index 
          ? field === 'allocation' 
            ? { ...member, allocation: [{ date: new Date().toISOString(), amount: value }] }
            : { ...member, [field]: value }
          : member
      ) || []
    }));
  };

  const addExpense = () => {
    const newExpense = {
      description: '',
      amount: 0,
      category: 'other'
    };
    
    setFormData(prev => ({
      ...prev,
      expenses: [...(prev.expenses || []), newExpense]
    }));
  };

  const removeExpense = (index: number) => {
    setFormData(prev => ({
      ...prev,
      expenses: prev.expenses?.filter((_, i) => i !== index) || []
    }));
  };

  const updateExpense = (index: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      expenses: prev.expenses?.map((expense, i) => 
        i === index ? { ...expense, [field]: value } : expense
      ) || []
    }));
  };

  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Project Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Project Name *</Label>
              <Input
                id="name"
                value={formData.name || ''}
                onChange={(e) => updateFormData('name', e.target.value)}
                placeholder="Enter project name"
              />
            </div>
            
            <div>
              <Label htmlFor="project_value">Project Value *</Label>
              <Input
                id="project_value"
                type="number"
                value={formData.project_value || ''}
                onChange={(e) => updateFormData('project_value', parseFloat(e.target.value) || 0)}
                placeholder="Enter project value"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description || ''}
              onChange={(e) => updateFormData('description', e.target.value)}
              placeholder="Enter project description"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => updateFormData('status', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="planning">Planning</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="on-hold">On Hold</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="priority">Priority</Label>
              <Select value={formData.priority} onValueChange={(value) => updateFormData('priority', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="payment_type">Payment Type</Label>
              <Select value={formData.payment_type} onValueChange={(value) => updateFormData('payment_type', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select payment type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="one-time">One-time</SelectItem>
                  <SelectItem value="recurring">Recurring</SelectItem>
                  <SelectItem value="milestone">Milestone</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="payment_terms">Payment Terms</Label>
            <Input
              id="payment_terms"
              value={formData.payment_terms || ''}
              onChange={(e) => updateFormData('payment_terms', e.target.value)}
              placeholder="e.g., 30% upfront, 40% at milestone, 30% completion"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Start Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !startDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={(date) => {
                      setStartDate(date);
                      updateFormData('startDate', date?.toISOString() || '');
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <Label>End Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !endDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={(date) => {
                      setEndDate(date);
                      updateFormData('endDate', date?.toISOString() || '');
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Client Information */}
      <Card>
        <CardHeader>
          <CardTitle>Client Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="client_name">Client Name</Label>
              <Input
                id="client_name"
                value={formData.client?.name || ''}
                onChange={(e) => updateFormData('client.name', e.target.value)}
                placeholder="Enter client name"
              />
            </div>

            <div>
              <Label htmlFor="client_email">Client Email</Label>
              <Input
                id="client_email"
                type="email"
                value={formData.client?.email || ''}
                onChange={(e) => updateFormData('client.email', e.target.value)}
                placeholder="Enter client email"
              />
            </div>

            <div>
              <Label htmlFor="client_company">Company</Label>
              <Input
                id="client_company"
                value={formData.client?.company || ''}
                onChange={(e) => updateFormData('client.company', e.target.value)}
                placeholder="Enter company name"
              />
            </div>

            <div>
              <Label htmlFor="client_phone">Phone Number</Label>
              <Input
                id="client_phone"
                value={formData.client?.phone || ''}
                onChange={(e) => updateFormData('client.phone', e.target.value)}
                placeholder="Enter phone number"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Team Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Team Members
            <Button type="button" variant="outline" size="sm" onClick={addTeamMember}>
              <Plus className="w-4 h-4 mr-2" />
              Add Member
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {formData.team?.map((member, index) => (
            <div key={index} className="p-4 border rounded-lg">
              <div className="flex items-start justify-between mb-4">
                <h4 className="font-medium">Team Member {index + 1}</h4>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeTeamMember(index)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label>Employee</Label>
                  <Select 
                    value={member.employee} 
                    onValueChange={(value) => updateTeamMember(index, 'employee', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select employee" />
                    </SelectTrigger>
                    <SelectContent>
                      {employees.map((emp) => (
                        <SelectItem key={emp._id} value={emp._id}>
                          {emp.name} - {emp.department}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Role</Label>
                  <Select 
                    value={member.role} 
                    onValueChange={(value) => updateTeamMember(index, 'role', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="project-manager">Project Manager</SelectItem>
                      <SelectItem value="developer">Developer</SelectItem>
                      <SelectItem value="designer">Designer</SelectItem>
                      <SelectItem value="tester">Tester</SelectItem>
                      <SelectItem value="analyst">Analyst</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Allocation Amount</Label>
                  <Input
                    type="number"
                    value={member.allocation?.[0]?.amount || ''}
                    onChange={(e) => updateTeamMember(index, 'allocation', parseFloat(e.target.value) || 0)}
                    placeholder="Enter allocation"
                  />
                </div>
              </div>
            </div>
          ))}

          {(!formData.team || formData.team.length === 0) && (
            <div className="text-center text-gray-500 py-8">
              No team members added yet. Click "Add Member" to start building your team.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Expenses */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Project Expenses
            <Button type="button" variant="outline" size="sm" onClick={addExpense}>
              <Plus className="w-4 h-4 mr-2" />
              Add Expense
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {formData.expenses?.map((expense, index) => (
            <div key={index} className="p-4 border rounded-lg">
              <div className="flex items-start justify-between mb-4">
                <h4 className="font-medium">Expense {index + 1}</h4>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeExpense(index)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label>Description</Label>
                  <Input
                    value={expense.description}
                    onChange={(e) => updateExpense(index, 'description', e.target.value)}
                    placeholder="Enter expense description"
                  />
                </div>

                <div>
                  <Label>Amount</Label>
                  <Input
                    type="number"
                    value={expense.amount}
                    onChange={(e) => updateExpense(index, 'amount', parseFloat(e.target.value) || 0)}
                    placeholder="Enter amount"
                  />
                </div>

                <div>
                  <Label>Category</Label>
                  <Select 
                    value={expense.category} 
                    onValueChange={(value) => updateExpense(index, 'category', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="travel">Travel</SelectItem>
                      <SelectItem value="equipment">Equipment</SelectItem>
                      <SelectItem value="software">Software</SelectItem>
                      <SelectItem value="training">Training</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          ))}

          {(!formData.expenses || formData.expenses.length === 0) && (
            <div className="text-center text-gray-500 py-8">
              No expenses added yet. Click "Add Expense" to track project costs.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Form Actions */}
      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="button" onClick={onSubmit}>
          {isEditing ? 'Update Project' : 'Create Project'}
        </Button>
      </div>
    </div>
  );
};

export default ProjectForm;
