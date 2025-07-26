import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  MoreVertical,
  User
} from 'lucide-react';

interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  location: string;
  joinDate: string;
  status: 'active' | 'on-leave' | 'inactive';
  avatar?: string;
}

interface EmployeeCardProps {
  employee: Employee;
  onEdit?: (employee: Employee) => void;
  onView?: (employee: Employee) => void;
}

const EmployeeCard: React.FC<EmployeeCardProps> = ({ 
  employee, 
  onEdit, 
  onView 
}) => {
  const getStatusColor = (status: Employee['status']) => {
    switch (status) {
      case 'active': return 'bg-accent';
      case 'on-leave': return 'bg-warning';
      case 'inactive': return 'bg-muted';
      default: return 'bg-muted';
    }
  };

  return (
    <Card className="neu-surface p-6 hover:scale-105 transition-all duration-200 group">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            {employee.avatar ? (
              <img 
                src={employee.avatar} 
                alt={employee.name}
                className="h-12 w-12 rounded-full object-cover"
              />
            ) : (
              <div className="h-12 w-12 rounded-full bg-primary-gradient flex items-center justify-center">
                <User className="h-6 w-6 text-primary-foreground" />
              </div>
            )}
            <div className={`absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-card ${getStatusColor(employee.status)}`}></div>
          </div>
          
          <div>
            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
              {employee.name}
            </h3>
            <p className="text-sm text-muted-foreground">{employee.position}</p>
          </div>
        </div>

        <Button variant="ghost" size="icon-sm">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </div>

      {/* Department Badge */}
      <Badge variant="outline" className="mb-4">
        {employee.department}
      </Badge>

      {/* Contact Info */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Mail className="h-4 w-4" />
          <span className="truncate">{employee.email}</span>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Phone className="h-4 w-4" />
          <span>{employee.phone}</span>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4" />
          <span>{employee.location}</span>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>Joined {employee.joinDate}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          className="flex-1"
          onClick={() => onView?.(employee)}
        >
          View Profile
        </Button>
        <Button 
          variant="neu" 
          size="sm" 
          className="flex-1"
          onClick={() => onEdit?.(employee)}
        >
          Edit
        </Button>
      </div>
    </Card>
  );
};

export default EmployeeCard;