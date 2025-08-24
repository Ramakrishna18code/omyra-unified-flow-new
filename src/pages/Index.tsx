import React, { useState, useEffect } from 'react';
import Dashboard from '@/components/Dashboard';
import AuthLayout from '@/components/AuthLayout';
import { apiService } from '@/services/api';

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState<'admin' | 'hr' | 'manager' | 'employee' | 'intern'>('employee');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already authenticated
    const checkAuth = async () => {
      if (apiService.isAuthenticated()) {
        try {
          const userData = await apiService.getMe();
          setUser(userData.user);
          setUserRole(userData.user.role);
          setIsAuthenticated(true);
        } catch (error) {
          // Token might be expired, logout
          apiService.logout();
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const handleLogin = (role: string, userData: any) => {
    setUserRole(role as typeof userRole);
    setUser(userData);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    apiService.logout();
    setIsAuthenticated(false);
    setUser(null);
    setUserRole('employee');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AuthLayout onLogin={handleLogin} />;
  }

  return <Dashboard userRole={userRole} user={user} onLogout={handleLogout} />;
};

export default Index;
