import api from './axios';

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
        const response = await api.get(`/sales/stats/${branchId}`);
        return response.data;
    },

    getDailySales: async (branchId: number, days: number = 7): Promise<DailySales[]> => {
        const response = await api.get(`/sales/daily/${branchId}`, { params: { days } });
        return response.data;
    },

    getSalesByPaymentMethod: async (branchId: number): Promise<PaymentMethodStats[]> => {
        const response = await api.get(`/sales/payment-methods/${branchId}`);
        return response.data;
    }
};
