import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, Eye, RefreshCw, Download, Menu } from 'lucide-react';
import CashierSidebar from '../components/CashierSidebar';
import { orderService, Order } from '../api/order';
import { shiftService } from '../api/shift';
import toast from 'react-hot-toast';

export default function CashierOrders() {
    const navigate = useNavigate();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Filters
    const [paymentFilter, setPaymentFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    const loadData = async () => {
        try {
            const userStr = localStorage.getItem('user');
            if (!userStr) {
                navigate('/');
                return;
            }
            const user = JSON.parse(userStr);
            const branchId = user.branchId;
            const cashierId = user.id;

            if (!branchId) {
                toast.error('Branch information missing');
                return;
            }

            setLoading(true);

            // Fetch orders with filters
            const filters: any = {
                cashierId: cashierId
            };
            if (paymentFilter) filters.paymentType = paymentFilter;
            if (statusFilter) filters.status = statusFilter;

            const ordersData = await orderService.getOrdersByBranch(branchId, filters);
            setOrders(ordersData);
        } catch (error) {
            console.error('Failed to fetch orders:', error);
            toast.error('Failed to load orders');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, [navigate, paymentFilter, statusFilter]);

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
            case 'ONLINE': return '🌐';
            default: return '💰';
        }
    };

    const handlePrintReceipt = (order: Order) => {
        const receiptWindow = window.open('', '_blank', 'width=400,height=600');
        if (receiptWindow) {
            receiptWindow.document.write(`
                <html>
                    <head>
                        <title>Receipt #${order.id}</title>
                        <style>
                            body { font-family: 'Courier New', monospace; padding: 20px; max-width: 300px; margin: 0 auto; }
                            .header { text-align: center; margin-bottom: 20px; border-bottom: 1px dashed #000; padding-bottom: 10px; }
                            .item { display: flex; justify-content: space-between; margin-bottom: 5px; font-size: 12px; }
                            .total { border-top: 1px dashed #000; margin-top: 10px; padding-top: 10px; font-weight: bold; }
                            .footer { text-align: center; margin-top: 20px; font-size: 10px; }
                            @media print { @page { margin: 0; } body { padding: 10px; } }
                        </style>
                    </head>
                    <body>
                        <div class="header">
                            <h2>POS System</h2>
                            <p>Order #${order.id}</p>
                            <p>${new Date(order.createdAt).toLocaleString()}</p>
                            <p>Cashier: ${order.cashierName || 'N/A'}</p>
                        </div>
                        <div class="items">
                            ${order.items.map(item => `
                                <div class="item">
                                    <span>${item.productName} x${item.quantity}</span>
                                    <span>${item.subtotal.toFixed(2)}</span>
                                </div>
                            `).join('')}
                        </div>
                        <div class="total">
                            <div class="item">
                                <span>Subtotal</span>
                                <span>${(order.totalAmount + (order.discount || 0)).toFixed(2)}</span>
                            </div>
                            ${order.discount ? `
                                <div class="item">
                                    <span>Discount</span>
                                    <span>-${order.discount.toFixed(2)}</span>
                                </div>
                            ` : ''}
                            <div class="item" style="font-size: 14px; margin-top: 5px;">
                                <span>Total</span>
                                <span>${order.totalAmount.toFixed(2)}</span>
                            </div>
                        </div>
                        <div class="footer">
                            <p>Payment Mode: ${order.paymentType}</p>
                            <p>Thank you for your business!</p>
                        </div>
                        <script>
                            window.onload = function() { window.print(); window.close(); }
                        </script>
                    </body>
                </html>
            `);
            receiptWindow.document.close();
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
                            <ShoppingBag className="w-6 h-6 mr-2 text-green-600" />
                            My Orders
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
                            <option value="ONLINE">Online</option>
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
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Payment Mode</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {loading ? (
                                    <tr><td colSpan={7} className="text-center py-8 text-gray-500">Loading orders...</td></tr>
                                ) : orders.length === 0 ? (
                                    <tr><td colSpan={7} className="text-center py-8 text-gray-500">No orders found</td></tr>
                                ) : (
                                    orders.map(order => (
                                        <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 text-sm font-medium text-gray-900">#{order.id}</td>
                                            <td className="px-6 py-4 text-sm text-gray-600">{order.customerName || 'Walk-in'}</td>
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {new Date(order.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                                PKR {order.totalAmount.toLocaleString()}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600 flex items-center">
                                                <span className="mr-2">{getPaymentIcon(order.paymentType)}</span>
                                                {order.paymentType}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                                                    {order.status || 'UNKNOWN'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right space-x-2">
                                                <button
                                                    onClick={() => handlePrintReceipt(order)}
                                                    className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                                    title="Print Receipt"
                                                >
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
