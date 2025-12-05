import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, Store as StoreIcon } from 'lucide-react';
import AdminSidebar from '../components/AdminSidebar';
import AdminHeader from '../components/AdminHeader';
import { storeService, Store } from '../api/store';

export default function Stores() {
    const [stores, setStores] = useState<Store[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingStore, setEditingStore] = useState<Store | null>(null);
    const [formData, setFormData] = useState<Partial<Store>>({
        branchName: '',
        description: '',
        storeType: '',
        status: 'ACTIVE',
        contact: {
            address: '',
            phone: '',
            email: ''
        }
    });

    useEffect(() => {
        fetchStores();
    }, []);

    const fetchStores = async () => {
        try {
            const data = await storeService.getAllStores();
            setStores(data);
        } catch (error) {
            console.error('Failed to fetch stores:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingStore) {
                await storeService.updateStore(editingStore.id, formData);
            } else {
                await storeService.createStore(formData);
            }
            setIsModalOpen(false);
            setEditingStore(null);
            resetForm();
            fetchStores();
        } catch (error) {
            console.error('Failed to save store:', error);
            alert('Failed to save store');
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this store?')) return;
        try {
            await storeService.deleteStore(id);
            fetchStores();
        } catch (error) {
            console.error('Failed to delete store:', error);
            alert('Failed to delete store');
        }
    };

    const openModal = (store?: Store) => {
        if (store) {
            setEditingStore(store);
            setFormData({
                branchName: store.branchName,
                description: store.description,
                storeType: store.storeType,
                status: store.status,
                contact: {
                    address: store.contact?.address || '',
                    phone: store.contact?.phone || '',
                    email: store.contact?.email || ''
                }
            });
        } else {
            setEditingStore(null);
            resetForm();
        }
        setIsModalOpen(true);
    };

    const resetForm = () => {
        setFormData({
            branchName: '',
            description: '',
            storeType: '',
            status: 'ACTIVE',
            contact: {
                address: '',
                phone: '',
                email: ''
            }
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 flex font-sans">
            <AdminSidebar />

            <div className="flex-1 ml-64">
                <AdminHeader />

                <main className="pt-20 px-6 pb-8">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">Stores</h1>
                            <p className="text-gray-500">Manage your retail store locations</p>
                        </div>
                        <button
                            onClick={() => openModal()}
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                        >
                            <Plus className="w-5 h-5" />
                            <span>Add Store</span>
                        </button>
                    </div>

                    {loading ? (
                        <div className="text-center py-10 text-gray-500">Loading stores...</div>
                    ) : (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-100">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Store Name</th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {stores.map((store) => (
                                        <tr key={store.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center">
                                                    <div className="bg-green-100 p-2 rounded-lg mr-3">
                                                        <StoreIcon className="w-5 h-5 text-green-600" />
                                                    </div>
                                                    <div>
                                                        <div className="font-medium text-gray-900">{store.branchName}</div>
                                                        <div className="text-sm text-gray-500">{store.description}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">{store.storeType}</td>
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                <div>{store.contact?.phone}</div>
                                                <div className="text-xs text-gray-400">{store.contact?.email}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${store.status === 'ACTIVE' ? 'bg-green-100 text-green-700' :
                                                    store.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                                                        'bg-red-100 text-red-700'
                                                    }`}>
                                                    {store.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right space-x-2">
                                                <button
                                                    onClick={() => openModal(store)}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(store.id)}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {stores.length === 0 && (
                                <div className="text-center py-10 text-gray-500">No stores found. Create one to get started.</div>
                            )}
                        </div>
                    )}
                </main>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 overflow-hidden">
                        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
                            <h2 className="text-lg font-bold text-gray-800">
                                {editingStore ? 'Edit Store' : 'Add New Store'}
                            </h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Store Name</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    value={formData.branchName}
                                    onChange={e => setFormData({ ...formData, branchName: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        value={formData.storeType}
                                        onChange={e => setFormData({ ...formData, storeType: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                    <select
                                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        value={formData.status}
                                        onChange={e => setFormData({ ...formData, status: e.target.value as any })}
                                    >
                                        <option value="ACTIVE">Active</option>
                                        <option value="PENDING">Pending</option>
                                        <option value="BLOCKED">Blocked</option>
                                    </select>
                                </div>
                            </div>
                            <div className="space-y-4 pt-4 border-t border-gray-100">
                                <h3 className="text-sm font-medium text-gray-900">Contact Information</h3>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        value={formData.contact?.address}
                                        onChange={e => setFormData({
                                            ...formData,
                                            contact: { ...formData.contact, address: e.target.value }
                                        })}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                            value={formData.contact?.phone}
                                            onChange={e => setFormData({
                                                ...formData,
                                                contact: { ...formData.contact, phone: e.target.value }
                                            })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                        <input
                                            type="email"
                                            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                            value={formData.contact?.email}
                                            onChange={e => setFormData({
                                                ...formData,
                                                contact: { ...formData.contact, email: e.target.value }
                                            })}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-end space-x-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                                >
                                    {editingStore ? 'Save Changes' : 'Create Store'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
