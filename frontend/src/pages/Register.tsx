import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const Register: React.FC = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const { register, loading, error } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) return;
        try {
            await register(username, email, password);
            navigate('/login');
        } catch {
            // error is set in context
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
            <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-red-600/10 blur-[150px] rounded-full" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative w-full max-w-md"
            >
                <div className="text-center mb-10">
                    <h1 className="text-5xl font-black tracking-tighter brand">
                        JOIN <span className="text-red-600">YLIV</span>
                    </h1>
                    <p className="text-gray-500 text-xs font-bold uppercase tracking-[0.3em] mt-2">Create Your Creator Account</p>
                </div>

                <form onSubmit={handleSubmit} className="bg-[#0a0a0a] border border-white/5 rounded-[2rem] p-8 space-y-5">
                    {error && (
                        <div className="bg-red-600/10 border border-red-600/20 rounded-2xl p-4 text-red-500 text-sm font-bold text-center">
                            {error}
                        </div>
                    )}

                    <div>
                        <label htmlFor="username" className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] block mb-2">Username</label>
                        <input
                            id="username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="your_handle"
                            required
                            className="w-full bg-black border border-white/5 rounded-2xl py-4 px-5 text-sm focus:border-red-600/50 transition-colors outline-none placeholder:text-gray-700"
                        />
                    </div>

                    <div>
                        <label htmlFor="reg-email" className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] block mb-2">Email</label>
                        <input
                            id="reg-email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@seewhy.live"
                            required
                            className="w-full bg-black border border-white/5 rounded-2xl py-4 px-5 text-sm focus:border-red-600/50 transition-colors outline-none placeholder:text-gray-700"
                        />
                    </div>

                    <div>
                        <label htmlFor="reg-password" className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] block mb-2">Password</label>
                        <input
                            id="reg-password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                            className="w-full bg-black border border-white/5 rounded-2xl py-4 px-5 text-sm focus:border-red-600/50 transition-colors outline-none placeholder:text-gray-700"
                        />
                    </div>

                    <div>
                        <label htmlFor="confirm-password" className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] block mb-2">Confirm Password</label>
                        <input
                            id="confirm-password"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                            className="w-full bg-black border border-white/5 rounded-2xl py-4 px-5 text-sm focus:border-red-600/50 transition-colors outline-none placeholder:text-gray-700"
                        />
                        {password && confirmPassword && password !== confirmPassword && (
                            <p className="text-red-500 text-xs mt-2 font-bold">Passwords do not match</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={loading || (password !== confirmPassword)}
                        className="w-full py-4 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-2xl font-black text-sm uppercase tracking-[0.2em] hover:shadow-[0_0_40px_rgba(255,59,48,0.3)] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        <UserPlus size={16} />
                        {loading ? 'CREATING...' : 'CREATE ACCOUNT'}
                    </button>

                    <p className="text-center text-gray-600 text-xs">
                        Already a creator?{' '}
                        <Link to="/login" className="text-red-500 font-bold hover:underline">Sign In</Link>
                    </p>
                </form>
            </motion.div>
        </div>
    );
};

export default Register;
