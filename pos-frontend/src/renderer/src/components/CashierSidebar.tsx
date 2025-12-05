import {
    ShoppingCart,
    Clock,
    RotateCcw,
    Users,
    FileText,
    X,
    LogOut
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

interface CashierSidebarProps {
    isOpen: boolean;
    onClose: () => void;
    onLogout: () => void;
}

export default function CashierSidebar({ isOpen, onClose, onLogout }: CashierSidebarProps) {
    const navigate = useNavigate();
    const location = useLocation();

    const menuItems = [
        { icon: ShoppingCart, label: 'POS Terminal', path: '/cashier' },
        { icon: Clock, label: 'Order History', path: '/cashier/history' },
        { icon: RotateCcw, label: 'Returns/Refunds', path: '/cashier/returns' },
        { icon: Users, label: 'Customers', path: '/cashier/customers' },
        { icon: FileText, label: 'Shift Summary', path: '/cashier/shift' },
    ];

    return (
        <>
            {/* Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed top-0 left-0 h-full w-64 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                <div className="p-6 flex items-center justify-between border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-800">POS System</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
                    {menuItems.map((item) => (
                        <button
                            key={item.label}
                            onClick={() => {
                                navigate(item.path);
                                onClose();
                            }}
                            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${location.pathname === item.path
                                ? 'bg-green-50 text-green-700'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                }`}
                        >
                            <item.icon className={`w-5 h-5 ${location.pathname === item.path ? 'text-green-600' : 'text-gray-400'
                                }`} />
                            <span className="font-medium">{item.label}</span>
                        </button>
                    ))}
                </nav>

                <div className="p-4 border-t border-gray-100">
                    <button
                        onClick={onLogout}
                        className="w-full flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                        <LogOut className="w-5 h-5" />
                        <span className="font-medium">Logout</span>
                    </button>
                </div>
            </aside>
        </>
    );
}
