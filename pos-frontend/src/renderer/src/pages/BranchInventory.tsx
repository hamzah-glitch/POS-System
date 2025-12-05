import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Edit2, Trash2, X, Save, Package, RefreshCw } from 'lucide-react';
import BranchManagerSidebar from '../components/BranchManagerSidebar';
import { inventoryService, InventoryItem } from '../api/inventory';
import { productService, Product } from '../api/product';
import { categoryService, Category } from '../api/category';
import toast from 'react-hot-toast';

export default function BranchInventory() {
    const navigate = useNavigate();
    const [inventory, setInventory] = useState<InventoryItem[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
    const [branchId, setBranchId] = useState<number | null>(null);
    const [storeId, setStoreId] = useState<number | null>(null);

    // Form State
    const [formData, setFormData] = useState({
        productId: '',
        quantity: ''
    });

    const loadData = async () => {
        try {
            const userStr = localStorage.getItem('user');
            if (!userStr) {
                navigate('/');
                return;
            }
            const userData = JSON.parse(userStr);
            const userBranchId = userData.branchId;
            const userStoreId = userData.storeId;

            if (!userBranchId || !userStoreId) {
                toast.error('Branch or Store information missing');
                return;
            }

            setBranchId(userBranchId);
            setStoreId(userStoreId);
            setLoading(true);

            const [inventoryData, productsData, categoriesData] = await Promise.all([
                inventoryService.getInventoryByBranch(userBranchId),
                productService.getProductsByStore(userStoreId),
                categoryService.getCategoriesByStore(userStoreId)
            ]);

            setInventory(inventoryData);
            setProducts(productsData);
            setCategories(categoriesData);
        } catch (error) {
            console.error('Failed to fetch inventory:', error);
            toast.error('Failed to load inventory data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, [navigate]);

    const resetForm = () => {
        setFormData({
            productId: '',
            quantity: ''
        });
        setEditingItem(null);
    };

    const openModal = (item?: InventoryItem) => {
        if (item) {
            setEditingItem(item);
            setFormData({
                productId: item.productId.toString(),
                quantity: item.quantity.toString()
            });
        } else {
            resetForm();
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!branchId) return;

        try {
            if (editingItem) {
                // Update
                await inventoryService.updateInventory(editingItem.id, {
                    quantity: parseInt(formData.quantity)
                });
                toast.success('Inventory updated successfully');
            } else {
                // Create
                await inventoryService.createInventory({
                    branchId: branchId,
                    productId: parseInt(formData.productId),
                    quantity: parseInt(formData.quantity)
                });
                toast.success('Inventory created successfully');
            }

            // Refresh only inventory
            const updatedInventory = await inventoryService.getInventoryByBranch(branchId);
            setInventory(updatedInventory);
            setIsModalOpen(false);
            resetForm();
        } catch (error: any) {
            console.error('Failed to save inventory:', error);
            const msg = error.response?.data?.message || 'Failed to save inventory';
            toast.error(msg);
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('Are you sure you want to delete this inventory item?')) return;
        if (!branchId) return;

        try {
            await inventoryService.deleteInventory(id);
            toast.success('Inventory deleted successfully');
            const updatedInventory = await inventoryService.getInventoryByBranch(branchId);
            setInventory(updatedInventory);
        } catch (error: any) {
            console.error('Failed to delete inventory:', error);
            toast.error('Failed to delete inventory');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/');
    };

    const totalQuantity = inventory.reduce((sum, item) => sum + item.quantity, 0);

    const filteredInventory = inventory.filter(item => {
        const product = products.find(p => p.id === item.productId);
        if (!product) return false;

        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.skuId.toLowerCase().includes(searchQuery.toLowerCase());

        const productCategoryId = product.category?.id || product.categoryId;
        const matchesCategory = !categoryFilter || (productCategoryId && productCategoryId.toString() === categoryFilter);

        return matchesSearch && matchesCategory;
    });

    // Get available products (not yet in inventory)
    const availableProducts = products.filter(p =>
        !inventory.some(inv => inv.productId === p.id)
    );

    return (
        <div className="flex h-screen bg-gray-50 font-sans">
            <BranchManagerSidebar onLogout={handleLogout} />

            <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Header */}
                <header className="bg-white h-16 shadow-sm flex items-center justify-between px-8 z-10">
                    <h1 className="text-xl font-bold text-gray-800 flex items-center">
                        <Package className="w-6 h-6 mr-2 text-green-600" />
                        Inventory Management
                    </h1>
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={loadData}
                            className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Refresh Data"
                        >
                            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                        </button>
                        <button
                            onClick={() => openModal()}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center transition-colors shadow-sm"
                        >
                            <Plus className="w-5 h-5 mr-2" />
                            Add Inventory
                        </button>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-8">
                    {/* Search and Filters */}
                    <div className="mb-6 flex gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search by name or SKU..."
                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 bg-white shadow-sm"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <select
                            className="px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 bg-white shadow-sm"
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                        >
                            <option value="">All Categories</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                        <div className="px-6 py-3 bg-green-50 text-green-700 rounded-xl border border-green-200 font-semibold flex items-center whitespace-nowrap">
                            Total Quantity: {totalQuantity}
                        </div>
                    </div>

                    {/* Table */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">SKU</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Product Name</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Quantity</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {loading ? (
                                    <tr><td colSpan={5} className="text-center py-8 text-gray-500">Loading inventory...</td></tr>
                                ) : filteredInventory.length === 0 ? (
                                    <tr><td colSpan={5} className="text-center py-8 text-gray-500">No inventory items found</td></tr>
                                ) : (
                                    filteredInventory.map(item => {
                                        const product = products.find(p => p.id === item.productId);
                                        if (!product) return null;

                                        return (
                                            <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4 text-sm text-gray-600">{product.skuId}</td>
                                                <td className="px-6 py-4">
                                                    <div className="font-medium text-gray-900">{product.name}</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-3 py-1 text-sm font-medium rounded-full ${item.quantity < 10 ? 'bg-red-100 text-red-700' :
                                                        item.quantity < 50 ? 'bg-yellow-100 text-yellow-700' :
                                                            'bg-green-100 text-green-700'
                                                        }`}>
                                                        {item.quantity}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-600">{product.category?.name || 'N/A'}</td>
                                                <td className="px-6 py-4 text-right space-x-2">
                                                    <button
                                                        onClick={() => openModal(item)}
                                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                        title="Edit"
                                                    >
                                                        <Edit2 className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(item.id)}
                                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                        title="Delete"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <h2 className="text-lg font-bold text-gray-800">
                                {editingItem ? 'Edit Inventory' : 'Add Inventory'}
                            </h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6">
                            {!editingItem && (
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Product</label>
                                    <select
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        value={formData.productId}
                                        onChange={(e) => setFormData(prev => ({ ...prev, productId: e.target.value }))}
                                        required
                                    >
                                        <option value="">Select Product</option>
                                        {products.length === 0 ? (
                                            <option disabled>No products found in this store</option>
                                        ) : (
                                            availableProducts.map(product => (
                                                <option key={product.id} value={product.id}>
                                                    {product.name} ({product.skuId})
                                                </option>
                                            ))
                                        )}
                                    </select>
                                    {products.length === 0 && (
                                        <p className="text-xs text-red-500 mt-1">
                                            No products found. Please contact admin to add products to this store.
                                        </p>
                                    )}
                                </div>
                            )}

                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                                <input
                                    type="number"
                                    min="0"
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    value={formData.quantity}
                                    onChange={(e) => setFormData(prev => ({ ...prev, quantity: e.target.value }))}
                                />
                            </div>

                            <div className="flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium flex items-center shadow-lg shadow-green-500/30"
                                >
                                    <Save className="w-5 h-5 mr-2" />
                                    Save
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
