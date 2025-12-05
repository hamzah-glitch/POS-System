import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Plus, Edit2, Trash2, Search, X, Save, RefreshCw } from 'lucide-react';
import BranchManagerSidebar from '../components/BranchManagerSidebar';
import { employeeService, Employee, UserRole } from '../api/employee';
import toast from 'react-hot-toast';

export default function BranchEmployees() {
    const navigate = useNavigate();
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [branchId, setBranchId] = useState<number | null>(null);

    // Form State
    const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        password: '',
        role: UserRole.ROLE_BRANCH_CASHIER
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

            if (!userBranchId) {
                toast.error('Branch information missing');
                return;
            }

            setBranchId(userBranchId);
            setLoading(true);
            const data = await employeeService.getEmployeesByBranch(userBranchId);
            // Filter to show only cashiers or relevant roles if needed, but requirement implies managing cashiers
            setEmployees(data.filter(e => e.role === UserRole.ROLE_BRANCH_CASHIER));
        } catch (error) {
            console.error('Failed to fetch employees:', error);
            toast.error('Failed to load employees');
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
        if (!branchId) return;

        try {
            if (editingEmployee) {
                await employeeService.updateEmployee(editingEmployee.id, {
                    ...formData,
                    branchId
                });
                toast.success('Cashier updated successfully');
            } else {
                await employeeService.createBranchEmployee(branchId, {
                    ...formData,
                    role: UserRole.ROLE_BRANCH_CASHIER
                });
                toast.success('Cashier created successfully');
            }
            setShowModal(false);
            resetForm();
            loadData();
        } catch (error) {
            console.error('Failed to save cashier:', error);
            toast.error('Failed to save cashier');
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('Are you sure you want to delete this cashier?')) return;
        try {
            await employeeService.deleteEmployee(id);
            toast.success('Cashier deleted successfully');
            loadData();
        } catch (error) {
            console.error('Failed to delete cashier:', error);
            toast.error('Failed to delete cashier');
        }
    };

    const resetForm = () => {
        setEditingEmployee(null);
        setFormData({
            fullName: '',
            email: '',
            phone: '',
            password: '',
            role: UserRole.ROLE_BRANCH_CASHIER
        });
    };

    const openEditModal = (employee: Employee) => {
        setEditingEmployee(employee);
        setFormData({
            fullName: employee.fullName,
            email: employee.email,
            phone: employee.phone,
            password: '', // Don't populate password
            role: employee.role
        });
        setShowModal(true);
    };

    const filteredEmployees = employees.filter(e =>
        e.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="flex h-screen bg-gray-50 font-sans">
            <BranchManagerSidebar onLogout={handleLogout} />

            <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Header */}
                <header className="bg-white h-16 shadow-sm flex items-center justify-between px-8 z-10">
                    <h1 className="text-xl font-bold text-gray-800 flex items-center">
                        <Users className="w-6 h-6 mr-2 text-blue-600" />
                        Employees
                    </h1>
                    <div className="flex items-center space-x-4">
                        <div className="relative">
                            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search cashiers..."
                                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <button
                            onClick={() => { resetForm(); setShowModal(true); }}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center transition-colors shadow-sm"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Add Cashier
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
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Phone</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {loading ? (
                                    <tr><td colSpan={5} className="text-center py-8 text-gray-500">Loading employees...</td></tr>
                                ) : filteredEmployees.length === 0 ? (
                                    <tr><td colSpan={5} className="text-center py-8 text-gray-500">No cashiers found</td></tr>
                                ) : (
                                    filteredEmployees.map(employee => (
                                        <tr key={employee.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 text-sm font-medium text-gray-900">{employee.fullName}</td>
                                            <td className="px-6 py-4 text-sm text-gray-600">{employee.email}</td>
                                            <td className="px-6 py-4 text-sm text-gray-600">{employee.phone}</td>
                                            <td className="px-6 py-4">
                                                <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
                                                    {employee.role.replace('ROLE_', '').replace('_', ' ')}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right space-x-2">
                                                <button
                                                    onClick={() => openEditModal(employee)}
                                                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(employee.id)}
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
                                    {editingEmployee ? 'Edit Cashier' : 'Add New Cashier'}
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
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        value={formData.fullName}
                                        onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                    <input
                                        type="email"
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        value={formData.email}
                                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                                    <input
                                        type="tel"
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        value={formData.phone}
                                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        {editingEmployee ? 'New Password (leave blank to keep current)' : 'Password'}
                                    </label>
                                    <input
                                        type="password"
                                        required={!editingEmployee}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        value={formData.password}
                                        onChange={e => setFormData({ ...formData, password: e.target.value })}
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
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                                    >
                                        <Save className="w-4 h-4 mr-2" />
                                        Save Cashier
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
