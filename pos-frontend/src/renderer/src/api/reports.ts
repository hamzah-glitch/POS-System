import api from './axios';

export interface MonthlySales {
    month: number;
    total: number;
}

export interface SalesByCategory {
    category: string;
    total: number;
    [key: string]: any;
}

export const reportService = {
    getMonthlySales: async (branchId: number, year: number = new Date().getFullYear()): Promise<MonthlySales[]> => {
        const response = await api.get(`/reports/monthly-sales/${branchId}`, { params: { year } });
        return response.data;
    },

    getSalesByCategory: async (branchId: number): Promise<SalesByCategory[]> => {
        const response = await api.get(`/reports/sales-by-category/${branchId}`);
        return response.data;
    }
};
