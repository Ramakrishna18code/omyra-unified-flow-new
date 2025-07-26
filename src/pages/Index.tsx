import React, { useState } from 'react';
import Dashboard from '@/components/Dashboard';
import AuthLayout from '@/components/AuthLayout';

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<'admin' | 'hr' | 'manager' | 'employee' | 'intern'>('admin');

  const handleLogin = (role: string) => {
    setUserRole(role as typeof userRole);
    setIsAuthenticated(true);
  };

  if (!isAuthenticated) {
    return <AuthLayout onLogin={handleLogin} />;
  }

  return <Dashboard userRole={userRole} />;
};

export default Index;
