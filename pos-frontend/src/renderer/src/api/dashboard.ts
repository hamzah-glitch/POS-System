import api from './axios';

export const dashboardService = {
    getStats: async (storeId: number) => {
        const response = await api.get(`/dashboard/stats/${storeId}`);
        return response.data;
    },

    getSalesTrend: async (storeId: number, days: number = 7) => {
        const response = await api.get(`/dashboard/sales-trend/${storeId}?days=${days}`);
        return response.data;
    },

    getRecentSales: async (storeId: number) => {
        const response = await api.get(`/dashboard/recent-sales/${storeId}`);
        return response.data;
    }
};
