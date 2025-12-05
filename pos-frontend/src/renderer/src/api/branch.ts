import axios from './axios';

export interface Branch {
    id: number;
    name: string;
    address: string;
    phone: string;
    email: string;
    workingDays: string[];
    openTime: string;
    closeTime: string;
    createdAt: string;
    updatedAt: string;
    storeId: number;
}

export const branchService = {
    getAllBranchesByStoreId: async (storeId: number) => {
        const response = await axios.get<Branch[]>(`/branches/store/${storeId}`);
        return response.data;
    },

    createBranch: async (branchData: Partial<Branch>) => {
        const response = await axios.post<Branch>('/branches', branchData);
        return response.data;
    },

    updateBranch: async (id: number, branchData: Partial<Branch>) => {
        const response = await axios.put<Branch>(`/branches/${id}`, branchData);
        return response.data;
    },

    deleteBranch: async (id: number) => {
        const response = await axios.delete(`/branches/${id}`);
        return response.data;
    },
};
