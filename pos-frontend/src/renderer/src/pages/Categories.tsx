import React, { useEffect, useState } from 'react';
import { categoryService, Category } from '../api/category';
import { storeService, Store } from '../api/store';
import { Plus, Edit2, Trash2, X, Tag } from 'lucide-react';
import AdminSidebar from '../components/AdminSidebar';
import AdminHeader from '../components/AdminHeader';

const Categories: React.FC = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [stores, setStores] = useState<Store[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentCategory, setCurrentCategory] = useState<Partial<Category>>({});
    const [isEditing, setIsEditing] = useState(false);
    const [selectedStoreId, setSelectedStoreId] = useState<number | null>(null);

    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        try {
            setLoading(true);
            const storesData = await storeService.getAllStores();
            setStores(storesData);

            if (storesData.length > 0) {
                const storeIdToUse = selectedStoreId || storesData[0].id;
                setSelectedStoreId(storeIdToUse);
                const categoriesData = await categoryService.getCategoriesByStore(storeIdToUse);
                setCategories(categoriesData);
            }
        } catch (err) {
            setError('Failed to fetch data');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleStoreChange = async (storeId: number) => {
        setSelectedStoreId(storeId);
        try {
            setLoading(true);
            const data = await categoryService.getCategoriesByStore(storeId);
            setCategories(data);
        } catch (err) {
            console.error(err);
            setError('Failed to fetch categories for selected store');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const categoryData = { ...currentCategory };

            if (!categoryData.storeId && selectedStoreId) {
                categoryData.storeId = selectedStoreId;
            }

            if (isEditing && currentCategory.id) {
                await categoryService.updateCategory(currentCategory.id, categoryData);
            } else {
                await categoryService.createCategory(categoryData);
            }
            setIsModalOpen(false);
            setCurrentCategory({});
            setIsEditing(false);

            if (selectedStoreId) {
                const data = await categoryService.getCategoriesByStore(selectedStoreId);
                setCategories(data);
            }
        } catch (err) {
            console.error('Failed to save category', err);
            setError('Failed to save category');
        }
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this category?')) {
            try {
                await categoryService.deleteCategory(id);
                setCategories(categories.filter((c) => c.id !== id));
            } catch (err) {
                console.error('Failed to delete category', err);
                setError('Failed to delete category');
            }
        }
    };

    const openEditModal = (category: Category) => {
        setCurrentCategory(category);
        setIsEditing(true);
        setIsModalOpen(true);
    };

    const openCreateModal = () => {
        setCurrentCategory({ storeId: selectedStoreId || undefined });
        setIsEditing(false);
        setIsModalOpen(true);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex font-sans">
            <AdminSidebar />

            <div className="flex-1 ml-64">
                <AdminHeader />

                <main className="pt-20 px-6 pb-8">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">Categories</h1>
                            <p className="text-gray-500">Manage product categories</p>
                        </div>
                        <div className="flex gap-4">
                            <select
                                className="bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                value={selectedStoreId || ''}
                                onChange={(e) => handleStoreChange(Number(e.target.value))}
                            >
                                {stores.map(store => (
                                    <option key={store.id} value={store.id}>{store.branchName}</option>
                                ))}
                            </select>
                            <button
                                onClick={openCreateModal}
                                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                            >
                                <Plus className="w-5 h-5" />
                                <span>Add Category</span>
                            </button>
                        </div>
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg mb-6">
                            {error}
                        </div>
                    )}

                    {loading ? (
                        <div className="text-center py-10 text-gray-500">Loading categories...</div>
                    ) : (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-100">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                        <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {categories.map((category) => (
                                        <tr key={category.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center">
                                                    <div className="bg-green-100 p-2 rounded-lg mr-3">
                                                        <Tag className="w-5 h-5 text-green-600" />
                                                    </div>
                                                    <div className="font-medium text-gray-900">{category.name}</div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right space-x-2">
                                                <button
                                                    onClick={() => openEditModal(category)}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(category.id)}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {categories.length === 0 && (
                                        <tr>
                                            <td colSpan={2} className="px-6 py-10 text-center text-gray-500">
                                                No categories found. Create one to get started.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </main>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4 overflow-hidden">
                        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
                            <h2 className="text-lg font-bold text-gray-800">
                                {isEditing ? 'Edit Category' : 'New Category'}
                            </h2>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Store
                                </label>
                                <select
                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    value={currentCategory.storeId || ''}
                                    onChange={(e) => setCurrentCategory({ ...currentCategory, storeId: Number(e.target.value) })}
                                    required
                                >
                                    <option value="" disabled>Select a store</option>
                                    {stores.map(store => (
                                        <option key={store.id} value={store.id}>{store.branchName}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Category Name
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={currentCategory.name || ''}
                                    onChange={(e) =>
                                        setCurrentCategory({ ...currentCategory, name: e.target.value })
                                    }
                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                />
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
                                    {isEditing ? 'Save Changes' : 'Create Category'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Categories;
