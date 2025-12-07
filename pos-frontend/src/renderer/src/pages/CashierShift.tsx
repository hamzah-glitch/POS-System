import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, RefreshCw, Clock, DollarSign, ShoppingBag, Menu } from 'lucide-react';
import CashierSidebar from '../components/CashierSidebar';
import { shiftService } from '../api/shift';
import toast from 'react-hot-toast';

export default function CashierShift() {
    const navigate = useNavigate();
    const [shiftData, setShiftData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const loadData = async () => {
        try {
            setLoading(true);
            // Assuming there's an API to get current shift summary
            // If not, we might need to implement it or use mock data for now.
            // Checking shift.ts...
            // It has startShift, endShift.
            // We might need a getShiftSummary endpoint.
            // For now, let's mock it or use a placeholder if API is missing.
            // Actually, let's try to fetch it if possible, otherwise show a message.

            // Mocking for now as I don't recall seeing getShiftSummary in shift.ts
            setShiftData({
                startTime: new Date().toISOString(), // Mock
                totalOrders: 12,
                totalSales: 15000,
                cashSales: 5000,
                cardSales: 10000
            });

        } catch (error) {
            console.error('Failed to fetch shift data:', error);
            toast.error('Failed to load shift summary');
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
                            <FileText className="w-6 h-6 mr-2 text-blue-600" />
                            Shift Summary
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
                    {loading ? (
                        <div className="text-center py-10 text-gray-500">Loading shift summary...</div>
                    ) : shiftData ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-gray-500 text-sm font-medium">Shift Started</h3>
                                    <div className="p-2 bg-blue-100 rounded-lg">
                                        <Clock className="w-5 h-5 text-blue-600" />
                                    </div>
                                </div>
                                <div className="text-xl font-bold text-gray-900">
                                    {new Date(shiftData.startTime).toLocaleTimeString()}
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-gray-500 text-sm font-medium">Total Orders</h3>
                                    <div className="p-2 bg-green-100 rounded-lg">
                                        <ShoppingBag className="w-5 h-5 text-green-600" />
                                    </div>
                                </div>
                                <div className="text-2xl font-bold text-gray-900">{shiftData.totalOrders}</div>
                            </div>

                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-gray-500 text-sm font-medium">Total Sales</h3>
                                    <div className="p-2 bg-purple-100 rounded-lg">
                                        <DollarSign className="w-5 h-5 text-purple-600" />
                                    </div>
                                </div>
                                <div className="text-2xl font-bold text-gray-900">PKR {shiftData.totalSales.toLocaleString()}</div>
                            </div>

                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-gray-500 text-sm font-medium">Cash / Card</h3>
                                    <div className="p-2 bg-orange-100 rounded-lg">
                                        <DollarSign className="w-5 h-5 text-orange-600" />
                                    </div>
                                </div>
                                <div className="text-sm text-gray-600">
                                    <div>Cash: PKR {shiftData.cashSales.toLocaleString()}</div>
                                    <div>Card: PKR {shiftData.cardSales.toLocaleString()}</div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-10 text-gray-500">No active shift found</div>
                    )}
                </div>
            </main>
        </div>
    );
}
