import React, { useEffect, useState } from 'react';
import { productService, Product } from '../api/product';
import { storeService, Store } from '../api/store';
import { categoryService, Category } from '../api/category';
import { Plus, Edit2, Trash2, X, ShoppingCart, Search } from 'lucide-react';
import AdminSidebar from '../components/AdminSidebar';
import AdminHeader from '../components/AdminHeader';

const Products: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [stores, setStores] = useState<Store[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentProduct, setCurrentProduct] = useState<Partial<Product>>({});
    const [isEditing, setIsEditing] = useState(false);
    const [selectedStoreId, setSelectedStoreId] = useState<number | null>(null);
    const [searchKeyword, setSearchKeyword] = useState('');

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
                await fetchStoreData(storeIdToUse);
            }
        } catch (err) {
            setError('Failed to fetch data');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchStoreData = async (storeId: number) => {
        try {
            const [productsData, categoriesData] = await Promise.all([
                productService.getProductsByStore(storeId),
                categoryService.getCategoriesByStore(storeId)
            ]);
            setProducts(productsData);
            setCategories(categoriesData);
        } catch (err) {
            console.error(err);
            setError('Failed to fetch store data');
        }
    };

    const handleStoreChange = async (storeId: number) => {
        setSelectedStoreId(storeId);
        setLoading(true);
        await fetchStoreData(storeId);
        setLoading(false);
    };

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedStoreId) return;

        try {
            setLoading(true);
            if (searchKeyword.trim()) {
                const data = await productService.searchProducts(selectedStoreId, searchKeyword);
                setProducts(data);
            } else {
                const data = await productService.getProductsByStore(selectedStoreId);
                setProducts(data);
            }
        } catch (err) {
            console.error(err);
            setError('Failed to search products');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const productData = { ...currentProduct };

            if (!productData.storeId && selectedStoreId) {
                productData.storeId = selectedStoreId;
            }

            if (isEditing && currentProduct.id) {
                await productService.updateProduct(currentProduct.id, productData);
            } else {
                await productService.createProduct(productData);
            }
            setIsModalOpen(false);
            setCurrentProduct({});
            setIsEditing(false);

            if (selectedStoreId) {
                const data = await productService.getProductsByStore(selectedStoreId);
                setProducts(data);
            }
        } catch (err) {
            console.error('Failed to save product', err);
            setError('Failed to save product');
        }
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await productService.deleteProduct(id);
                setProducts(products.filter((p) => p.id !== id));
            } catch (err) {
                console.error('Failed to delete product', err);
                setError('Failed to delete product');
            }
        }
    };

    const openEditModal = (product: Product) => {
        setCurrentProduct(product);
        setIsEditing(true);
        setIsModalOpen(true);
    };

    const openCreateModal = () => {
        setCurrentProduct({ storeId: selectedStoreId || undefined });
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
                            <h1 className="text-2xl font-bold text-gray-800">Products</h1>
                            <p className="text-gray-500">Manage your store inventory</p>
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
                                <span>Add Product</span>
                            </button>
                        </div>
                    </div>

                    <div className="mb-6">
                        <form onSubmit={handleSearch} className="flex gap-2">
                            <div className="relative flex-1 max-w-md">
                                <input
                                    type="text"
                                    placeholder="Search products..."
                                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                                    value={searchKeyword}
                                    onChange={(e) => setSearchKeyword(e.target.value)}
                                />
                                <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
                            </div>
                            <button
                                type="submit"
                                className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                            >
                                Search
                            </button>
                        </form>
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg mb-6">
                            {error}
                        </div>
                    )}

                    {loading ? (
                        <div className="text-center py-10 text-gray-500">Loading products...</div>
                    ) : (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-100">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
                                        <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {products.map((product) => (
                                        <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center">
                                                    <div className="bg-green-100 p-2 rounded-lg mr-3">
                                                        <ShoppingCart className="w-5 h-5 text-green-600" />
                                                    </div>
                                                    <div>
                                                        <div className="font-medium text-gray-900">{product.name}</div>
                                                        <div className="text-sm text-gray-500">{product.brand}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {product.category?.name || 'Uncategorized'}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                <div>Selling: ${product.sellingPrice}</div>
                                                <div className="text-xs text-gray-400 line-through">MRP: ${product.mrp}</div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">{product.skuId}</td>
                                            <td className="px-6 py-4 text-right space-x-2">
                                                <button
                                                    onClick={() => openEditModal(product)}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(product.id)}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {products.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-10 text-center text-gray-500">
                                                No products found. Create one to get started.
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
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl mx-4 overflow-hidden max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
                            <h2 className="text-lg font-bold text-gray-800">
                                {isEditing ? 'Edit Product' : 'New Product'}
                            </h2>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Store
                                    </label>
                                    <select
                                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        value={currentProduct.storeId || ''}
                                        onChange={(e) => setCurrentProduct({ ...currentProduct, storeId: Number(e.target.value) })}
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
                                        Category
                                    </label>
                                    <select
                                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        value={currentProduct.categoryId || ''}
                                        onChange={(e) => setCurrentProduct({ ...currentProduct, categoryId: Number(e.target.value) })}
                                        required
                                    >
                                        <option value="" disabled>Select a category</option>
                                        {categories.map(category => (
                                            <option key={category.id} value={category.id}>{category.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Product Name
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={currentProduct.name || ''}
                                    onChange={(e) =>
                                        setCurrentProduct({ ...currentProduct, name: e.target.value })
                                    }
                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Description
                                </label>
                                <textarea
                                    value={currentProduct.description || ''}
                                    onChange={(e) =>
                                        setCurrentProduct({ ...currentProduct, description: e.target.value })
                                    }
                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Brand
                                    </label>
                                    <input
                                        type="text"
                                        value={currentProduct.brand || ''}
                                        onChange={(e) =>
                                            setCurrentProduct({ ...currentProduct, brand: e.target.value })
                                        }
                                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        SKU ID
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={currentProduct.skuId || ''}
                                        onChange={(e) =>
                                            setCurrentProduct({ ...currentProduct, skuId: e.target.value })
                                        }
                                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        MRP
                                    </label>
                                    <input
                                        type="number"
                                        required
                                        value={currentProduct.mrp || ''}
                                        onChange={(e) =>
                                            setCurrentProduct({ ...currentProduct, mrp: Number(e.target.value) })
                                        }
                                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Selling Price
                                    </label>
                                    <input
                                        type="number"
                                        required
                                        value={currentProduct.sellingPrice || ''}
                                        onChange={(e) =>
                                            setCurrentProduct({ ...currentProduct, sellingPrice: Number(e.target.value) })
                                        }
                                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Image URL
                                </label>
                                <input
                                    type="text"
                                    value={currentProduct.imageUrl || ''}
                                    onChange={(e) =>
                                        setCurrentProduct({ ...currentProduct, imageUrl: e.target.value })
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
                                    {isEditing ? 'Save Changes' : 'Create Product'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Products;
