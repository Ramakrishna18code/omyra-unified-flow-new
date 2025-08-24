// Dashboard API service
const API_BASE_URL = 'http://localhost:5000/api';

// Get auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('token') || '';
};

// Create headers with authorization
const createAuthHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${getAuthToken()}`
});

export interface DashboardStats {
  employeeCount: number;
  totalProfits: number;
  totalProjects: number;
  totalBudget: number;
  totalAllocations: number;
}

export interface Project {
  projectId: string;
  projectName: string;
  budget: number;
  totalAllocation: number;
  profit: number;
  team: any[];
}

export interface BackendProject {
  _id: string;
  name: string;
  budget: number;
  team: Array<{
    employee: {
      _id: string;
      name: string;
      email: string;
      department?: string;
    };
    allocation: number;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface Employee {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  position?: string;
  phoneNumber?: string;
  department?: string;
  joiningDate?: string;
  salary?: number;
  employeeId?: string;
}

export interface AdminDashboardResponse {
  message: string;
  role: string;
  employeeCount: number;
  totalProfits: number;
}

export interface AllEmployeesResponse {
  count: number;
  employees: Employee[];
}

export interface TotalProfitsResponse {
  message: string;
  summary: {
    totalProjects: number;
    totalBudget: number;
    totalAllocations: number;
    totalProfit: number;
    profitMargin: string;
  };
  projectDetails: Project[];
}

class DashboardService {
  // Check if user is authenticated
  private isAuthenticated(): boolean {
    const token = getAuthToken();
    if (!token) {
      console.warn('⚠️ No authentication token found. Please login first.');
      return false;
    }
    return true;
  }

  // Get admin dashboard summary
  async getAdminDashboard(): Promise<AdminDashboardResponse> {
    if (!this.isAuthenticated()) {
      throw new Error('Authentication required. Please login first.');
    }

    try {
      console.log('🔄 Fetching admin dashboard data...');
      const response = await fetch(`${API_BASE_URL}/dashboard/admin`, {
        method: 'GET',
        headers: createAuthHeaders()
      });

      if (response.status === 401) {
        throw new Error('Session expired. Please login again.');
      }

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const data = await response.json();
      console.log('✅ Admin dashboard data received:', data);
      return data;
    } catch (error) {
      console.error('❌ Error fetching admin dashboard:', error);
      throw error;
    }
  }

  // Get all employees
  async getAllEmployees(): Promise<AllEmployeesResponse> {
    if (!this.isAuthenticated()) {
      throw new Error('Authentication required. Please login first.');
    }

    try {
      console.log('🔄 Fetching all employees...');
      const response = await fetch(`${API_BASE_URL}/dashboard/admin/employees`, {
        method: 'GET',
        headers: createAuthHeaders()
      });

      if (response.status === 401) {
        throw new Error('Session expired. Please login again.');
      }

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const data = await response.json();
      console.log('✅ Employees data received:', data);
      return data;
    } catch (error) {
      console.error('❌ Error fetching employees:', error);
      throw error;
    }
  }

  // Get total profits from projects
  async getTotalProfits(): Promise<TotalProfitsResponse> {
    if (!this.isAuthenticated()) {
      throw new Error('Authentication required. Please login first.');
    }

    try {
      console.log('🔄 Fetching total profits...');
      const response = await fetch(`${API_BASE_URL}/dashboard/admin/projects`, {
        method: 'GET',
        headers: createAuthHeaders()
      });

      if (response.status === 401) {
        throw new Error('Session expired. Please login again.');
      }

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const data = await response.json();
      console.log('✅ Total profits data received:', data);
      return data;
    } catch (error) {
      console.error('❌ Error fetching total profits:', error);
      throw error;
    }
  }

  // Add new employee
  async addEmployee(employeeData: {
    name: string;
    email: string;
    position?: string;
    phoneNumber?: string;
    department?: string;
    joiningDate?: string;
    salary?: number;
  }) {
    if (!this.isAuthenticated()) {
      throw new Error('Authentication required. Please login first.');
    }

    try {
      console.log('🔄 Adding new employee...', employeeData);
      const response = await fetch(`${API_BASE_URL}/dashboard/admin/add_employee`, {
        method: 'POST',
        headers: createAuthHeaders(),
        body: JSON.stringify(employeeData)
      });

      if (response.status === 401) {
        throw new Error('Session expired. Please login again.');
      }

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Add employee failed with status:', response.status);
        console.error('❌ Error response:', errorText);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const data = await response.json();
      console.log('✅ Employee added successfully:', data);
      return data;
    } catch (error) {
      console.error('❌ Error adding employee:', error);
      throw error;
    }
  }

  // Delete employee
  async deleteEmployee(employeeId: string): Promise<any> {
    if (!this.isAuthenticated()) {
      throw new Error('Authentication required. Please login first.');
    }

    try {
      console.log('🗑️ Deleting employee...', employeeId);
      
      const response = await fetch(`${API_BASE_URL}/dashboard/admin/employee/${employeeId}`, {
        method: 'DELETE',
        headers: createAuthHeaders()
      });

      if (response.status === 401) {
        throw new Error('Session expired. Please login again.');
      }

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Delete employee failed with status:', response.status);
        console.error('❌ Error response:', errorText);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const data = await response.json();
      console.log('✅ Employee deleted successfully:', data);
      return data;
    } catch (error) {
      console.error('❌ Error deleting employee:', error);
      throw error;
    }
  }

  // Update employee
  async updateEmployee(employeeId: string, updateData: {
    name?: string;
    email?: string;
    position?: string;
    phoneNumber?: string;
    department?: string;
    joiningDate?: string;
    salary?: number;
  }): Promise<any> {
    if (!this.isAuthenticated()) {
      throw new Error('Authentication required. Please login first.');
    }

    try {
      console.log('✏️ Updating employee...', employeeId, updateData);
      
      const response = await fetch(`${API_BASE_URL}/dashboard/admin/employee/${employeeId}`, {
        method: 'PUT',
        headers: createAuthHeaders(),
        body: JSON.stringify(updateData)
      });

      if (response.status === 401) {
        throw new Error('Session expired. Please login again.');
      }

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Update employee failed with status:', response.status);
        console.error('❌ Error response:', errorText);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const data = await response.json();
      console.log('✅ Employee updated successfully:', data);
      return data;
    } catch (error) {
      console.error('❌ Error updating employee:', error);
      throw error;
    }
  }

  // Get all projects
  async getAllProjects(): Promise<any> {
    if (!this.isAuthenticated()) {
      throw new Error('Authentication required. Please login first.');
    }

    try {
      console.log('🔄 Fetching all projects...');
      const response = await fetch(`${API_BASE_URL}/projects`, {
        method: 'GET',
        headers: createAuthHeaders()
      });

      if (response.status === 401) {
        throw new Error('Session expired. Please login again.');
      }

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const data = await response.json();
      console.log('✅ Projects data received:', data);
      return data;
    } catch (error) {
      console.error('❌ Error fetching projects:', error);
      throw error;
    }
  }

  // Create new project
  async createProject(projectData: {
    name: string;
    budget: number;
    allocations?: Record<string, number>;
  }): Promise<any> {
    if (!this.isAuthenticated()) {
      throw new Error('Authentication required. Please login first.');
    }

    try {
      console.log('🔄 Creating new project...', projectData);
      const response = await fetch(`${API_BASE_URL}/projects`, {
        method: 'POST',
        headers: createAuthHeaders(),
        body: JSON.stringify(projectData)
      });

      if (response.status === 401) {
        throw new Error('Session expired. Please login again.');
      }

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Create project failed with status:', response.status);
        console.error('❌ Error response:', errorText);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const data = await response.json();
      console.log('✅ Project created successfully:', data);
      return data;
    } catch (error) {
      console.error('❌ Error creating project:', error);
      throw error;
    }
  }

  // Update project
  async updateProject(projectId: string, updateData: {
    budget?: number;
    allocations?: Record<string, number>;
  }): Promise<any> {
    if (!this.isAuthenticated()) {
      throw new Error('Authentication required. Please login first.');
    }

    try {
      console.log('✏️ Updating project...', projectId, updateData);
      
      const response = await fetch(`${API_BASE_URL}/projects/${projectId}`, {
        method: 'PUT',
        headers: createAuthHeaders(),
        body: JSON.stringify(updateData)
      });

      if (response.status === 401) {
        throw new Error('Session expired. Please login again.');
      }

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Update project failed with status:', response.status);
        console.error('❌ Error response:', errorText);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const data = await response.json();
      console.log('✅ Project updated successfully:', data);
      return data;
    } catch (error) {
      console.error('❌ Error updating project:', error);
      throw error;
    }
  }

  // Get comprehensive dashboard stats
  async getDashboardStats(): Promise<DashboardStats> {
    try {
      console.log('🔄 Fetching comprehensive dashboard stats...');
      
      // Fetch data from multiple endpoints
      const [adminDashboard, totalProfits] = await Promise.all([
        this.getAdminDashboard(),
        this.getTotalProfits()
      ]);

      const stats: DashboardStats = {
        employeeCount: adminDashboard.employeeCount || 0,
        totalProfits: totalProfits.summary?.totalProfit || 0,
        totalProjects: totalProfits.summary?.totalProjects || 0,
        totalBudget: totalProfits.summary?.totalBudget || 0,
        totalAllocations: totalProfits.summary?.totalAllocations || 0
      };

      console.log('✅ Comprehensive dashboard stats:', stats);
      return stats;
    } catch (error) {
      console.error('❌ Error fetching dashboard stats:', error);
      throw error;
    }
  }
}

export const dashboardService = new DashboardService();
export default dashboardService;
