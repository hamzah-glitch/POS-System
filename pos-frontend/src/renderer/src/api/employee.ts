import axios from './axios';

export enum UserRole {
    ROLE_USER = 'ROLE_USER',
    ROLE_ADMIN = 'ROLE_ADMIN',
    ROLE_BRANCH_CASHIER = 'ROLE_BRANCH_CASHIER',
    ROLE_BRANCH_MANAGER = 'ROLE_BRANCH_MANAGER',
    ROLE_STORE_MANAGER = 'ROLE_STORE_MANAGER',
    ROLE_STORE_ADMIN = 'ROLE_STORE_ADMIN',
    ROLE_BRANCH_ADMIN = 'ROLE_BRANCH_ADMIN'
}

export interface Employee {
    id: number;
    fullName: string;
    email: string;
    phone: string;
    role: UserRole;
    createdAt: string;
    updatedAt: string;
    lastLogin: string;
    branchId?: number;
    storeId?: number;
    password?: string;
}

export const employeeService = {
    getEmployeesByStore: async (storeId: number, role?: UserRole) => {
        const response = await axios.get<Employee[]>(`/employees/store/${storeId}`, {
            params: { userRole: role }
        });
        return response.data;
    },

    getEmployeesByBranch: async (branchId: number, role?: UserRole) => {
        const response = await axios.get<Employee[]>(`/employees/branch/${branchId}`, {
            params: { userRole: role }
        });
        return response.data;
    },

    createStoreEmployee: async (storeId: number, employeeData: Partial<Employee>) => {
        const response = await axios.post<Employee>(`/employees/store/${storeId}`, employeeData);
        return response.data;
    },

    createBranchEmployee: async (branchId: number, employeeData: Partial<Employee>) => {
        const response = await axios.post<Employee>(`/employees/branch/${branchId}`, employeeData);
        return response.data;
    },

    updateEmployee: async (id: number, employeeData: Partial<Employee>) => {
        const response = await axios.put<Employee>(`/employees/${id}`, employeeData);
        return response.data;
    },

    deleteEmployee: async (id: number) => {
        const response = await axios.delete(`/employees/${id}`);
        return response.data;
    },

    getAllEmployee: async () => {
        const response = await axios.get<Employee[]>(`/employees`);
        return response.data;
    }
};
