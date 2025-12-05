import React, { useEffect, useState } from 'react';
import { alertService, RefundSpike } from '../api/alert';
import { Employee } from '../api/employee';
import { Product } from '../api/product';
import { Branch } from '../api/branch';
import { ShoppingBag, DollarSign, UserX, TrendingDown } from 'lucide-react';
import AdminSidebar from '../components/AdminSidebar';
import AdminHeader from '../components/AdminHeader';

const Alerts: React.FC = () => {
    const [inactiveCashiers, setInactiveCashiers] = useState<Employee[]>([]);
    const [lowStockProducts, setLowStockProducts] = useState<Product[]>([]);
    const [noSaleBranches, setNoSaleBranches] = useState<Branch[]>([]);
    const [refundSpikes, setRefundSpikes] = useState<RefundSpike[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [cashiers, products, branches, refunds] = await Promise.all([
                    alertService.getInactiveCashiers(),
                    alertService.getLowStockProducts(),
                    alertService.getBranchesWithNoSalesToday(),
                    alertService.getRefundSpikes()
                ]);
                setInactiveCashiers(cashiers);
                setLowStockProducts(products);
                setNoSaleBranches(branches);
                setRefundSpikes(refunds);
            } catch (error) {
                console.error('Failed to fetch alerts:', error);
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
                        <h1 className="text-2xl font-bold text-gray-800">Alerts</h1>
                    </div>

                    {loading ? (
                        <div className="flex items-center justify-center h-64">
                            <div className="text-gray-500">Loading alerts...</div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Inactive Cashiers */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <UserX className="w-5 h-5 text-red-500" />
                                    <h2 className="text-lg font-semibold text-gray-800">Inactive Cashiers</h2>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm text-left">
                                        <thead className="text-xs text-gray-500 uppercase bg-gray-50">
                                            <tr>
                                                <th className="px-4 py-2">ID</th>
                                                <th className="px-4 py-2">Full Name</th>
                                                <th className="px-4 py-2">Last Login</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {inactiveCashiers.length === 0 ? (
                                                <tr><td colSpan={3} className="px-4 py-4 text-center text-gray-500">No inactive cashiers</td></tr>
                                            ) : (
                                                inactiveCashiers.map(user => (
                                                    <tr key={user.id} className="border-b hover:bg-gray-50">
                                                        <td className="px-4 py-3 text-gray-500">#{user.id}</td>
                                                        <td className="px-4 py-3 font-medium text-gray-900">
                                                            <div>{user.fullName}</div>
                                                            <div className="text-xs text-gray-500">{user.email}</div>
                                                        </td>
                                                        <td className="px-4 py-3 text-gray-500">
                                                            {user.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'Never'}
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Low Stock Alerts */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <ShoppingBag className="w-5 h-5 text-orange-500" />
                                    <h2 className="text-lg font-semibold text-gray-800">Low Stock Alerts</h2>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm text-left">
                                        <thead className="text-xs text-gray-500 uppercase bg-gray-50">
                                            <tr>
                                                <th className="px-4 py-2">Product</th>
                                                <th className="px-4 py-2">Category</th>
                                                <th className="px-4 py-2">Stock</th>
                                                <th className="px-4 py-2">Price</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {lowStockProducts.length === 0 ? (
                                                <tr><td colSpan={4} className="px-4 py-4 text-center text-gray-500">No low stock products</td></tr>
                                            ) : (
                                                lowStockProducts.map(product => (
                                                    <tr key={product.id} className="border-b hover:bg-gray-50">
                                                        <td className="px-4 py-3 font-medium text-gray-900 flex items-center gap-2">
                                                            {product.imageUrl && <img src={product.imageUrl} alt="" className="w-8 h-8 rounded object-cover" />}
                                                            <div>
                                                                <div>{product.name}</div>
                                                                <div className="text-xs text-gray-500 truncate max-w-[150px]">{product.description}</div>
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-3 text-gray-500">{product.categoryId}</td>
                                                        <td className="px-4 py-3 text-red-600 font-bold">{product.stockQuantity}</td>
                                                        <td className="px-4 py-3 text-gray-900">PKR {product.sellingPrice}</td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* No Sale Today */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <TrendingDown className="w-5 h-5 text-gray-500" />
                                    <h2 className="text-lg font-semibold text-gray-800">No Sale Today</h2>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm text-left">
                                        <thead className="text-xs text-gray-500 uppercase bg-gray-50">
                                            <tr>
                                                <th className="px-4 py-2">ID</th>
                                                <th className="px-4 py-2">Branch Name</th>
                                                <th className="px-4 py-2">Address</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {noSaleBranches.length === 0 ? (
                                                <tr><td colSpan={3} className="px-4 py-4 text-center text-gray-500">All branches have sales today!</td></tr>
                                            ) : (
                                                noSaleBranches.map(branch => (
                                                    <tr key={branch.id} className="border-b hover:bg-gray-50">
                                                        <td className="px-4 py-3 text-gray-500">{branch.id}</td>
                                                        <td className="px-4 py-3 font-medium text-gray-900">{branch.name}</td>
                                                        <td className="px-4 py-3 text-gray-500">{branch.address}</td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Refund Spike */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <DollarSign className="w-5 h-5 text-red-600" />
                                    <h2 className="text-lg font-semibold text-gray-800">Refund Spike</h2>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm text-left">
                                        <thead className="text-xs text-gray-500 uppercase bg-gray-50">
                                            <tr>
                                                <th className="px-4 py-2">ID</th>
                                                <th className="px-4 py-2">Cashier Name</th>
                                                <th className="px-4 py-2">Amount</th>
                                                <th className="px-4 py-2">Reason</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {refundSpikes.length === 0 ? (
                                                <tr><td colSpan={4} className="px-4 py-4 text-center text-gray-500">No refund spikes detected</td></tr>
                                            ) : (
                                                refundSpikes.map((spike, index) => (
                                                    <tr key={index} className="border-b hover:bg-gray-50">
                                                        <td className="px-4 py-3 text-gray-500">{spike.id}</td>
                                                        <td className="px-4 py-3 font-medium text-gray-900">{spike.cashierName}</td>
                                                        <td className="px-4 py-3 text-red-600 font-bold">PKR {spike.amount.toFixed(2)}</td>
                                                        <td className="px-4 py-3 text-gray-500">{spike.reason}</td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default Alerts;
