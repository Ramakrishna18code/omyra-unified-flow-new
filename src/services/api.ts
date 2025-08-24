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

export interface Project {
  _id: string;
  name: string;
  budget: number;
  team: Array<{
    employee: {
      _id: string;
      name: string;
      email: string;
      department: string;
    };
    allocation: number;
  }>;
  profit: number;
}

export interface ProjectCreateData {
  name: string;
  budget: number;
  allocations: Record<string, number>;
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

  // Project APIs
  async getProjects(): Promise<Project[]> {
    const url = `${API_BASE_URL}/projects`;
    try {
      console.log(`🔄 [${new Date().toISOString()}] GET ${url}`);
      
      const response = await fetch(url, {
        headers: this.getAuthHeaders(),
      });
      
      const data = await this.handleResponse(response, url, 'GET');
      return data.projects || [];
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
