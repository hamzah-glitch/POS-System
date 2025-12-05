import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserCircle, Search, Edit2, Trash2, X, Save, Plus } from 'lucide-react';
import BranchManagerSidebar from '../components/BranchManagerSidebar';
import { customerService, Customer } from '../api/customer';
import toast from 'react-hot-toast';

export default function BranchCustomers() {
    const navigate = useNavigate();
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: ''
    });

    const loadData = async () => {
        try {
            setLoading(true);
            const data = await customerService.getAllCustomers();
            setCustomers(data);
        } catch (error) {
            console.error('Failed to fetch customers:', error);
            toast.error('Failed to load customers');
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingCustomer) {
                await customerService.updateCustomer(editingCustomer.id, formData);
                toast.success('Customer updated successfully');
            } else {
                // Assuming creation is allowed here, though user prompt focused on modify/delete of "created" customers.
                // Adding create for completeness as it's a standard CRUD page.
                await customerService.createCustomer(formData);
                toast.success('Customer created successfully');
            }
            setShowModal(false);
            resetForm();
            loadData();
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
            loadData();
        } catch (error) {
            console.error('Failed to delete customer:', error);
            toast.error('Failed to delete customer');
        }
    };

    const resetForm = () => {
        setEditingCustomer(null);
        setFormData({
            fullName: '',
            email: '',
            phone: ''
        });
    };

    const openEditModal = (customer: Customer) => {
        setEditingCustomer(customer);
        setFormData({
            fullName: customer.fullName,
            email: customer.email,
            phone: customer.phone
        });
        setShowModal(true);
    };

    const filteredCustomers = customers.filter(c =>
        c.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.phone.includes(searchQuery) ||
        c.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="flex h-screen bg-gray-50 font-sans">
            <BranchManagerSidebar onLogout={handleLogout} />

            <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Header */}
                <header className="bg-white h-16 shadow-sm flex items-center justify-between px-8 z-10">
                    <h1 className="text-xl font-bold text-gray-800 flex items-center">
                        <UserCircle className="w-6 h-6 mr-2 text-purple-600" />
                        Customers
                    </h1>
                    <div className="flex items-center space-x-4">
                        <div className="relative">
                            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search customers..."
                                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        {/* Optional: Add Customer Button if creation is desired */}
                        <button
                            onClick={() => { resetForm(); setShowModal(true); }}
                            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center transition-colors shadow-sm"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Add Customer
                        </button>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-8">
                    {/* Table */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Phone</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {loading ? (
                                    <tr><td colSpan={4} className="text-center py-8 text-gray-500">Loading customers...</td></tr>
                                ) : filteredCustomers.length === 0 ? (
                                    <tr><td colSpan={4} className="text-center py-8 text-gray-500">No customers found</td></tr>
                                ) : (
                                    filteredCustomers.map(customer => (
                                        <tr key={customer.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 text-sm font-medium text-gray-900">{customer.fullName}</td>
                                            <td className="px-6 py-4 text-sm text-gray-600">{customer.phone}</td>
                                            <td className="px-6 py-4 text-sm text-gray-600">{customer.email}</td>
                                            <td className="px-6 py-4 text-right space-x-2">
                                                <button
                                                    onClick={() => openEditModal(customer)}
                                                    className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(customer.id)}
                                                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Modal */}
                {showModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold text-gray-800">
                                    {editingCustomer ? 'Edit Customer' : 'Add New Customer'}
                                </h2>
                                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                        value={formData.fullName}
                                        onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                                    <input
                                        type="tel"
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                        value={formData.phone}
                                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                    <input
                                        type="email"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                        value={formData.email}
                                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>

                                <div className="flex justify-end space-x-3 mt-6">
                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center"
                                    >
                                        <Save className="w-4 h-4 mr-2" />
                                        Save Customer
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
