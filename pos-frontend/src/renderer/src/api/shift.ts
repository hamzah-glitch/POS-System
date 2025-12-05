import api from './axios';

export interface ShiftReport {
    id: number;
    userId: number;
    startTime: string;
    endTime: string | null;
    startCash: number;
    endCash: number | null;
    status: 'OPEN' | 'CLOSED';
}

export const shiftService = {
    startShift: async (): Promise<ShiftReport> => {
        const response = await api.post('/shift-reports/start');
        return response.data;
    },
    endShift: async (): Promise<ShiftReport> => {
        const response = await api.patch('/shift-reports/end');
        return response.data;
    },
    getCurrentShift: async (): Promise<ShiftReport> => {
        const response = await api.get('/shift-reports/current');
        return response.data;
    }
};
