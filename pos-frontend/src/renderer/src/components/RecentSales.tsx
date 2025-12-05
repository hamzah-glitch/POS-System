interface RecentSalesProps {
    transactions: {
        id: string;
        customer: string;
        amount: number;
        status: string;
        time: string;
    }[];
}

export default function RecentSales({ transactions }: RecentSalesProps) {
    const statusColors: any = {
        Completed: 'bg-green-100 text-green-700',
        Pending: 'bg-yellow-100 text-yellow-700',
        Failed: 'bg-red-100 text-red-700',
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-gray-800">Recent Sales</h3>
                <button className="text-sm text-green-600 font-medium hover:text-green-700">View All</button>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            <th className="pb-4">Order ID</th>
                            <th className="pb-4">Customer</th>
                            <th className="pb-4">Amount</th>
                            <th className="pb-4">Status</th>
                            <th className="pb-4 text-right">Time</th>
                        </tr>
                    </thead>
                    <tbody className="space-y-4">
                        {transactions.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="text-center py-4 text-gray-500">No recent sales</td>
                            </tr>
                        ) : (
                            transactions.map((tx) => (
                                <tr key={tx.id} className="border-b border-gray-50 last:border-0">
                                    <td className="py-3 font-medium text-gray-800">#{tx.id}</td>
                                    <td className="py-3 text-gray-600">{tx.customer}</td>
                                    <td className="py-3 font-bold text-gray-800">PKR {tx.amount}</td>
                                    <td className="py-3">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[tx.status] || 'bg-gray-100 text-gray-700'}`}>
                                            {tx.status}
                                        </span>
                                    </td>
                                    <td className="py-3 text-right text-sm text-gray-500">{new Date(tx.time).toLocaleTimeString()}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
