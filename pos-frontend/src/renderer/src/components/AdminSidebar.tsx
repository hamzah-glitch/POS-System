import {
    LayoutDashboard,
    Store,
    GitBranch,
    ShoppingCart,
    Tag,
    Users,
    Bell,
    BarChart3,
    FileText,
    LogOut
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function AdminSidebar() {
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/');
    };

    const menuItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
        { icon: Store, label: 'Stores', path: '/stores' },
        { icon: GitBranch, label: 'Branches', path: '/branches' },
        { icon: ShoppingCart, label: 'Products', path: '/products' },
        { icon: Tag, label: 'Categories', path: '/categories' },
        { icon: Users, label: 'Employees', path: '/employees' },
        { icon: Bell, label: 'Alerts', path: '/alerts' },
        { icon: BarChart3, label: 'Sales', path: '/sales' },
        { icon: FileText, label: 'Reports', path: '/reports' },
    ];

    return (
        <aside className="w-64 bg-white border-r border-gray-200 flex flex-col h-screen fixed left-0 top-0 z-30">
            <div className="p-6 flex items-center space-x-3 border-b border-gray-100">
                <div className="bg-green-600 p-2 rounded-lg">
                    <Store className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-800">POS Admin</span>
            </div>

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
                        <item.icon className={`w-5 h-5 ${location.pathname === item.path ? 'text-green-600' : 'text-gray-400'}`} />
                        <span className="font-medium">{item.label}</span>
                    </button>
                ))}
            </nav>

            <div className="p-4 border-t border-gray-100">
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">Logout</span>
                </button>
            </div>
        </aside>
    );
}
