import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../api/auth';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const data = await authService.login({ email, password });
            console.log('Login successful:', data);

            // Store token and user info
            localStorage.setItem('token', data.jwt);
            localStorage.setItem('user', JSON.stringify(data.user)); // Assuming data has user info

            // Check role and start shift if cashier
            const userRole = data.user?.role;
            if (userRole === 'ROLE_BRANCH_CASHIER') {
                try {
                    await import('../api/shift').then(m => m.shiftService.startShift());
                    console.log('Shift started successfully');
                } catch (shiftError) {
                    console.error('Failed to start shift:', shiftError);
                }
                navigate('/cashier');
            } else if (userRole === 'ROLE_BRANCH_MANAGER') {
                navigate('/branch-dashboard');
            } else if (userRole === 'ROLE_ADMIN' || userRole === 'ROLE_STORE_ADMIN') {
                navigate('/dashboard');
            } else {
                navigate('/dashboard');
            }
        } catch (err: any) {
            console.error('Login failed:', err);
            const errorMessage = err.response?.data?.message || err.message || 'Invalid email or password';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
            <div className="w-full max-w-md p-8 space-y-6 bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20">
                <div className="text-center">
                    <h1 className="text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                        Welcome Back
                    </h1>
                    <p className="mt-2 text-sm text-gray-400">Sign in to access your POS dashboard</p>
                </div>

                {error && (
                    <div className="p-3 text-sm text-red-200 bg-red-500/20 border border-red-500/50 rounded-lg">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                            Email Address
                        </label>
                        <input
                            id="email"
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 mt-1 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder-gray-500 text-white"
                            placeholder="you@example.com"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 mt-1 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder-gray-500 text-white"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 px-4 font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg hover:from-blue-500 hover:to-purple-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transform transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/30"
                    >
                        {loading ? (
                            <span className="flex items-center justify-center">
                                <svg className="w-5 h-5 mr-2 animate-spin" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                Signing in...
                            </span>
                        ) : (
                            'Sign In'
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}
