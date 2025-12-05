import axios from './axios';

export interface Category {
    id: number;
    name: string;
    storeId: number;
}

export const categoryService = {
    getCategoriesByStore: async (storeId: number) => {
        const response = await axios.get<Category[]>(`/categories/store/${storeId}`);
        return response.data;
    },

    createCategory: async (categoryData: Partial<Category>) => {
        const response = await axios.post<Category>('/categories', categoryData);
        return response.data;
    },

    updateCategory: async (id: number, categoryData: Partial<Category>) => {
        const response = await axios.put<Category>(`/categories/${id}`, categoryData);
        return response.data;
    },

    deleteCategory: async (id: number) => {
        const response = await axios.delete(`/categories/${id}`);
        return response.data;
    }
};
