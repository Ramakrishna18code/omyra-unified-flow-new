import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService, type Employee, type Project, type ProjectCreateData } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

// Auth hooks
export const useLogin = () => {
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: apiService.login,
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Logged in successfully!",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error", 
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useRegister = () => {
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: apiService.register,
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Account created successfully! Please login.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

// Employee hooks
export const useEmployees = () => {
  return useQuery({
    queryKey: ['employees'],
    queryFn: apiService.getAllEmployees,
    enabled: apiService.isAuthenticated(),
  });
};

export const useAddEmployee = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: apiService.addEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      toast({
        title: "Success",
        description: "Employee added successfully!",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useAdminDashboard = () => {
  return useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: apiService.getAdminDashboard,
    enabled: apiService.isAuthenticated(),
  });
};

export const useEmployeeDashboard = () => {
  return useQuery({
    queryKey: ['employee-dashboard'],
    queryFn: apiService.getEmployeeDashboard,
    enabled: apiService.isAuthenticated(),
  });
};

// Project hooks
export const useProjects = () => {
  return useQuery({
    queryKey: ['projects'],
    queryFn: apiService.getProjects,
    enabled: apiService.isAuthenticated(),
  });
};

export const useCreateProject = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: apiService.createProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast({
        title: "Success",
        description: "Project created successfully!",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useUpdateProject = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ProjectCreateData> }) => 
      apiService.updateProject(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast({
        title: "Success",
        description: "Project updated successfully!",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};
