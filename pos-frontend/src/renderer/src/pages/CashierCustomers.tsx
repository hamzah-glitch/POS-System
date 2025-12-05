import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Edit2, Trash2, User, Phone, Mail, X, Save } from 'lucide-react';
import CashierSidebar from '../components/CashierSidebar';
import { customerService, Customer } from '../api/customer';
import { shiftService } from '../api/shift';
import toast from 'react-hot-toast';

export default function CashierCustomers() {
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: ''
    });

    useEffect(() => {
        fetchCustomers();
    }, []);

    const fetchCustomers = async () => {
        try {
            const data = await customerService.getAllCustomers();
            setCustomers(data);
        } catch (error) {
            console.error('Failed to fetch customers:', error);
            toast.error('Failed to load customers');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async (query: string) => {
        setSearchQuery(query);
        if (query.trim() === '') {
            fetchCustomers();
            return;
        }
        try {
            const data = await customerService.searchCustomers(query);
            setCustomers(data);
        } catch (error) {
            console.error('Failed to search customers:', error);
        }
    };

    const handleLogout = async () => {
        try {
            await shiftService.endShift();
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            navigate('/');
        } catch (error) {
            console.error('Error ending shift:', error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingCustomer) {
                await customerService.updateCustomer(editingCustomer.id, formData);
                toast.success('Customer updated successfully');
            } else {
                await customerService.createCustomer(formData);
                toast.success('Customer created successfully');
            }
            setIsModalOpen(false);
            fetchCustomers();
            resetForm();
        } catch (error) {
            console.error('Failed to save customer:', error);
            toast.error('Failed to save customer');
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('Are you sure you want to delete this customer?')) return;
        try {
            await customerService.deleteCustomer(id);
            toast.success('Customer deleted successfully');
            fetchCustomers();
        } catch (error) {
            console.error('Failed to delete customer:', error);
            toast.error('Failed to delete customer');
        }
    };

    const openEditModal = (customer: Customer) => {
        setEditingCustomer(customer);
        setFormData({
            fullName: customer.fullName,
            email: customer.email,
            phone: customer.phone
        });
        setIsModalOpen(true);
    };

    const openCreateModal = () => {
        setEditingCustomer(null);
        resetForm();
        setIsModalOpen(true);
    };

    const resetForm = () => {
        setFormData({
            fullName: '',
            email: '',
            phone: ''
        });
    };

    return (
        <div className="flex h-screen bg-gray-100 font-sans overflow-hidden">
            <CashierSidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                onLogout={handleLogout}
            />

            <main className="flex-1 flex flex-col min-w-0">
                {/* Header */}
                <header className="bg-white h-16 shadow-sm flex items-center justify-between px-6 z-10">
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="p-2 hover:bg-gray-100 rounded-lg text-gray-600"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                        </button>
                        <h1 className="text-xl font-bold text-gray-800">Customers</h1>
                    </div>
                </header>

                <div className="flex-1 p-6 overflow-hidden flex flex-col">
                    {/* Actions Bar */}
                    <div className="flex justify-between items-center mb-6">
                        <div className="relative w-96">
                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                                <Search className="w-5 h-5" />
                            </span>
                            <input
                                type="text"
                                placeholder="Search customers..."
                                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
                                value={searchQuery}
                                onChange={(e) => handleSearch(e.target.value)}
                            />
                        </div>
                        <button
                            onClick={openCreateModal}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 flex items-center shadow-sm"
                        >
                            <Plus className="w-5 h-5 mr-2" />
                            Add Customer
                        </button>
                    </div>

                    {/* Customers List */}
                    <div className="flex-1 overflow-y-auto bg-white rounded-xl shadow-sm border border-gray-100">
                        {loading ? (
                            <div className="flex items-center justify-center h-full text-gray-500">Loading customers...</div>
                        ) : customers.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-gray-500">
                                <User className="w-16 h-16 mb-4 opacity-20" />
                                <p>No customers found</p>
                            </div>
                        ) : (
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 border-b border-gray-100">
                                    <tr>
                                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Contact Info</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Joined Date</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {customers.map((customer) => (
                                        <tr key={customer.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center">
                                                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold mr-3">
                                                        {customer.fullName.charAt(0).toUpperCase()}
                                                    </div>
                                                    <span className="font-medium text-gray-900">{customer.fullName}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col space-y-1">
                                                    <div className="flex items-center text-sm text-gray-600">
                                                        <Mail className="w-4 h-4 mr-2 text-gray-400" />
                                                        {customer.email}
                                                    </div>
                                                    <div className="flex items-center text-sm text-gray-600">
                                                        <Phone className="w-4 h-4 mr-2 text-gray-400" />
                                                        {customer.phone}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500">
                                                {customer.createdAt ? new Date(customer.createdAt).toLocaleDateString() : 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 text-right space-x-2">
                                                <button
                                                    onClick={() => openEditModal(customer)}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                    title="Edit"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(customer.id)}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Delete"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </main>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <h2 className="text-lg font-bold text-gray-800">
                                {editingCustomer ? 'Edit Customer' : 'Add New Customer'}
                            </h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                                    value={formData.fullName}
                                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input
                                    type="email"
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                                <input
                                    type="tel"
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                />
                            </div>
                            <div className="pt-4 flex space-x-3">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium flex items-center justify-center"
                                >
                                    <Save className="w-4 h-4 mr-2" />
                                    Save Customer
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
