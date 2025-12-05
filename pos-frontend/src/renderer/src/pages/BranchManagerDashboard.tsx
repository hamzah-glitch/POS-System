import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    DollarSign,
    ShoppingBag,
    Users,
    Package,
    CreditCard,
    Smartphone,
    Bell,
    Sun
} from 'lucide-react';
import BranchManagerSidebar from '../components/BranchManagerSidebar';
import { branchDashboardService, BranchDashboardStats, SalesTrendData, RecentSale } from '../api/branchDashboard';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function BranchManagerDashboard() {
    const navigate = useNavigate();
    const [stats, setStats] = useState<BranchDashboardStats | null>(null);
    const [salesTrend, setSalesTrend] = useState<SalesTrendData[]>([]);
    const [recentSales, setRecentSales] = useState<RecentSale[]>([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userStr = localStorage.getItem('user');
                if (!userStr) {
                    navigate('/');
                    return;
                }
                const userData = JSON.parse(userStr);
                setUser(userData);

                if (userData.branchId) {
                    const [statsData, trendData, recentData] = await Promise.all([
                        branchDashboardService.getStats(userData.branchId),
                        branchDashboardService.getSalesTrend(userData.branchId),
                        branchDashboardService.getRecentSales(userData.branchId)
                    ]);
                    setStats(statsData);
                    setSalesTrend(trendData);
                    setRecentSales(recentData);
                }
            } catch (error) {
                console.error('Failed to fetch dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/');
    };

    if (loading) {
        return <div className="flex items-center justify-center h-screen">Loading...</div>;
    }

    return (
        <div className="flex h-screen bg-gray-50 font-sans">
            <BranchManagerSidebar onLogout={handleLogout} />

            <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
                {/* Header */}
                <header className="bg-white h-16 shadow-sm flex items-center justify-between px-8 z-10 sticky top-0">
                    <div>
                        <h1 className="text-xl font-bold text-gray-800">
                            {user?.branch?.name || 'Branch Dashboard'}
                        </h1>
                        <p className="text-xs text-gray-500">
                            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                    </div>
                    <div className="flex items-center space-x-4">
                        <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-500">
                            <Sun className="w-5 h-5" />
                        </button>
                        <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 relative">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                        </button>
                        <div className="flex items-center space-x-3 pl-4 border-l border-gray-200">
                            <div className="text-right hidden md:block">
                                <div className="text-sm font-medium text-gray-800">{user?.fullName}</div>
                                <div className="text-xs text-gray-500">{user?.email}</div>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold">
                                {user?.fullName?.charAt(0).toUpperCase()}
                            </div>
                        </div>
                    </div>
                </header>

                <div className="p-8 space-y-8">
                    <h2 className="text-2xl font-bold text-gray-800">Branch Dashboard</h2>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Today's Sales</p>
                                <h3 className="text-2xl font-bold text-gray-800">PKR {stats?.totalSales.toLocaleString()}</h3>
                                <p className="text-xs text-green-500 mt-1">+15.2% from yesterday</p>
                            </div>
                            <div className="p-3 bg-green-50 rounded-xl text-green-600">
                                <DollarSign className="w-6 h-6" />
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Orders Today</p>
                                <h3 className="text-2xl font-bold text-gray-800">{stats?.ordersToday}</h3>
                                <p className="text-xs text-gray-400 mt-1">0.00%</p>
                            </div>
                            <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
                                <ShoppingBag className="w-6 h-6" />
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Active Cashiers</p>
                                <h3 className="text-2xl font-bold text-gray-800">{stats?.activeCashiers}</h3>
                                <p className="text-xs text-gray-400 mt-1">0.00%</p>
                            </div>
                            <div className="p-3 bg-purple-50 rounded-xl text-purple-600">
                                <Users className="w-6 h-6" />
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Low Stock Items</p>
                                <h3 className="text-2xl font-bold text-gray-800">{stats?.lowStockItems}</h3>
                                <p className="text-xs text-red-500 mt-1">-100.00%</p>
                            </div>
                            <div className="p-3 bg-red-50 rounded-xl text-red-600">
                                <Package className="w-6 h-6" />
                            </div>
                        </div>
                    </div>

                    {/* Payment Breakdown & Daily Sales */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Payment Breakdown (Mock Data for now as backend endpoint exists but not integrated in this view yet) */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <h3 className="text-lg font-bold text-gray-800 mb-6">Payment Breakdown</h3>
                            <div className="space-y-6">
                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <div className="flex items-center text-gray-600">
                                            <CreditCard className="w-5 h-5 mr-2" />
                                            <span>CARD</span>
                                        </div>
                                        <div className="text-right">
                                            <span className="font-bold text-gray-800">PKR 6,996</span>
                                            <span className="text-xs text-gray-400 ml-2">51.1% (2 txns)</span>
                                        </div>
                                    </div>
                                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-green-600 rounded-full" style={{ width: '51.1%' }}></div>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <div className="flex items-center text-gray-600">
                                            <Smartphone className="w-5 h-5 mr-2" />
                                            <span>Digital Banking</span>
                                        </div>
                                        <div className="text-right">
                                            <span className="font-bold text-gray-800">PKR 6,695</span>
                                            <span className="text-xs text-gray-400 ml-2">48.9% (1 txns)</span>
                                        </div>
                                    </div>
                                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-purple-600 rounded-full" style={{ width: '48.9%' }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Daily Sales Chart */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <h3 className="text-lg font-bold text-gray-800 mb-6">Daily Sales</h3>
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={salesTrend}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                        <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
                                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
                                        <Tooltip
                                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                            cursor={{ fill: '#f9fafb' }}
                                        />
                                        <Bar dataKey="total" fill="#16a34a" radius={[4, 4, 0, 0]} barSize={40} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>

                    {/* Recent Sales */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <h3 className="text-lg font-bold text-gray-800 mb-6">Recent Sales</h3>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider rounded-l-lg">Order ID</th>
                                        <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</th>
                                        <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                                        <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                                        <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider rounded-r-lg">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {recentSales.map((sale) => (
                                        <tr key={sale.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 text-sm font-medium text-gray-900">#{sale.id}</td>
                                            <td className="px-6 py-4 text-sm text-gray-600">{sale.customerName}</td>
                                            <td className="px-6 py-4 text-sm text-gray-500">{new Date(sale.date).toLocaleDateString()}</td>
                                            <td className="px-6 py-4 text-sm font-bold text-gray-800">PKR {sale.totalAmount.toLocaleString()}</td>
                                            <td className="px-6 py-4">
                                                <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">
                                                    {sale.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
