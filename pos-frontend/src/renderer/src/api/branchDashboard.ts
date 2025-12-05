import api from './axios';

export interface BranchDashboardStats {
    totalSales: number;
    ordersToday: number;
    activeCashiers: number;
    lowStockItems: number;
}

export interface SalesTrendData {
    date: string;
    total: number;
}

export interface RecentSale {
    id: number;
    customerName: string;
    totalAmount: number;
    status: string;
    date: string;
}

export const branchDashboardService = {
    getStats: async (branchId: number): Promise<BranchDashboardStats> => {
        const response = await api.get(`/branch-dashboard/stats/${branchId}`);
        return response.data;
    },

    getSalesTrend: async (branchId: number): Promise<SalesTrendData[]> => {
        const response = await api.get(`/branch-dashboard/sales-trend/${branchId}`);
        return response.data;
    },

    getRecentSales: async (branchId: number): Promise<RecentSale[]> => {
        const response = await api.get(`/branch-dashboard/recent-sales/${branchId}`);
        return response.data;
    }
};
