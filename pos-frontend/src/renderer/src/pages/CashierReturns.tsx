import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { RotateCcw, RefreshCw, Menu, AlertCircle } from 'lucide-react';
import CashierSidebar from '../components/CashierSidebar';
import { orderService, Order } from '../api/order';
import { shiftService } from '../api/shift';
import toast from 'react-hot-toast';

export default function CashierReturns() {
    const navigate = useNavigate();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const loadData = async () => {
        try {
            const userStr = localStorage.getItem('user');
            if (!userStr) {
                navigate('/');
                return;
            }
            const userData = JSON.parse(userStr);
            const userBranchId = userData.branchId;

            if (!userBranchId) {
                toast.error('Branch information missing');
                return;
            }

            setLoading(true);
            // Fetch only COMPLETED orders for potential refund
            const data = await orderService.getOrdersByBranch(userBranchId, { status: 'COMPLETED' });
            setOrders(data);
        } catch (error) {
            console.error('Failed to fetch orders:', error);
            toast.error('Failed to load orders');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, [navigate]);

    const handleLogout = async () => {
        try {
            await shiftService.endShift();
        } catch (error) {
            console.error('Error ending shift:', error);
            toast.error('Failed to end shift properly, but logging out anyway.');
        } finally {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            navigate('/');
        }
    };

    const handleRefund = async (orderId: number) => {
        if (!window.confirm('Are you sure you want to refund this order? This action cannot be undone.')) return;

        try {
            await orderService.refundOrder(orderId);
            toast.success('Order refunded successfully');
            loadData(); // Refresh list
        } catch (error) {
            console.error('Refund failed:', error);
            toast.error('Failed to process refund');
        }
    };

    return (
        <div className="flex h-screen bg-gray-50 font-sans">
            <CashierSidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                onLogout={handleLogout}
            />

            <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Header */}
                <header className="bg-white h-16 shadow-sm flex items-center justify-between px-8 z-10">
                    <div className="flex items-center space-x-4">
                        <button
                            className="p-2 hover:bg-gray-100 rounded-lg text-gray-600"
                            onClick={() => setIsSidebarOpen(true)}
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                        <h1 className="text-xl font-bold text-gray-800 flex items-center">
                            <RotateCcw className="w-6 h-6 mr-2 text-red-600" />
                            Process Refunds
                        </h1>
                    </div>
                    <button
                        onClick={loadData}
                        className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center transition-colors shadow-sm"
                    >
                        <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                        Refresh
                    </button>
                </header>

                <div className="flex-1 overflow-y-auto p-8">
                    {/* Table */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Order ID</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Items</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {loading ? (
                                    <tr><td colSpan={5} className="text-center py-8 text-gray-500">Loading orders...</td></tr>
                                ) : orders.length === 0 ? (
                                    <tr><td colSpan={5} className="text-center py-8 text-gray-500">No completed orders found for refund</td></tr>
                                ) : (
                                    orders.map(order => (
                                        <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 text-sm font-medium text-gray-900">#{order.id}</td>
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {new Date(order.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                                PKR {order.totalAmount.toLocaleString()}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {order.items.length} items
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    onClick={() => handleRefund(order.id)}
                                                    className="px-3 py-1 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-sm font-medium transition-colors border border-red-200"
                                                >
                                                    Refund
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
}
