import React, { useEffect, useState } from 'react';
import { employeeService, Employee, UserRole } from '../api/employee';
import { storeService, Store } from '../api/store';
import { branchService, Branch } from '../api/branch';
import { Plus, Edit2, Trash2, X, User } from 'lucide-react';
import AdminSidebar from '../components/AdminSidebar';
import AdminHeader from '../components/AdminHeader';

const Employees: React.FC = () => {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [stores, setStores] = useState<Store[]>([]);
    const [branches, setBranches] = useState<Branch[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentEmployee, setCurrentEmployee] = useState<Partial<Employee>>({});
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
            const [employeesData, branchesData] = await Promise.all([
                employeeService.getEmployeesByStore(storeId),
                branchService.getAllBranchesByStoreId(storeId)
            ]);
            setEmployees(employeesData);
            setBranches(branchesData);
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const employeeData = { ...currentEmployee };

            if (isEditing && currentEmployee.id) {
                await employeeService.updateEmployee(currentEmployee.id, employeeData);
            } else {
                if (employeeData.role === UserRole.ROLE_BRANCH_MANAGER || employeeData.role === UserRole.ROLE_BRANCH_CASHIER) {
                    if (!employeeData.branchId) {
                        setError('Branch is required for this role');
                        return;
                    }
                    await employeeService.createBranchEmployee(employeeData.branchId, employeeData);
                } else {
                    if (!selectedStoreId) {
                        setError('Store is required');
                        return;
                    }
                    employeeData.storeId = selectedStoreId;
                    await employeeService.createStoreEmployee(selectedStoreId, employeeData);
                }
            }
            setIsModalOpen(false);
            setCurrentEmployee({});
            setIsEditing(false);

            if (selectedStoreId) {
                const data = await employeeService.getEmployeesByStore(selectedStoreId);
                setEmployees(data);
            }
        } catch (err) {
            console.error('Failed to save employee', err);
            setError('Failed to save employee');
        }
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this employee?')) {
            try {
                await employeeService.deleteEmployee(id);
                setEmployees(employees.filter((e) => e.id !== id));
            } catch (err) {
                console.error('Failed to delete employee', err);
                setError('Failed to delete employee');
            }
        }
    };

    const openEditModal = (employee: Employee) => {
        setCurrentEmployee({ ...employee, password: '' }); // Don't populate password
        setIsEditing(true);
        setIsModalOpen(true);
    };

    const openCreateModal = () => {
        setCurrentEmployee({
            storeId: selectedStoreId || undefined,
            role: UserRole.ROLE_STORE_MANAGER
        });
        setIsEditing(false);
        setIsModalOpen(true);
    };

    const getRoleBadgeColor = (role: UserRole) => {
        switch (role) {
            case UserRole.ROLE_STORE_ADMIN:
                return 'bg-purple-100 text-purple-800';
            case UserRole.ROLE_STORE_MANAGER:
                return 'bg-blue-100 text-blue-800';
            case UserRole.ROLE_BRANCH_MANAGER:
                return 'bg-green-100 text-green-800';
            case UserRole.ROLE_BRANCH_CASHIER:
                return 'bg-yellow-100 text-yellow-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const formatRole = (role: string) => {
        return role.replace('ROLE_', '').replace('_', ' ');
    };

    return (
        <div className="min-h-screen bg-gray-50 flex font-sans">
            <AdminSidebar />

            <div className="flex-1 ml-64">
                <AdminHeader />

                <main className="pt-20 px-6 pb-8">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">Employees</h1>
                            <p className="text-gray-500">Manage store and branch staff</p>
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
                                <span>Add Employee</span>
                            </button>
                        </div>
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg mb-6">
                            {error}
                        </div>
                    )}

                    {loading ? (
                        <div className="text-center py-10 text-gray-500">Loading employees...</div>
                    ) : (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-100">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Branch</th>
                                        <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {employees.map((employee) => (
                                        <tr key={employee.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center">
                                                    <div className="bg-gray-100 p-2 rounded-full mr-3">
                                                        <User className="w-5 h-5 text-gray-600" />
                                                    </div>
                                                    <div>
                                                        <div className="font-medium text-gray-900">{employee.fullName}</div>
                                                        <div className="text-sm text-gray-500">{employee.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(employee.role)}`}>
                                                    {formatRole(employee.role)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {employee.phone}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {employee.branchId ? branches.find(b => b.id === employee.branchId)?.name : '-'}
                                            </td>
                                            <td className="px-6 py-4 text-right space-x-2">
                                                <button
                                                    onClick={() => openEditModal(employee)}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(employee.id)}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {employees.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-10 text-center text-gray-500">
                                                No employees found. Create one to get started.
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
                                {isEditing ? 'Edit Employee' : 'New Employee'}
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
                                        Role
                                    </label>
                                    <select
                                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        value={currentEmployee.role || UserRole.ROLE_STORE_MANAGER}
                                        onChange={(e) => setCurrentEmployee({ ...currentEmployee, role: e.target.value as UserRole })}
                                        required
                                        disabled={isEditing} // Prevent role change on edit for simplicity
                                    >
                                        <option value={UserRole.ROLE_STORE_MANAGER}>Store Manager</option>
                                        <option value={UserRole.ROLE_BRANCH_MANAGER}>Branch Manager</option>
                                        <option value={UserRole.ROLE_BRANCH_CASHIER}>Branch Cashier</option>
                                    </select>
                                </div>
                                {(currentEmployee.role === UserRole.ROLE_BRANCH_MANAGER || currentEmployee.role === UserRole.ROLE_BRANCH_CASHIER) && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Branch
                                        </label>
                                        <select
                                            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                            value={currentEmployee.branchId || ''}
                                            onChange={(e) => setCurrentEmployee({ ...currentEmployee, branchId: Number(e.target.value) })}
                                            required
                                        >
                                            <option value="" disabled>Select a branch</option>
                                            {branches.map(branch => (
                                                <option key={branch.id} value={branch.id}>{branch.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={currentEmployee.fullName || ''}
                                    onChange={(e) =>
                                        setCurrentEmployee({ ...currentEmployee, fullName: e.target.value })
                                    }
                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        required
                                        value={currentEmployee.email || ''}
                                        onChange={(e) =>
                                            setCurrentEmployee({ ...currentEmployee, email: e.target.value })
                                        }
                                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Phone
                                    </label>
                                    <input
                                        type="tel"
                                        required
                                        value={currentEmployee.phone || ''}
                                        onChange={(e) =>
                                            setCurrentEmployee({ ...currentEmployee, phone: e.target.value })
                                        }
                                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Password {isEditing && '(Leave blank to keep current)'}
                                </label>
                                <input
                                    type="password"
                                    required={!isEditing}
                                    value={currentEmployee.password || ''}
                                    onChange={(e) =>
                                        setCurrentEmployee({ ...currentEmployee, password: e.target.value })
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
                                    {isEditing ? 'Save Changes' : 'Create Employee'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Employees;
