import axios from './axios';

export interface Refund {
    id: number;
    orderId: number;
    reason: string;
    amount: number;
    cashierName: string;
    createdAt: string;
    paymentType: string;
}

export const refundService = {
    getRefundsByBranch: async (branchId: number) => {
        const response = await axios.get<Refund[]>(`/refunds/branch/${branchId}`);
        return response.data;
    }
};
