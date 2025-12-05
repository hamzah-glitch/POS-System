import { useState, useEffect } from 'react';
import { DollarSign, ShoppingBag, Users, Store } from 'lucide-react';
import AdminSidebar from '../components/AdminSidebar';
import AdminHeader from '../components/AdminHeader';
import StatsCard from '../components/StatsCard';
import SalesTrendChart from '../components/SalesTrendChart';
import RecentSales from '../components/RecentSales';
import { dashboardService } from '../api/dashboard';

export default function Dashboard() {
    const [stats, setStats] = useState({
        totalSales: 0,
        totalOrders: 0,
        totalProducts: 0,
        totalEmployees: 0
    });
    const [salesTrend, setSalesTrend] = useState<{ name: string; sales: number }[]>([]);
    const [recentSales, setRecentSales] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userStr = localStorage.getItem('user');
                if (!userStr) return;
                const user = JSON.parse(userStr);
                const storeId = user.storeId;

                if (storeId) {
                    const [statsData, trendData, recentData] = await Promise.all([
                        dashboardService.getStats(storeId),
                        dashboardService.getSalesTrend(storeId),
                        dashboardService.getRecentSales(storeId)
                    ]);
                    setStats(statsData);

                    // Format trend data for chart
                    const formattedTrend = trendData.map((item: any) => ({
                        name: new Date(item.date).toLocaleDateString('en-US', { weekday: 'short' }),
                        sales: item.total
                    }));
                    setSalesTrend(formattedTrend);

                    setRecentSales(recentData);
                }
            } catch (error) {
                console.error('Failed to fetch dashboard data:', error);
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
                    <div className="mb-8">
                        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
                        <p className="text-gray-500">Welcome back, Admin</p>
                    </div>

                    {loading ? (
                        <div className="text-center py-10 text-gray-500">Loading dashboard...</div>
                    ) : (
                        <>
                            {/* Stats Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                                <StatsCard
                                    title="Total Sales"
                                    value={`₹${stats.totalSales.toLocaleString()}`}
                                    icon={DollarSign}
                                    trend="+12% from last month"
                                    color="green"
                                />
                                <StatsCard
                                    title="Total Orders"
                                    value={stats.totalOrders.toString()}
                                    icon={ShoppingBag}
                                    trend="+5% from last month"
                                    color="blue"
                                />
                                <StatsCard
                                    title="Total Products"
                                    value={stats.totalProducts.toString()}
                                    icon={Store}
                                    trend="+2 new added"
                                    color="orange"
                                />
                                <StatsCard
                                    title="Total Employees"
                                    value={stats.totalEmployees.toString()}
                                    icon={Users}
                                    trend="0% from last month"
                                    color="purple"
                                />
                            </div>

                            {/* Charts & Tables */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                <div className="lg:col-span-2">
                                    <SalesTrendChart data={salesTrend} />
                                </div>
                                <div>
                                    <RecentSales transactions={recentSales} />
                                </div>
                            </div>
                        </>
                    )}
                </main>
            </div>
        </div>
    );
}
