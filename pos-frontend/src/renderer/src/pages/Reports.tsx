import React, { useEffect, useState } from 'react';
import { BarChart3, TrendingUp, Calendar, CreditCard } from 'lucide-react';
import AdminSidebar from '../components/AdminSidebar';
import AdminHeader from '../components/AdminHeader';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    LineChart,
    Line
} from 'recharts';

// Mock data for reports
const salesData = [
    { name: 'Mon', sales: 4000 },
    { name: 'Tue', sales: 3000 },
    { name: 'Wed', sales: 2000 },
    { name: 'Thu', sales: 2780 },
    { name: 'Fri', sales: 1890 },
    { name: 'Sat', sales: 2390 },
    { name: 'Sun', sales: 3490 },
];

const categoryData = [
    { name: 'Electronics', value: 400 },
    { name: 'Clothing', value: 300 },
    { name: 'Groceries', value: 300 },
    { name: 'Home', value: 200 },
];

const Reports: React.FC = () => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate data loading
        setTimeout(() => setLoading(false), 1000);
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 flex font-sans">
            <AdminSidebar />

            <div className="flex-1 ml-64">
                <AdminHeader />

                <main className="pt-20 px-6 pb-8">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">Reports & Analytics</h1>
                            <p className="text-gray-500">Detailed insights into your business performance</p>
                        </div>
                        <div className="flex gap-2">
                            <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-gray-50">
                                <Calendar className="w-4 h-4" />
                                <span>Last 7 Days</span>
                            </button>
                            <button className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-green-700">
                                <TrendingUp className="w-4 h-4" />
                                <span>Export Report</span>
                            </button>
                        </div>
                    </div>

                    {loading ? (
                        <div className="text-center py-20 text-gray-500">Loading reports...</div>
                    ) : (
                        <div className="space-y-6">
                            {/* Summary Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-gray-500 text-sm font-medium">Total Revenue</h3>
                                        <div className="p-2 bg-green-100 rounded-lg">
                                            <CreditCard className="w-5 h-5 text-green-600" />
                                        </div>
                                    </div>
                                    <div className="text-2xl font-bold text-gray-900">PKR 12,345.00</div>
                                    <div className="text-sm text-green-600 mt-1">+15% from last week</div>
                                </div>
                                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-gray-500 text-sm font-medium">Total Orders</h3>
                                        <div className="p-2 bg-blue-100 rounded-lg">
                                            <BarChart3 className="w-5 h-5 text-blue-600" />
                                        </div>
                                    </div>
                                    <div className="text-2xl font-bold text-gray-900">156</div>
                                    <div className="text-sm text-blue-600 mt-1">+8% from last week</div>
                                </div>
                                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-gray-500 text-sm font-medium">Avg. Order Value</h3>
                                        <div className="p-2 bg-purple-100 rounded-lg">
                                            <TrendingUp className="w-5 h-5 text-purple-600" />
                                        </div>
                                    </div>
                                    <div className="text-2xl font-bold text-gray-900">PKR 79.00</div>
                                    <div className="text-sm text-purple-600 mt-1">+2% from last week</div>
                                </div>
                            </div>

                            {/* Charts */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                    <h3 className="text-lg font-bold text-gray-800 mb-6">Sales Overview</h3>
                                    <div className="h-80">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={salesData}>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                                <YAxis axisLine={false} tickLine={false} />
                                                <Tooltip />
                                                <Bar dataKey="sales" fill="#16a34a" radius={[4, 4, 0, 0]} />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>

                                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                    <h3 className="text-lg font-bold text-gray-800 mb-6">Sales Trend</h3>
                                    <div className="h-80">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <LineChart data={salesData}>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                                <YAxis axisLine={false} tickLine={false} />
                                                <Tooltip />
                                                <Line type="monotone" dataKey="sales" stroke="#2563eb" strokeWidth={2} dot={{ r: 4 }} />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            </div>

                            {/* Top Categories Table */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                                <div className="px-6 py-4 border-b border-gray-100">
                                    <h3 className="text-lg font-bold text-gray-800">Top Categories</h3>
                                </div>
                                <table className="w-full">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sales</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Growth</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {categoryData.map((item, index) => (
                                            <tr key={index}>
                                                <td className="px-6 py-4 text-sm font-medium text-gray-900">{item.name}</td>
                                                <td className="px-6 py-4 text-sm text-gray-500">{item.value} sales</td>
                                                <td className="px-6 py-4 text-sm text-green-600">+12%</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default Reports;
