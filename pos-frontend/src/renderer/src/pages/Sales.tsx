import React, { useEffect, useState } from 'react';
import { salesService, SalesStats, DailySales, PaymentMethodStats } from '../api/sales';
import { DollarSign, ShoppingBag, Users, CreditCard } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import AdminSidebar from '../components/AdminSidebar';
import AdminHeader from '../components/AdminHeader';

const Sales: React.FC = () => {
    const [stats, setStats] = useState<SalesStats | null>(null);
    const [dailySales, setDailySales] = useState<DailySales[]>([]);
    const [paymentMethods, setPaymentMethods] = useState<PaymentMethodStats[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Hardcoded branchId for now, ideally should come from context or selector
                const branchId = 1;
                const [statsData, dailyData, paymentData] = await Promise.all([
                    salesService.getStats(branchId),
                    salesService.getDailySales(branchId),
                    salesService.getSalesByPaymentMethod(branchId)
                ]);
                setStats(statsData);
                setDailySales(dailyData);
                setPaymentMethods(paymentData);
            } catch (error) {
                console.error('Failed to fetch sales data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 flex font-sans">
            <AdminSidebar />
            <div className="flex-1 ml-64">
                <AdminHeader />
                <main className="pt-20 px-6 pb-8">
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-2xl font-bold text-gray-800">Sales Management</h1>

                    </div>

                    {loading ? (
                        <div className="flex items-center justify-center h-64">
                            <div className="text-gray-500">Loading sales data...</div>
                        </div>
                    ) : (
                        <>
                            {/* Stats Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="text-sm text-gray-500 mb-1">Total Sales</p>
                                            <h3 className="text-2xl font-bold text-gray-800">₹{stats?.totalSales.toLocaleString()}</h3>
                                            <p className="text-xs text-green-500 mt-1">+0% from last week</p>
                                        </div>
                                        <div className="p-3 bg-green-100 rounded-full text-green-600">
                                            <DollarSign className="w-6 h-6" />
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="text-sm text-gray-500 mb-1">Orders Today</p>
                                            <h3 className="text-2xl font-bold text-gray-800">{stats?.ordersToday}</h3>
                                            <p className="text-xs text-green-500 mt-1">+0% from yesterday</p>
                                        </div>
                                        <div className="p-3 bg-blue-100 rounded-full text-blue-600">
                                            <ShoppingBag className="w-6 h-6" />
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="text-sm text-gray-500 mb-1">Active Cashiers</p>
                                            <h3 className="text-2xl font-bold text-gray-800">{stats?.activeCashiers}</h3>
                                            <p className="text-xs text-gray-500 mt-1">Same as yesterday</p>
                                        </div>
                                        <div className="p-3 bg-purple-100 rounded-full text-purple-600">
                                            <Users className="w-6 h-6" />
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="text-sm text-gray-500 mb-1">Avg. Order Value</p>
                                            <h3 className="text-2xl font-bold text-gray-800">₹{stats?.avgOrderValue.toFixed(0)}</h3>
                                            <p className="text-xs text-green-500 mt-1">+0% from last week</p>
                                        </div>
                                        <div className="p-3 bg-orange-100 rounded-full text-orange-600">
                                            <CreditCard className="w-6 h-6" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Charts Grid */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Daily Sales Chart */}
                                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-6">Daily Sales (Last 7 Days)</h3>
                                    <div className="h-80">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <LineChart data={dailySales}>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                                <XAxis dataKey="date" />
                                                <YAxis />
                                                <Tooltip />
                                                <Line type="monotone" dataKey="total" stroke="#10B981" strokeWidth={2} dot={{ r: 4 }} />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>

                                {/* Payment Methods Chart */}
                                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-6">Payment Methods</h3>
                                    <div className="h-80">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={paymentMethods}>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                                <XAxis dataKey="type" />
                                                <YAxis />
                                                <Tooltip />
                                                <Bar dataKey="count" fill="#10B981" radius={[4, 4, 0, 0]} />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </main>
            </div>
        </div>
    );
};

export default Sales;
