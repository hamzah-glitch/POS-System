import axios from 'axios';

const API_URL = 'http://localhost:8080/api/user';

export interface UserProfile {
    id: number;
    fullName: string;
    email: string;
    phone: string;
    role: string;
    store?: {
        id: number;
        branchName: string;
        contact: {
            address: string;
            email: string;
            phone: string;
        };
    };
    branch?: {
        id: number;
        name: string;
    };
}

export const settingsService = {
    getProfile: async (): Promise<UserProfile> => {
        const token = localStorage.getItem('jwt');
        const response = await axios.get(`${API_URL}/profile`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    updateProfile: async (data: Partial<UserProfile>): Promise<UserProfile> => {
        const token = localStorage.getItem('jwt');
        const response = await axios.put(`${API_URL}/profile`, data, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    }
};
