import {
    LayoutDashboard,
    ShoppingBag,
    RotateCcw,
    Package,
    Users,
    UserCircle,
    FileText,
    LogOut
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

interface BranchManagerSidebarProps {
    onLogout: () => void;
}

export default function BranchManagerSidebar({ onLogout }: BranchManagerSidebarProps) {
    const navigate = useNavigate();
    const location = useLocation();

    const menuItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/branch-dashboard' },
        { icon: ShoppingBag, label: 'Orders', path: '/branch/orders' },
        { icon: RotateCcw, label: 'Refunds', path: '/branch/refunds' },
        { icon: Package, label: 'Inventory', path: '/branch/inventory' },
        { icon: Users, label: 'Employees', path: '/branch/employees' },
        { icon: UserCircle, label: 'Customers', path: '/branch/customers' },
        { icon: FileText, label: 'Reports', path: '/branch/reports' },
    ];

    return (
        <aside className="w-64 bg-white border-r border-gray-200 flex flex-col h-full">
            {/* Header */}
            <div className="p-6 border-b border-gray-100">
                <div className="flex items-center space-x-2 text-green-700">
                    <Package className="w-8 h-8" />
                    <span className="text-xl font-bold">Branch Manager</span>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
                {menuItems.map((item) => (
                    <button
                        key={item.label}
                        onClick={() => navigate(item.path)}
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

            {/* Footer */}
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
    );
}
