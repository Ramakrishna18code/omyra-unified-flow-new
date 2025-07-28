// Data storage utility for HRM system
export interface StorageKeys {
  employees: 'hrm_employees';
  attendance: 'hrm_attendance';
  payroll: 'hrm_payroll';
  documents: 'hrm_documents';
  meetings: 'hrm_meetings';
  settings: 'hrm_settings';
}

export const STORAGE_KEYS: StorageKeys = {
  employees: 'hrm_employees',
  attendance: 'hrm_attendance',
  payroll: 'hrm_payroll',
  documents: 'hrm_documents',
  meetings: 'hrm_meetings',
  settings: 'hrm_settings'
};

// Generic storage interface
export interface StorageService {
  get<T>(key: string): T | null;
  set<T>(key: string, data: T): void;
  remove(key: string): void;
  clear(): void;
}

// localStorage implementation
export class LocalStorageService implements StorageService {
  get<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Error parsing localStorage item:', error);
      return null;
    }
  }

  set<T>(key: string, data: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }

  remove(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing from localStorage:', error);
    }
  }

  clear(): void {
    try {
      Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  }
}

// Create singleton instance
export const storage = new LocalStorageService();

// Helper functions for specific data types
export interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  salary: number;
  startDate: string;
  status: 'active' | 'inactive' | 'on-leave';
  avatar?: string;
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string;
  checkIn: string;
  checkOut: string;
  status: 'present' | 'absent' | 'late' | 'half-day';
  hoursWorked: number;
}

export interface PayrollRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  position: string;
  baseSalary: number;
  allowances: number;
  deductions: number;
  netSalary: number;
  payPeriod: string;
  status: 'pending' | 'processed' | 'paid';
}

export interface Document {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadDate: string;
  uploadedBy: string;
  category: string;
  status: 'active' | 'archived';
}

export interface Meeting {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  duration: number;
  type: 'video' | 'in-person' | 'hybrid';
  attendees: string[];
  agenda: string[];
  priority: 'low' | 'medium' | 'high';
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  meetingLink?: string;
  location?: string;
}

// Employee management functions
export const employeeStorage = {
  getAll: (): Employee[] => storage.get<Employee[]>(STORAGE_KEYS.employees) || [],
  
  add: (employee: Omit<Employee, 'id'>): Employee => {
    const employees = employeeStorage.getAll();
    const newEmployee: Employee = {
      ...employee,
      id: `emp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };
    employees.push(newEmployee);
    storage.set(STORAGE_KEYS.employees, employees);
    return newEmployee;
  },
  
  update: (id: string, updates: Partial<Employee>): Employee | null => {
    const employees = employeeStorage.getAll();
    const index = employees.findIndex(emp => emp.id === id);
    if (index !== -1) {
      employees[index] = { ...employees[index], ...updates };
      storage.set(STORAGE_KEYS.employees, employees);
      return employees[index];
    }
    return null;
  },
  
  remove: (id: string): boolean => {
    const employees = employeeStorage.getAll();
    const filteredEmployees = employees.filter(emp => emp.id !== id);
    if (filteredEmployees.length !== employees.length) {
      storage.set(STORAGE_KEYS.employees, filteredEmployees);
      return true;
    }
    return false;
  },
  
  getById: (id: string): Employee | null => {
    const employees = employeeStorage.getAll();
    return employees.find(emp => emp.id === id) || null;
  }
};

// Attendance management functions
export const attendanceStorage = {
  getAll: (): AttendanceRecord[] => storage.get<AttendanceRecord[]>(STORAGE_KEYS.attendance) || [],
  
  add: (record: Omit<AttendanceRecord, 'id'>): AttendanceRecord => {
    const records = attendanceStorage.getAll();
    const newRecord: AttendanceRecord = {
      ...record,
      id: `att_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };
    records.push(newRecord);
    storage.set(STORAGE_KEYS.attendance, records);
    return newRecord;
  },
  
  update: (id: string, updates: Partial<AttendanceRecord>): AttendanceRecord | null => {
    const records = attendanceStorage.getAll();
    const index = records.findIndex(record => record.id === id);
    if (index !== -1) {
      records[index] = { ...records[index], ...updates };
      storage.set(STORAGE_KEYS.attendance, records);
      return records[index];
    }
    return null;
  },
  
  getByEmployee: (employeeId: string): AttendanceRecord[] => {
    const records = attendanceStorage.getAll();
    return records.filter(record => record.employeeId === employeeId);
  },
  
  getByDateRange: (startDate: string, endDate: string): AttendanceRecord[] => {
    const records = attendanceStorage.getAll();
    return records.filter(record => record.date >= startDate && record.date <= endDate);
  }
};

// Payroll management functions
export const payrollStorage = {
  getAll: (): PayrollRecord[] => storage.get<PayrollRecord[]>(STORAGE_KEYS.payroll) || [],
  
  add: (record: Omit<PayrollRecord, 'id'>): PayrollRecord => {
    const records = payrollStorage.getAll();
    const newRecord: PayrollRecord = {
      ...record,
      id: `pay_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };
    records.push(newRecord);
    storage.set(STORAGE_KEYS.payroll, records);
    return newRecord;
  },
  
  update: (id: string, updates: Partial<PayrollRecord>): PayrollRecord | null => {
    const records = payrollStorage.getAll();
    const index = records.findIndex(record => record.id === id);
    if (index !== -1) {
      records[index] = { ...records[index], ...updates };
      storage.set(STORAGE_KEYS.payroll, records);
      return records[index];
    }
    return null;
  },
  
  getByEmployee: (employeeId: string): PayrollRecord[] => {
    const records = payrollStorage.getAll();
    return records.filter(record => record.employeeId === employeeId);
  }
};

// Document management functions
export const documentStorage = {
  getAll: (): Document[] => storage.get<Document[]>(STORAGE_KEYS.documents) || [],
  
  add: (document: Omit<Document, 'id'>): Document => {
    const documents = documentStorage.getAll();
    const newDocument: Document = {
      ...document,
      id: `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };
    documents.push(newDocument);
    storage.set(STORAGE_KEYS.documents, documents);
    return newDocument;
  },
  
  update: (id: string, updates: Partial<Document>): Document | null => {
    const documents = documentStorage.getAll();
    const index = documents.findIndex(doc => doc.id === id);
    if (index !== -1) {
      documents[index] = { ...documents[index], ...updates };
      storage.set(STORAGE_KEYS.documents, documents);
      return documents[index];
    }
    return null;
  },
  
  remove: (id: string): boolean => {
    const documents = documentStorage.getAll();
    const filteredDocuments = documents.filter(doc => doc.id !== id);
    if (filteredDocuments.length !== documents.length) {
      storage.set(STORAGE_KEYS.documents, filteredDocuments);
      return true;
    }
    return false;
  }
};

// Meeting management functions
export const meetingStorage = {
  getAll: (): Meeting[] => storage.get<Meeting[]>(STORAGE_KEYS.meetings) || [],
  
  add: (meeting: Omit<Meeting, 'id'>): Meeting => {
    const meetings = meetingStorage.getAll();
    const newMeeting: Meeting = {
      ...meeting,
      id: `meet_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };
    meetings.push(newMeeting);
    storage.set(STORAGE_KEYS.meetings, meetings);
    return newMeeting;
  },
  
  update: (id: string, updates: Partial<Meeting>): Meeting | null => {
    const meetings = meetingStorage.getAll();
    const index = meetings.findIndex(meeting => meeting.id === id);
    if (index !== -1) {
      meetings[index] = { ...meetings[index], ...updates };
      storage.set(STORAGE_KEYS.meetings, meetings);
      return meetings[index];
    }
    return null;
  },
  
  remove: (id: string): boolean => {
    const meetings = meetingStorage.getAll();
    const filteredMeetings = meetings.filter(meeting => meeting.id !== id);
    if (filteredMeetings.length !== meetings.length) {
      storage.set(STORAGE_KEYS.meetings, filteredMeetings);
      return true;
    }
    return false;
  },
  
  getUpcoming: (): Meeting[] => {
    const meetings = meetingStorage.getAll();
    const now = new Date();
    return meetings.filter(meeting => {
      const meetingDate = new Date(`${meeting.date} ${meeting.time}`);
      return meetingDate > now && meeting.status === 'scheduled';
    });
  }
};

// Initialize with sample data if empty
export const initializeSampleData = () => {
  // Add sample employees if none exist
  if (employeeStorage.getAll().length === 0) {
    const sampleEmployees = [
      {
        name: 'John Doe',
        email: 'john.doe@company.com',
        phone: '+1 234 567 8900',
        position: 'Software Engineer',
        department: 'Engineering',
        salary: 75000,
        startDate: '2023-01-15',
        status: 'active' as const
      },
      {
        name: 'Jane Smith',
        email: 'jane.smith@company.com',
        phone: '+1 234 567 8901',
        position: 'HR Manager',
        department: 'Human Resources',
        salary: 65000,
        startDate: '2022-06-01',
        status: 'active' as const
      },
      {
        name: 'Mike Johnson',
        email: 'mike.johnson@company.com',
        phone: '+1 234 567 8902',
        position: 'Marketing Specialist',
        department: 'Marketing',
        salary: 55000,
        startDate: '2023-03-10',
        status: 'active' as const
      }
    ];
    
    sampleEmployees.forEach(emp => employeeStorage.add(emp));
  }
  
  // Add sample meetings if none exist
  if (meetingStorage.getAll().length === 0) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const sampleMeetings = [
      {
        title: 'Team Standup',
        description: 'Daily team standup meeting',
        date: tomorrow.toISOString().split('T')[0],
        time: '09:00',
        duration: 30,
        type: 'video' as const,
        attendees: ['john.doe@company.com', 'jane.smith@company.com'],
        agenda: ['Yesterday progress', 'Today goals', 'Blockers'],
        priority: 'medium' as const,
        status: 'scheduled' as const,
        meetingLink: 'https://meet.example.com/team-standup'
      }
    ];
    
    sampleMeetings.forEach(meeting => meetingStorage.add(meeting));
  }
};
