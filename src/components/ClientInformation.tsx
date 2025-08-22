import React from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';

interface ClientProject {
  id: number;
  name: string;
  totalAmount: number;
  paidAmount: number;
  status: 'active' | 'completed' | 'on-hold';
  dueDate: string;
}

const ClientInformation: React.FC = () => {
  // Sample data - replace with actual data from your backend
  const clientProjects: ClientProject[] = [
    {
      id: 1,
      name: 'HR Portal Redesign',
      totalAmount: 50000,
      paidAmount: 30000,
      status: 'active',
      dueDate: '2025-12-31',
    },
    {
      id: 2,
      name: 'Payroll Automation',
      totalAmount: 30000,
      paidAmount: 30000,
      status: 'completed',
      dueDate: '2025-08-15',
    },
    {
      id: 3,
      name: 'Mobile App Development',
      totalAmount: 70000,
      paidAmount: 35000,
      status: 'active',
      dueDate: '2026-01-31',
    },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getProgressColor = (paidAmount: number, totalAmount: number) => {
    const percentage = (paidAmount / totalAmount) * 100;
    if (percentage === 100) return 'bg-green-500';
    if (percentage >= 75) return 'bg-blue-500';
    if (percentage >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between backdrop-blur-sm bg-white/30 dark:bg-gray-800/30 p-6 rounded-xl border border-gray-200/20 shadow-lg">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Client Projects & Payments
          </h2>
          <p className="text-muted-foreground text-sm">Track project finances and progress</p>
        </div>
        <Badge variant="outline" className="px-4 py-1.5 backdrop-blur-sm bg-primary/5">
          Total Projects: {clientProjects.length}
        </Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {clientProjects.map((project) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="group relative overflow-hidden backdrop-blur-md bg-white/40 dark:bg-gray-800/40 border-gray-200/20 dark:border-gray-700/20 hover:bg-white/60 dark:hover:bg-gray-800/60 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-lg text-primary/90 dark:text-primary/70">{project.name}</h3>
                  <Badge variant="outline" className={`px-3 py-1 backdrop-blur-sm ${
                    project.status === 'completed' ? 'bg-green-500/10 text-green-600 border-green-200/30' :
                    project.status === 'active' ? 'bg-blue-500/10 text-blue-600 border-blue-200/30' :
                    'bg-yellow-500/10 text-yellow-600 border-yellow-200/30'
                  }`}>
                    {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                  </Badge>
                </div>

              <div className="space-y-3">
                <div className="mt-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Payment Progress</span>
                    <span className="font-medium">{Math.round((project.paidAmount / project.totalAmount) * 100)}%</span>
                  </div>
                  <div className="relative">
                    <Progress
                      value={(project.paidAmount / project.totalAmount) * 100}
                      className="h-2 bg-gray-100 dark:bg-gray-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-50" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6 mt-4">
                  <div className="space-y-1.5">
                    <p className="text-xs text-muted-foreground">Total Amount</p>
                    <p className="font-semibold text-primary/90">{formatCurrency(project.totalAmount)}</p>
                  </div>
                  <div className="space-y-1.5">
                    <p className="text-xs text-muted-foreground">Paid Amount</p>
                    <p className="font-semibold text-green-600 dark:text-green-400">{formatCurrency(project.paidAmount)}</p>
                  </div>
                </div>

                <div className="space-y-1.5 bg-red-50/30 dark:bg-red-900/10 p-3 rounded-lg backdrop-blur-sm">
                  <p className="text-xs text-muted-foreground">Pending Amount</p>
                  <p className="font-semibold text-red-600 dark:text-red-400">
                    {formatCurrency(project.totalAmount - project.paidAmount)}
                  </p>
                </div>

                <div className="flex items-center justify-between mt-2 pt-3 border-t border-gray-200/20">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Due Date</p>
                    <p className="font-medium text-sm">
                      {new Date(project.dueDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                  <Badge variant="secondary" className="bg-primary/5 hover:bg-primary/10">
                    {Math.ceil((new Date(project.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days left
                  </Badge>
                </div>
              </div>
            </div>
          </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ClientInformation;
