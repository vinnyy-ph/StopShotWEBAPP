import axiosInstance from './axiosInstance';

export interface Employee {
  user_id: number;
  username: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  role: string;
  hire_date: string | null;
  is_active: boolean;
  is_staff: boolean;
  is_superuser: boolean;
  last_login_date: string;
  last_login_time: string;
  phone_number: string;
  groups: any[];
  user_permissions: any[];
}

export interface EmployeeCreate {
  first_name: string;
  last_name: string;
  phone_num: string; // Field name expected by backend
  role: string;
  hire_date: string;
  is_active?: boolean;
}

export const employeeService = {
  getAllEmployees: async (): Promise<Employee[]> => {
    const response = await axiosInstance.get('/employees/');
    return response.data;
  },
  
  createEmployee: async (employeeData: EmployeeCreate): Promise<Employee> => {
    try {
      const response = await axiosInstance.post('/auth/create-employee/', employeeData);
      return response.data;
    } catch (error: any) {
      console.error('Error creating employee:', error.response?.data || error.message);
      throw error;
    }
  },
  
  updateEmployeeStatus: async (userId: number, isActive: boolean): Promise<any> => {
    const response = await axiosInstance.patch(`/employees/${userId}/status/`, { is_active: isActive });
    return response.data;
  }
};