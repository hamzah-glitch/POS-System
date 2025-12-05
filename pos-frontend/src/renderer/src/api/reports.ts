import axios from 'axios';

const API_URL = 'http://localhost:8080/api/reports';

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
        const response = await axios.get(`${API_URL}/monthly-sales/${branchId}`, { params: { year } });
        return response.data;
    },

    getSalesByCategory: async (branchId: number): Promise<SalesByCategory[]> => {
        const response = await axios.get(`${API_URL}/sales-by-category/${branchId}`);
        return response.data;
    }
};
