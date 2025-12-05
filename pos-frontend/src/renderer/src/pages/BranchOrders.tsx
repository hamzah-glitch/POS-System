import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Download, Eye, RefreshCw, ShoppingBag } from 'lucide-react';
import BranchManagerSidebar from '../components/BranchManagerSidebar';
import { orderService, Order } from '../api/order';
import { employeeService, Employee } from '../api/employee';
import toast from 'react-hot-toast';

export default function BranchOrders() {
    const navigate = useNavigate();
    const [orders, setOrders] = useState<Order[]>([]);
    const [cashiers, setCashiers] = useState<Employee[]>([]);
    const [loading, setLoading] = useState(true);
    const [branchId, setBranchId] = useState<number | null>(null);

    // Filters
    const [paymentFilter, setPaymentFilter] = useState('');
    const [cashierFilter, setCashierFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

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

            setBranchId(userBranchId);
            setLoading(true);

            // Fetch orders with filters
            const filters: any = {};
            if (paymentFilter) filters.paymentType = paymentFilter;
            if (statusFilter) filters.status = statusFilter;
            if (cashierFilter) filters.cashierId = parseInt(cashierFilter);

            const [ordersData, employeesData] = await Promise.all([
                orderService.getOrdersByBranch(userBranchId, filters),
                employeeService.getEmployeesByBranch(userBranchId)
            ]);

            setOrders(ordersData);
            setCashiers(employeesData.filter(e => e.role === 'ROLE_BRANCH_CASHIER'));
        } catch (error) {
            console.error('Failed to fetch orders:', error);
            toast.error('Failed to load orders');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, [navigate, paymentFilter, cashierFilter, statusFilter]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/');
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'COMPLETE': return 'bg-green-100 text-green-700';
            case 'REFUNDED': return 'bg-red-100 text-red-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const getPaymentIcon = (type: string) => {
        switch (type) {
            case 'CARD': return '💳';
            case 'CASH': return '💵';
            case 'UPI': return '📱';
            default: return '💰';
        }
    };

    return (
        <div className="flex h-screen bg-gray-50 font-sans">
            <BranchManagerSidebar onLogout={handleLogout} />

            <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Header */}
                <header className="bg-white h-16 shadow-sm flex items-center justify-between px-8 z-10">
                    <h1 className="text-xl font-bold text-gray-800 flex items-center">
                        <ShoppingBag className="w-6 h-6 mr-2 text-green-600" />
                        Orders
                    </h1>
                    <button
                        onClick={loadData}
                        className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center transition-colors shadow-sm"
                    >
                        <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                        Refresh
                    </button>
                </header>

                <div className="flex-1 overflow-y-auto p-8">
                    {/* Filters */}
                    <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <select
                            className="px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 bg-white shadow-sm"
                            value={paymentFilter}
                            onChange={(e) => setPaymentFilter(e.target.value)}
                        >
                            <option value="">All Payment Modes</option>
                            <option value="CASH">Cash</option>
                            <option value="CARD">Card</option>
                            <option value="UPI">Digital Banking</option>
                        </select>

                        <select
                            className="px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 bg-white shadow-sm"
                            value={cashierFilter}
                            onChange={(e) => setCashierFilter(e.target.value)}
                        >
                            <option value="">All Cashiers</option>
                            {cashiers.map(cashier => (
                                <option key={cashier.id} value={cashier.id}>{cashier.fullName}</option>
                            ))}
                        </select>

                        <select
                            className="px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 bg-white shadow-sm"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="">All Status</option>
                            <option value="COMPLETE">Complete</option>
                            <option value="REFUNDED">Refunded</option>
                        </select>
                    </div>

                    {/* Table */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Order ID</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Cashier</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Payment Mode</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {loading ? (
                                    <tr><td colSpan={8} className="text-center py-8 text-gray-500">Loading orders...</td></tr>
                                ) : orders.length === 0 ? (
                                    <tr><td colSpan={8} className="text-center py-8 text-gray-500">No orders found</td></tr>
                                ) : (
                                    orders.map(order => (
                                        <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 text-sm font-medium text-gray-900">#{order.id}</td>
                                            <td className="px-6 py-4 text-sm text-gray-600">{order.customerName || 'Walk-in'}</td>
                                            <td className="px-6 py-4 text-sm text-gray-600">{order.cashierName}</td>
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {new Date(order.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                                PKR {order.totalAmount.toLocaleString()}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600 flex items-center">
                                                <span className="mr-2">{getPaymentIcon(order.paymentType)}</span>
                                                {order.paymentType === 'UPI' ? 'Digital Banking' : order.paymentType}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right space-x-2">
                                                <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                                <button className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                                                    <Download className="w-4 h-4" />
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
