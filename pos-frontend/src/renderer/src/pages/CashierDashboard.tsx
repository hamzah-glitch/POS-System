import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { shiftService } from '../api/shift';
import { productService, Product } from '../api/product';
import { categoryService, Category } from '../api/category';
import { customerService, Customer } from '../api/customer';
import { orderService } from '../api/order';
import { Search, Scan, Menu, User, Trash2, ShoppingCart, Percent, FileText, X, CreditCard, Banknote, Globe } from 'lucide-react';
import CashierSidebar from '../components/CashierSidebar';
import toast from 'react-hot-toast';

export default function CashierDashboard() {
    const navigate = useNavigate();
    const [cart, setCart] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<number | 'All'>('All');
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // New states for Right Panel & Modals
    const [discountAmount, setDiscountAmount] = useState('');
    const [discountType, setDiscountType] = useState<'PERCENT' | 'FIXED'>('PERCENT');
    const [orderNote, setOrderNote] = useState('');
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

    // Modals
    const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [customerSearch, setCustomerSearch] = useState('');
    const [paymentMethod, setPaymentMethod] = useState<'CASH' | 'CARD' | 'ONLINE'>('CASH');
    const [processingPayment, setProcessingPayment] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userStr = localStorage.getItem('user');
                if (!userStr) {
                    toast.error('No user found in local storage');
                    return;
                }
                const user = JSON.parse(userStr);
                const storeId = user.storeId;

                console.log('User:', user);
                console.log('Store ID:', storeId);

                if (storeId) {
                    const [productsData, categoriesData] = await Promise.all([
                        productService.getProductsByStore(storeId),
                        categoryService.getCategoriesByStore(storeId)
                    ]);
                    console.log('Products:', productsData);
                    setProducts(productsData);
                    setCategories(categoriesData);

                    if (productsData.length === 0) {
                        toast('No products found for this store', { icon: 'ℹ️' });
                    }
                } else {
                    console.warn('No storeId found for user. Products cannot be loaded.');
                    toast.error('Store ID missing for user. Please contact admin.');
                }
            } catch (error) {
                console.error('Failed to fetch data:', error);
                toast.error('Failed to load products');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Fetch customers when modal opens
    useEffect(() => {
        if (isCustomerModalOpen) {
            const fetchCustomers = async () => {
                try {
                    const data = await customerService.getAllCustomers();
                    setCustomers(data);
                } catch (error) {
                    console.error('Failed to fetch customers:', error);
                    toast.error('Failed to load customers');
                }
            };
            fetchCustomers();
        }
    }, [isCustomerModalOpen]);

    const addToCart = (product: Product) => {
        setCart(prev => {
            const existing = prev.find(item => item.id === product.id);
            if (existing) {
                return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
            }
            return [...prev, { ...product, quantity: 1 }];
        });
    };

    const updateQuantity = (productId: number, delta: number) => {
        setCart(prev => prev.map(item => {
            if (item.id === productId) {
                const newQty = Math.max(0, item.quantity + delta);
                return { ...item, quantity: newQty };
            }
            return item;
        }).filter(item => item.quantity > 0));
    };

    const calculateSubtotal = () => {
        return cart.reduce((sum, item) => sum + (item.sellingPrice * item.quantity), 0);
    };

    const calculateDiscount = () => {
        const subtotal = calculateSubtotal();
        let discount = 0;
        if (discountAmount) {
            const val = parseFloat(discountAmount);
            if (!isNaN(val)) {
                if (discountType === 'PERCENT') {
                    discount = subtotal * (val / 100);
                } else {
                    discount = val;
                }
            }
        }
        return discount;
    };

    const calculateTotal = () => {
        return Math.max(0, calculateSubtotal() - calculateDiscount());
    };

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

    const handlePayment = async () => {
        if (cart.length === 0) {
            toast.error('Cart is empty');
            return;
        }

        setProcessingPayment(true);
        try {
            const orderData = {
                customerId: selectedCustomer?.id,
                paymentType: paymentMethod,
                discount: calculateDiscount(),
                note: orderNote,
                items: cart.map(item => ({
                    productId: item.id,
                    quantity: item.quantity
                }))
            };

            await orderService.createOrder(orderData);
            toast.success('Order has been pushed successfully! 🚀\nKeep up the great work! ✨');

            // Reset state
            setCart([]);
            setSelectedCustomer(null);
            setDiscountAmount('');
            setDiscountType('PERCENT');
            setOrderNote('');
            setPaymentMethod('CASH');
            setSearchQuery('');
            setIsPaymentModalOpen(false);
        } catch (error) {
            console.error('Payment failed:', error);
            toast.error('Payment failed. Please try again.');
        } finally {
            setProcessingPayment(false);
        }
    };

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        (selectedCategory === 'All' || p.category?.id === selectedCategory)
    );

    const filteredCustomers = customers.filter(c =>
        c.fullName.toLowerCase().includes(customerSearch.toLowerCase()) ||
        c.phone.includes(customerSearch)
    );

    return (
        <div className="flex h-screen bg-gray-100 font-sans overflow-hidden">
            <CashierSidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                onLogout={handleLogout}
            />

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0">
                {/* Header */}
                <header className="bg-white h-16 shadow-sm flex items-center justify-between px-6 z-10">
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="p-2 hover:bg-gray-100 rounded-lg text-gray-600"
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                        <div>
                            <h1 className="text-xl font-bold text-gray-800">POS Terminal</h1>
                            <p className="text-xs text-gray-500">Create new order</p>
                        </div>
                    </div>
                    <div className="text-sm text-gray-500 hidden md:block">
                        F1: Search | F2: Discount | F3: Customer | Ctrl+Enter: Payment
                    </div>
                </header>

                <div className="flex-1 flex overflow-hidden">
                    {/* Left Panel: Products */}
                    <div className="flex-1 flex flex-col p-6 overflow-hidden">
                        {/* Search Bar */}
                        <div className="flex space-x-4 mb-6">
                            <div className="flex-1 relative">
                                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                                    <Search className="w-5 h-5" />
                                </span>
                                <input
                                    type="text"
                                    placeholder="Search products or scan barcode (F1)"
                                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <button className="px-6 py-3 bg-white border border-gray-200 rounded-lg font-medium text-gray-700 hover:bg-gray-50 flex items-center">
                                <Scan className="w-5 h-5 mr-2" />
                                Scan
                            </button>
                        </div>

                        {/* Categories */}
                        <div className="flex space-x-2 mb-4 overflow-x-auto pb-2 scrollbar-hide">
                            <button
                                onClick={() => setSelectedCategory('All')}
                                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${selectedCategory === 'All' ? 'bg-green-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'}`}
                            >
                                All
                            </button>
                            {categories.map(cat => (
                                <button
                                    key={cat.id}
                                    onClick={() => setSelectedCategory(cat.id)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${selectedCategory === cat.id ? 'bg-green-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'}`}
                                >
                                    {cat.name}
                                </button>
                            ))}
                        </div>

                        {/* Product Grid */}
                        <div className="flex-1 overflow-y-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 pb-4">
                            {loading ? (
                                <div className="col-span-full text-center py-10 text-gray-500">Loading products...</div>
                            ) : filteredProducts.length === 0 ? (
                                <div className="col-span-full text-center py-10 text-gray-500">No products found</div>
                            ) : (
                                filteredProducts.map(product => (
                                    <div
                                        key={product.id}
                                        onClick={() => addToCart(product)}
                                        className="bg-white rounded-xl p-3 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col border border-gray-100"
                                    >
                                        <div className="aspect-square bg-gray-50 rounded-lg mb-3 overflow-hidden relative group">
                                            {product.imageUrl ? (
                                                <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-300">
                                                    <ShoppingCart className="w-8 h-8" />
                                                </div>
                                            )}
                                        </div>
                                        <h3 className="font-medium text-gray-800 line-clamp-2 text-sm mb-1">{product.name}</h3>
                                        <div className="mt-auto flex justify-between items-center">
                                            <span className="text-xs text-gray-500 truncate max-w-[50%]">{product.category?.name}</span>
                                            <span className="font-bold text-green-600">PKR {product.sellingPrice}</span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Right Panel: Cart & Checkout */}
                    <div className="w-96 bg-white border-l border-gray-200 flex flex-col shadow-xl z-20">
                        {/* Cart Header */}
                        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <div className="flex items-center">
                                <ShoppingCart className="w-5 h-5 mr-2 text-gray-600" />
                                <span className="font-bold text-gray-800">Cart ({cart.length} items)</span>
                            </div>
                            <div className="flex space-x-2">
                                <button onClick={() => setCart([])} className="px-3 py-1 bg-white border border-red-200 text-red-500 rounded text-sm hover:bg-red-50 flex items-center">
                                    <Trash2 className="w-3 h-3 mr-1" /> Clear
                                </button>
                            </div>
                        </div>

                        {/* Cart Items List */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-3">
                            {cart.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-gray-400">
                                    <ShoppingCart className="w-16 h-16 mb-4 opacity-20" />
                                    <p>Cart is empty</p>
                                    <p className="text-sm">Add products to start an order</p>
                                </div>
                            ) : (
                                cart.map(item => (
                                    <div key={item.id} className="flex items-center justify-between bg-white border border-gray-100 p-3 rounded-lg shadow-sm">
                                        <div className="flex-1">
                                            <h4 className="font-medium text-gray-800 line-clamp-1 text-sm">{item.name}</h4>
                                            <div className="text-xs text-gray-500">PKR {item.sellingPrice} x {item.quantity}</div>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <button onClick={() => updateQuantity(item.id, -1)} className="w-6 h-6 flex items-center justify-center bg-gray-100 rounded hover:bg-gray-200 text-gray-600">-</button>
                                            <span className="font-medium w-6 text-center text-sm">{item.quantity}</span>
                                            <button onClick={() => updateQuantity(item.id, 1)} className="w-6 h-6 flex items-center justify-center bg-gray-100 rounded hover:bg-gray-200 text-gray-600">+</button>
                                        </div>
                                        <div className="ml-3 font-bold text-gray-800 w-16 text-right text-sm">
                                            PKR {item.sellingPrice * item.quantity}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Checkout Section */}
                        <div className="p-4 border-t border-gray-100 bg-white space-y-4">
                            {/* Customer */}
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label className="text-sm font-medium text-gray-700 flex items-center">
                                        <User className="w-4 h-4 mr-1" /> Customer
                                    </label>
                                    {selectedCustomer && (
                                        <button onClick={() => setSelectedCustomer(null)} className="text-xs text-red-500 hover:underline">Remove</button>
                                    )}
                                </div>
                                <button
                                    onClick={() => setIsCustomerModalOpen(true)}
                                    className={`w-full py-2 border rounded-lg flex items-center justify-center text-sm transition-colors ${selectedCustomer ? 'bg-green-50 border-green-200 text-green-700' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'}`}
                                >
                                    <User className="w-4 h-4 mr-2" />
                                    {selectedCustomer ? selectedCustomer.fullName : 'Select Customer'}
                                </button>
                            </div>

                            {/* Discount */}
                            <div>
                                <label className="text-sm font-medium text-gray-700 flex items-center mb-2">
                                    <Percent className="w-4 h-4 mr-1" /> Discount
                                </label>
                                <div className="flex space-x-2">
                                    <input
                                        type="number"
                                        placeholder="Discount amount"
                                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        value={discountAmount}
                                        onChange={(e) => setDiscountAmount(e.target.value)}
                                    />
                                    <div className="flex bg-gray-100 rounded-lg p-1 border border-gray-200">
                                        <button
                                            onClick={() => setDiscountType('PERCENT')}
                                            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${discountType === 'PERCENT' ? 'bg-white shadow text-gray-800' : 'text-gray-500 hover:text-gray-700'}`}
                                        >
                                            %
                                        </button>
                                        <button
                                            onClick={() => setDiscountType('FIXED')}
                                            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${discountType === 'FIXED' ? 'bg-white shadow text-gray-800' : 'text-gray-500 hover:text-gray-700'}`}
                                        >
                                            PKR
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Order Note */}
                            <div>
                                <label className="text-sm font-medium text-gray-700 flex items-center mb-2">
                                    <FileText className="w-4 h-4 mr-1" /> Order Note
                                </label>
                                <textarea
                                    placeholder="Add order note..."
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none h-20"
                                    value={orderNote}
                                    onChange={(e) => setOrderNote(e.target.value)}
                                />
                            </div>

                            {/* Totals & Pay */}
                            <div className="pt-2 border-t border-gray-100">
                                <div className="flex justify-between items-center mb-4">
                                    <div>
                                        <div className="text-2xl font-bold text-green-600">PKR {calculateTotal().toFixed(2)}</div>
                                        <div className="text-xs text-gray-500">Total Amount</div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setIsPaymentModalOpen(true)}
                                    disabled={cart.length === 0}
                                    className="w-full py-3 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 shadow-lg shadow-green-500/30 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Pay Now
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Customer Selection Modal */}
            {isCustomerModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4 overflow-hidden">
                        <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                            <h2 className="text-lg font-bold text-gray-800">Select Customer</h2>
                            <button onClick={() => setIsCustomerModalOpen(false)} className="text-gray-500 hover:text-gray-700">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <div className="p-4">
                            <div className="relative mb-4">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder="Search by name or phone..."
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    value={customerSearch}
                                    onChange={(e) => setCustomerSearch(e.target.value)}
                                />
                            </div>
                            <div className="max-h-60 overflow-y-auto space-y-2">
                                {filteredCustomers.map(customer => (
                                    <button
                                        key={customer.id}
                                        onClick={() => {
                                            setSelectedCustomer(customer);
                                            setIsCustomerModalOpen(false);
                                        }}
                                        className="w-full text-left p-3 rounded-lg hover:bg-gray-50 flex justify-between items-center group transition-colors"
                                    >
                                        <div>
                                            <div className="font-medium text-gray-800">{customer.fullName}</div>
                                            <div className="text-sm text-gray-500">{customer.phone}</div>
                                        </div>
                                        {selectedCustomer?.id === customer.id && (
                                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                        )}
                                    </button>
                                ))}
                                {filteredCustomers.length === 0 && (
                                    <div className="text-center py-8 text-gray-500">No customers found</div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Payment Modal */}
            {isPaymentModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4 overflow-hidden">
                        <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                            <h2 className="text-lg font-bold text-gray-800">Payment</h2>
                            <button onClick={() => setIsPaymentModalOpen(false)} className="text-gray-500 hover:text-gray-700">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <div className="p-6">
                            <div className="text-center mb-8">
                                <div className="text-sm text-gray-500 mb-1">Total Amount</div>
                                <div className="text-4xl font-bold text-green-600">PKR {calculateTotal().toFixed(2)}</div>
                            </div>

                            <div className="grid grid-cols-3 gap-4 mb-8">
                                <button
                                    onClick={() => setPaymentMethod('CASH')}
                                    className={`p-4 rounded-xl border-2 flex flex-col items-center justify-center transition-all ${paymentMethod === 'CASH' ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-200 hover:border-gray-300 text-gray-600'}`}
                                >
                                    <Banknote className="w-8 h-8 mb-2" />
                                    <span className="text-sm font-medium">Cash</span>
                                </button>
                                <button
                                    onClick={() => setPaymentMethod('CARD')}
                                    className={`p-4 rounded-xl border-2 flex flex-col items-center justify-center transition-all ${paymentMethod === 'CARD' ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-200 hover:border-gray-300 text-gray-600'}`}
                                >
                                    <CreditCard className="w-8 h-8 mb-2" />
                                    <span className="text-sm font-medium">Card</span>
                                </button>
                                <button
                                    onClick={() => setPaymentMethod('ONLINE')}
                                    className={`p-4 rounded-xl border-2 flex flex-col items-center justify-center transition-all ${paymentMethod === 'ONLINE' ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-200 hover:border-gray-300 text-gray-600'}`}
                                >
                                    <Globe className="w-8 h-8 mb-2" />
                                    <span className="text-sm font-medium">Online</span>
                                </button>
                            </div>

                            <button
                                onClick={handlePayment}
                                disabled={processingPayment}
                                className="w-full py-4 bg-green-600 text-white rounded-xl font-bold text-lg hover:bg-green-700 shadow-lg shadow-green-500/30 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                            >
                                {processingPayment ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                        Processing...
                                    </>
                                ) : (
                                    'Confirm Payment'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
