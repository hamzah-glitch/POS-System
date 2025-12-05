import axios from './axios';

export interface Category {
    id: number;
    name: string;
    storeId: number;
}

export interface Product {
    id: number;
    name: string;
    description: string;
    skuId: string;
    mrp: number;
    sellingPrice: number;
    brand: string;
    imageUrl: string;
    stockQuantity: number;
    categoryId: number;
    category?: Category;
    storeId: number;
    createdAt: string;
    updatedAt: string;
}

export const productService = {
    getProductsByStore: async (storeId: number) => {
        const response = await axios.get<Product[]>(`/products/store/${storeId}`);
        return response.data;
    },

    searchProducts: async (storeId: number, keyword: string) => {
        const response = await axios.get<Product[]>(`/products/store/${storeId}/search`, {
            params: { keyword }
        });
        return response.data;
    },

    createProduct: async (productData: Partial<Product>) => {
        const response = await axios.post<Product>('/products', productData);
        return response.data;
    },

    updateProduct: async (id: number, productData: Partial<Product>) => {
        const response = await axios.patch<Product>(`/products/${id}`, productData);
        return response.data;
    },

    deleteProduct: async (id: number) => {
        const response = await axios.delete(`/products/${id}`);
        return response.data;
    }
};
