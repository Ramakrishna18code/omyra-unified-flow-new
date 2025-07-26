// Application Constants for Omyra HRM Enterprise Suite

export const APP_CONFIG = {
  name: 'Omyra HRM',
  version: '1.0.0',
  description: 'Enterprise HR Management & Company Finance Tool',
  company: 'Omyra Technologies'
};

export const USER_ROLES = {
  ADMIN: 'admin',
  HR: 'hr', 
  MANAGER: 'manager',
  EMPLOYEE: 'employee',
  INTERN: 'intern'
} as const;

export const PERMISSIONS = {
  // Employee Management
  VIEW_EMPLOYEES: 'view_employees',
  CREATE_EMPLOYEE: 'create_employee',
  EDIT_EMPLOYEE: 'edit_employee',
  DELETE_EMPLOYEE: 'delete_employee',
  
  // Payroll
  VIEW_PAYROLL: 'view_payroll',
  PROCESS_PAYROLL: 'process_payroll',
  
  // Reports
  VIEW_REPORTS: 'view_reports',
  EXPORT_REPORTS: 'export_reports',
  
  // Settings
  MANAGE_SETTINGS: 'manage_settings',
  MANAGE_ROLES: 'manage_roles'
} as const;

export const ROLE_PERMISSIONS = {
  [USER_ROLES.ADMIN]: Object.values(PERMISSIONS),
  [USER_ROLES.HR]: [
    PERMISSIONS.VIEW_EMPLOYEES,
    PERMISSIONS.CREATE_EMPLOYEE,
    PERMISSIONS.EDIT_EMPLOYEE,
    PERMISSIONS.VIEW_PAYROLL,
    PERMISSIONS.PROCESS_PAYROLL,
    PERMISSIONS.VIEW_REPORTS,
    PERMISSIONS.EXPORT_REPORTS
  ],
  [USER_ROLES.MANAGER]: [
    PERMISSIONS.VIEW_EMPLOYEES,
    PERMISSIONS.VIEW_REPORTS
  ],
  [USER_ROLES.EMPLOYEE]: [
    PERMISSIONS.VIEW_EMPLOYEES
  ],
  [USER_ROLES.INTERN]: [
    PERMISSIONS.VIEW_EMPLOYEES
  ]
};

export const EMPLOYEE_STATUS = {
  ACTIVE: 'active',
  ON_LEAVE: 'on-leave',
  INACTIVE: 'inactive',
  TERMINATED: 'terminated'
} as const;

export const LEAVE_TYPES = {
  ANNUAL: 'annual',
  SICK: 'sick', 
  MATERNITY: 'maternity',
  PATERNITY: 'paternity',
  EMERGENCY: 'emergency',
  UNPAID: 'unpaid'
} as const;

export const DEPARTMENTS = [
  'Engineering',
  'Human Resources',
  'Finance',
  'Marketing',
  'Sales',
  'Operations',
  'Product',
  'Design',
  'Legal',
  'Administration'
] as const;

export const CURRENCIES = {
  USD: { code: 'USD', symbol: '$', name: 'US Dollar' },
  EUR: { code: 'EUR', symbol: '€', name: 'Euro' },
  GBP: { code: 'GBP', symbol: '£', name: 'British Pound' },
  INR: { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  CAD: { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' }
} as const;

export const DATE_FORMATS = {
  SHORT: 'MMM dd, yyyy',
  LONG: 'MMMM dd, yyyy',
  ISO: 'yyyy-MM-dd',
  TIME: 'HH:mm:ss'
} as const;

export const API_ENDPOINTS = {
  AUTH: '/api/auth',
  EMPLOYEES: '/api/employees',
  PAYROLL: '/api/payroll',
  ATTENDANCE: '/api/attendance',
  REPORTS: '/api/reports',
  SETTINGS: '/api/settings'
} as const;

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'omyra_auth_token',
  USER_PREFERENCES: 'omyra_user_preferences',
  THEME: 'omyra_theme'
} as const;