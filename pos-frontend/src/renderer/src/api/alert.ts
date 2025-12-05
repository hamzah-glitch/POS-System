import axios from './axios';
import { Employee } from './employee';
import { Product } from './product';
import { Branch } from './branch';

export interface RefundSpike {
    cashierName: string;
    amount: number;
    reason: string;
    id: number;
}

export const alertService = {
    getInactiveCashiers: async () => {
        const response = await axios.get<Employee[]>('/alerts/inactive-cashiers');
        return response.data;
    },

    getLowStockProducts: async () => {
        const response = await axios.get<Product[]>('/alerts/low-stock');
        return response.data;
    },

    getBranchesWithNoSalesToday: async () => {
        const response = await axios.get<Branch[]>('/alerts/no-sale-today');
        return response.data;
    },

    getRefundSpikes: async () => {
        const response = await axios.get<RefundSpike[]>('/alerts/refund-spikes');
        return response.data;
    }
};
