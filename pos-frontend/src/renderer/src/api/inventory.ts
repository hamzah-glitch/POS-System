import axios from './axios';
import { Product } from './product';

export interface InventoryItem {
    id: number;
    branchId: number;
    productId: number;
    product?: Product;
    quantity: number;
    lastUpdate: string;
}

export const inventoryService = {
    getInventoryByBranch: async (branchId: number) => {
        const response = await axios.get<InventoryItem[]>(`/inventories/branch/${branchId}`);
        return response.data;
    },

    createInventory: async (data: { branchId: number; productId: number; quantity: number }) => {
        const response = await axios.post<InventoryItem>('/inventories', data);
        return response.data;
    },

    updateInventory: async (id: number, data: { quantity: number }) => {
        const response = await axios.put<InventoryItem>(`/inventories/${id}`, data);
        return response.data;
    },

    deleteInventory: async (id: number) => {
        const response = await axios.delete(`/inventories/${id}`);
        return response.data;
    }
};
