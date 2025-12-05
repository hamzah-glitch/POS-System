import axios from 'axios';

const API_URL = 'http://localhost:8080/api/sales';

export interface SalesStats {
    totalSales: number;
    ordersToday: number;
    activeCashiers: number;
    avgOrderValue: number;
}

export interface DailySales {
    date: string;
    total: number;
}

export interface PaymentMethodStats {
    type: string;
    count: number;
}

export const salesService = {
    getStats: async (branchId: number): Promise<SalesStats> => {
        const response = await axios.get(`${API_URL}/stats/${branchId}`);
        return response.data;
    },

    getDailySales: async (branchId: number, days: number = 7): Promise<DailySales[]> => {
        const response = await axios.get(`${API_URL}/daily/${branchId}`, { params: { days } });
        return response.data;
    },

    getSalesByPaymentMethod: async (branchId: number): Promise<PaymentMethodStats[]> => {
        const response = await axios.get(`${API_URL}/payment-methods/${branchId}`);
        return response.data;
    }
};
