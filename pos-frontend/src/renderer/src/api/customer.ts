import api from './axios';

export interface Customer {
    id: number;
    fullName: string;
    email: string;
    phone: string;
    createdAt?: string;
    updatedAt?: string;
}

export const customerService = {
    getAllCustomers: async () => {
        const response = await api.get('/customers');
        return response.data;
    },

    searchCustomers: async (query: string) => {
        const response = await api.get(`/customers/search?q=${query}`);
        return response.data;
    },

    createCustomer: async (customer: Omit<Customer, 'id'>) => {
        const response = await api.post('/customers', customer);
        return response.data;
    },

    updateCustomer: async (id: number, customer: Partial<Customer>) => {
        const response = await api.put(`/customers/${id}`, customer);
        return response.data;
    },

    deleteCustomer: async (id: number) => {
        const response = await api.delete(`/customers/${id}`);
        return response.data;
    }
};
