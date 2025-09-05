const API_BASE_URL = 'http://localhost:5000/api';
import ErrorLogger from '../utils/errorLogger';

// Types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role?: string;
}

export interface Employee {
  _id: string;
  name: string;
  email: string;
  department: string;
  position: string;
  employeeId: string;
  salary: number;
  joiningDate: string;
}

// Complete Project Management Types
export interface TeamMember {
  _id: string;
  employee: {
    _id: string;
    name: string;
    email: string;
    department: string;
    position?: string;
  };
  role: 'project-manager' | 'developer' | 'designer' | 'tester' | 'analyst' | 'other';
  allocation: Array<{
    _id: string;
    date: string;
    amount: number;
  }>;
}

export interface Expense {
  _id: string;
  description: string;
  amount: number;
  category: 'travel' | 'equipment' | 'software' | 'training' | 'other';
  date: string;
}

export interface Milestone {
  _id: string;
  title: string;
  description: string;
  dueDate: string;
  completedDate?: string;
  status: 'pending' | 'in-progress' | 'completed' | 'overdue';
}

export interface Client {
  name: string;
  email: string;
  company: string;
  phone: string;
}

export interface Project {
  _id: string;
  name: string;
  project_value: number;
  status: 'planning' | 'active' | 'completed' | 'on-hold' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  payment_type: 'one-time' | 'recurring' | 'milestone' | 'custom';
  payment_terms: string;
  startDate: string;
  endDate: string;
  actualEndDate?: string;
  client: Client;
  team: TeamMember[];
  expenses: Expense[];
  milestones: Milestone[];
  profit: number;
  progress: number;
  isOverdue: boolean;
  duration: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectCreateData {
  name: string;
  project_value: number;
  description: string;
  status?: string;
  priority?: string;
  payment_type?: string;
  payment_terms?: string;
  startDate: string;
  endDate: string;
  client: Client;
  team: Array<{
    employee: string;
    role: string;
    allocation: Array<{
      date: string;
      amount: number;
    }>;
  }>;
  expenses?: Array<{
    description: string;
    amount: number;
    category: string;
  }>;
}

export interface ProjectAnalytics {
  projectId: string;
  projectName: string;
  status: string;
  priority: string;
  progress: number;
  isOverdue: boolean;
  duration: number;
  budget: number;
  totalAllocation: number;
  totalExpenses: number;
  profit: number;
  profitMargin: string;
  teamSize: number;
  milestonesCompleted: number;
  totalMilestones: number;
  startDate: string;
  endDate: string;
  actualEndDate?: string;
}

export interface ProfitsSummary {
  totalProjects: number;
  totalBudget: number;
  totalAllocations: number;
  totalExpenses: number;
  totalProfit: number;
  profitMargin: string;
}

// API Service Class
class ApiService {
  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  private async handleResponse(response: Response, url: string, method: string) {
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Something went wrong' }));
      
      // Log API error to console
      ErrorLogger.logApiError(url, method, response.status, error);
      
      throw new Error(error.message || 'Request failed');
    }
    
    // Log successful API call
    console.log(`✅ [${new Date().toISOString()}] ${method} ${url} - Success (${response.status})`);
    
    return response.json();
  }

  // Auth APIs
  async login(credentials: LoginCredentials) {
    const url = `${API_BASE_URL}/auth/login`;
    try {
      console.log(`🔄 [${new Date().toISOString()}] POST ${url}`, { email: credentials.email });
      
      const response = await fetch(url, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(credentials),
      });
      
      const data = await this.handleResponse(response, url, 'POST');
      
      if (data.token) {
        localStorage.setItem('token', data.token);
        // Handle both flat structure (admin) and nested structure (employees)
        const user = data.user || data; // Use data.user if exists, otherwise use data itself
        localStorage.setItem('user', JSON.stringify(user));
        console.log(`✅ Login successful for user: ${user.email || user.name}`);
      }
      
      return data;
    } catch (error) {
      ErrorLogger.logNetworkError(url, 'POST', error as Error);
      throw error;
    }
  }

  async register(userData: RegisterData) {
    const url = `${API_BASE_URL}/auth/signup`;
    try {
      console.log(`🔄 [${new Date().toISOString()}] POST ${url}`, { email: userData.email });
      
      const response = await fetch(url, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(userData),
      });
      
      return this.handleResponse(response, url, 'POST');
    } catch (error) {
      ErrorLogger.logNetworkError(url, 'POST', error as Error);
      throw error;
    }
  }

  async getMe() {
    const url = `${API_BASE_URL}/auth/me`;
    try {
      console.log(`🔄 [${new Date().toISOString()}] GET ${url}`);
      
      const response = await fetch(url, {
        headers: this.getAuthHeaders(),
      });
      
      return this.handleResponse(response, url, 'GET');
    } catch (error) {
      ErrorLogger.logNetworkError(url, 'GET', error as Error);
      throw error;
    }
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  // Employee APIs
  async getAdminDashboard() {
    const url = `${API_BASE_URL}/dashboard/admin`;
    try {
      console.log(`🔄 [${new Date().toISOString()}] GET ${url}`);
      
      const response = await fetch(url, {
        headers: this.getAuthHeaders(),
      });
      
      return this.handleResponse(response, url, 'GET');
    } catch (error) {
      ErrorLogger.logNetworkError(url, 'GET', error as Error);
      throw error;
    }
  }

  async getEmployeeDashboard() {
    const url = `${API_BASE_URL}/dashboard/employee`;
    try {
      console.log(`🔄 [${new Date().toISOString()}] GET ${url}`);
      
      const response = await fetch(url, {
        headers: this.getAuthHeaders(),
      });
      
      return this.handleResponse(response, url, 'GET');
    } catch (error) {
      ErrorLogger.logNetworkError(url, 'GET', error as Error);
      throw error;
    }
  }

  async getAllEmployees(): Promise<Employee[]> {
    const url = `${API_BASE_URL}/dashboard/admin/employees`;
    try {
      console.log(`🔄 [${new Date().toISOString()}] GET ${url}`);
      
      const response = await fetch(url, {
        headers: this.getAuthHeaders(),
      });
      
      const data = await this.handleResponse(response, url, 'GET');
      return data.employees || [];
    } catch (error) {
      ErrorLogger.logNetworkError(url, 'GET', error as Error);
      throw error;
    }
  }

  async addEmployee(employeeData: Partial<Employee>) {
    const url = `${API_BASE_URL}/dashboard/admin/add_employee`;
    try {
      console.log(`🔄 [${new Date().toISOString()}] POST ${url}`, employeeData);
      
      const response = await fetch(url, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(employeeData),
      });
      
      return this.handleResponse(response, url, 'POST');
    } catch (error) {
      ErrorLogger.logNetworkError(url, 'POST', error as Error);
      throw error;
    }
  }

  // Complete Project Management APIs
  async getProjects(): Promise<{ count: number; projects: Project[] }> {
    const url = `${API_BASE_URL}/projects`;
    try {
      console.log(`🔄 [${new Date().toISOString()}] GET ${url}`);
      
      const response = await fetch(url, {
        headers: this.getAuthHeaders(),
      });
      
      return this.handleResponse(response, url, 'GET');
    } catch (error) {
      ErrorLogger.logNetworkError(url, 'GET', error as Error);
      throw error;
    }
  }

  async getProject(projectId: string): Promise<Project> {
    const url = `${API_BASE_URL}/projects/${projectId}`;
    try {
      console.log(`🔄 [${new Date().toISOString()}] GET ${url}`);
      
      const response = await fetch(url, {
        headers: this.getAuthHeaders(),
      });
      
      const data = await this.handleResponse(response, url, 'GET');
      return data.project;
    } catch (error) {
      ErrorLogger.logNetworkError(url, 'GET', error as Error);
      throw error;
    }
  }

  async createProject(projectData: ProjectCreateData): Promise<Project> {
    const url = `${API_BASE_URL}/projects`;
    try {
      console.log(`🔄 [${new Date().toISOString()}] POST ${url}`, projectData);
      
      const response = await fetch(url, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(projectData),
      });
      
      const data = await this.handleResponse(response, url, 'POST');
      return data.project;
    } catch (error) {
      ErrorLogger.logNetworkError(url, 'POST', error as Error);
      throw error;
    }
  }

  async updateProject(projectId: string, updateData: Partial<ProjectCreateData>): Promise<Project> {
    const url = `${API_BASE_URL}/projects/${projectId}`;
    try {
      console.log(`🔄 [${new Date().toISOString()}] PUT ${url}`, updateData);
      
      const response = await fetch(url, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(updateData),
      });
      
      const data = await this.handleResponse(response, url, 'PUT');
      return data.project;
    } catch (error) {
      ErrorLogger.logNetworkError(url, 'PUT', error as Error);
      throw error;
    }
  }

  async deleteProject(projectId: string): Promise<void> {
    const url = `${API_BASE_URL}/projects/${projectId}`;
    try {
      console.log(`🔄 [${new Date().toISOString()}] DELETE ${url}`);
      
      const response = await fetch(url, {
        method: 'DELETE',
        headers: this.getAuthHeaders(),
      });
      
      await this.handleResponse(response, url, 'DELETE');
    } catch (error) {
      ErrorLogger.logNetworkError(url, 'DELETE', error as Error);
      throw error;
    }
  }

  async getProjectAnalytics(projectId: string): Promise<ProjectAnalytics> {
    const url = `${API_BASE_URL}/projects/${projectId}/analytics`;
    try {
      console.log(`🔄 [${new Date().toISOString()}] GET ${url}`);
      
      const response = await fetch(url, {
        headers: this.getAuthHeaders(),
      });
      
      const data = await this.handleResponse(response, url, 'GET');
      return data.analytics;
    } catch (error) {
      ErrorLogger.logNetworkError(url, 'GET', error as Error);
      throw error;
    }
  }

  async getTotalProfits(): Promise<{ summary: ProfitsSummary; projectDetails: Project[] }> {
    const url = `${API_BASE_URL}/projects/profits/total`;
    try {
      console.log(`🔄 [${new Date().toISOString()}] GET ${url}`);
      
      const response = await fetch(url, {
        headers: this.getAuthHeaders(),
      });
      
      const data = await this.handleResponse(response, url, 'GET');
      return {
        summary: data.summary,
        projectDetails: data.projectDetails
      };
    } catch (error) {
      ErrorLogger.logNetworkError(url, 'GET', error as Error);
      throw error;
    }
  }

  // Team Management APIs
  async addTeamMember(projectId: string, memberData: { employeeId: string; role: string; allocation: number }): Promise<Project> {
    const url = `${API_BASE_URL}/projects/${projectId}/team`;
    try {
      console.log(`🔄 [${new Date().toISOString()}] POST ${url}`, memberData);
      
      const response = await fetch(url, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(memberData),
      });
      
      const data = await this.handleResponse(response, url, 'POST');
      return data.project;
    } catch (error) {
      ErrorLogger.logNetworkError(url, 'POST', error as Error);
      throw error;
    }
  }

  async removeTeamMember(projectId: string, employeeId: string): Promise<Project> {
    const url = `${API_BASE_URL}/projects/${projectId}/team`;
    try {
      console.log(`🔄 [${new Date().toISOString()}] DELETE ${url}`, { employeeId });
      
      const response = await fetch(url, {
        method: 'DELETE',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ employeeId }),
      });
      
      const data = await this.handleResponse(response, url, 'DELETE');
      return data.project;
    } catch (error) {
      ErrorLogger.logNetworkError(url, 'DELETE', error as Error);
      throw error;
    }
  }

  // Project Analytics APIs
  async getAllProjectAnalytics(): Promise<{ analytics: ProjectAnalytics[]; summary: ProfitsSummary }> {
    const url = `${API_BASE_URL}/analytics/projects`;
    try {
      console.log(`🔄 [${new Date().toISOString()}] GET ${url}`);
      
      const response = await fetch(url, {
        headers: this.getAuthHeaders(),
      });
      
      return this.handleResponse(response, url, 'GET');
    } catch (error) {
      ErrorLogger.logNetworkError(url, 'GET', error as Error);
      throw error;
    }
  }

  // Milestone Management APIs
  async addMilestone(projectId: string, milestoneData: { title: string; description?: string; dueDate: string }): Promise<Project> {
    const url = `${API_BASE_URL}/projects/${projectId}/milestones`;
    try {
      console.log(`🔄 [${new Date().toISOString()}] POST ${url}`, milestoneData);
      
      const response = await fetch(url, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(milestoneData),
      });
      
      const data = await this.handleResponse(response, url, 'POST');
      return data.project;
    } catch (error) {
      ErrorLogger.logNetworkError(url, 'POST', error as Error);
      throw error;
    }
  }

  async updateMilestone(projectId: string, milestoneData: { milestoneId: string; status: string; completedDate?: string }): Promise<Project> {
    const url = `${API_BASE_URL}/projects/${projectId}/milestones`;
    try {
      console.log(`🔄 [${new Date().toISOString()}] PUT ${url}`, milestoneData);
      
      const response = await fetch(url, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(milestoneData),
      });
      
      const data = await this.handleResponse(response, url, 'PUT');
      return data.project;
    } catch (error) {
      ErrorLogger.logNetworkError(url, 'PUT', error as Error);
      throw error;
    }
  }

  // Utility methods
  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }
}

export const apiService = new ApiService();
