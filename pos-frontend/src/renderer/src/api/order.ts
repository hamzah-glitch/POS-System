import axios from './axios';

export interface OrderItem {
    id: number;
    productName: string;
    quantity: number;
    price: number;
    subtotal: number;
}

export interface Order {
    id: number;
    customerName: string;
    cashierName: string;
    totalAmount: number;
    discount?: number;
    note?: string;
    paymentType: 'CASH' | 'CARD' | 'ONLINE';
    status: 'COMPLETE' | 'REFUNDED';
    createdAt: string;
    items: OrderItem[];
}

export interface CreateOrderDto {
    customerId?: number;
    paymentType: 'CASH' | 'CARD' | 'ONLINE';
    discount?: number;
    note?: string;
    items: {
        productId: number;
        quantity: number;
    }[];
}

export const orderService = {
    createOrder: async (orderData: CreateOrderDto) => {
        const response = await axios.post<Order>('/orders', orderData);
        return response.data;
    },

    getOrdersByBranch: async (
        branchId: number,
        filters?: {
            paymentType?: string;
            status?: string;
            cashierId?: number;
        }
    ) => {
        const params = new URLSearchParams();
        if (filters?.paymentType) params.append('paymentType', filters.paymentType);
        if (filters?.status) params.append('status', filters.status);
        if (filters?.cashierId) params.append('cashierId', filters.cashierId.toString());

        const response = await axios.get<Order[]>(`/orders/branch/${branchId}`, { params });
        return response.data;
    },

    getOrderById: async (id: number) => {
        const response = await axios.get<Order>(`/orders/${id}`);
        return response.data;
    },

    refundOrder: async (id: number) => {
        const response = await axios.post<Order>(`/orders/${id}/refund`);
        return response.data;
    }
};
