import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { RotateCcw, RefreshCw } from 'lucide-react';
import BranchManagerSidebar from '../components/BranchManagerSidebar';
import { refundService, Refund } from '../api/refund';
import toast from 'react-hot-toast';

export default function BranchRefunds() {
    const navigate = useNavigate();
    const [refunds, setRefunds] = useState<Refund[]>([]);
    const [loading, setLoading] = useState(true);

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
            const data = await refundService.getRefundsByBranch(userBranchId);
            setRefunds(data);
        } catch (error) {
            console.error('Failed to fetch refunds:', error);
            toast.error('Failed to load refunds');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/');
    };

    return (
        <div className="flex h-screen bg-gray-50 font-sans">
            <BranchManagerSidebar onLogout={handleLogout} />

            <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Header */}
                <header className="bg-white h-16 shadow-sm flex items-center justify-between px-8 z-10">
                    <h1 className="text-xl font-bold text-gray-800 flex items-center">
                        <RotateCcw className="w-6 h-6 mr-2 text-red-600" />
                        Refund Spike
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
                    {/* Table */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">ID</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Order Id</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Reason</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {loading ? (
                                    <tr><td colSpan={4} className="text-center py-8 text-gray-500">Loading refunds...</td></tr>
                                ) : refunds.length === 0 ? (
                                    <tr><td colSpan={4} className="text-center py-8 text-gray-500">No refunds found</td></tr>
                                ) : (
                                    refunds.map(refund => (
                                        <tr key={refund.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 text-sm font-medium text-gray-900">#{refund.id}</td>
                                            <td className="px-6 py-4 text-sm text-gray-600">#ORD-{refund.orderId}</td>
                                            <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                                PKR {refund.amount.toLocaleString()}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600 text-right">
                                                {refund.reason}
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
