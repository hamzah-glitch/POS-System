import api from './axios';

export interface Store {
    id: number;
    branchName: string;
    description?: string;
    storeType?: string;
    status: 'ACTIVE' | 'PENDING' | 'BLOCKED';
    contact?: {
        address?: string;
        phone?: string;
        email?: string;
    };
    createdAt?: string;
    updatedAt?: string;
}

export const storeService = {
    getAllStores: async (): Promise<Store[]> => {
        const response = await api.get('/store');
        return response.data;
    },
    createStore: async (storeData: Partial<Store>): Promise<Store> => {
        const response = await api.post('/store/create', storeData);
        return response.data;
    },
    updateStore: async (id: number, storeData: Partial<Store>): Promise<Store> => {
        const response = await api.put(`/store/${id}`, storeData);
        return response.data;
    },
    deleteStore: async (id: number): Promise<void> => {
        await api.delete(`/store/${id}`);
    }
};
