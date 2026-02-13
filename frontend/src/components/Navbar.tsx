import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Compass, Radio, BarChart3, User, Settings, LogIn } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import NotificationCenter from './NotificationCenter';

const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/discover', icon: Compass, label: 'Discover' },
    { path: '/studio', icon: Radio, label: 'Studio' },
    { path: '/dashboard', icon: BarChart3, label: 'Dashboard' },
    { path: '/profile', icon: User, label: 'Profile' },
    { path: '/settings', icon: Settings, label: 'Settings' },
];

const Navbar: React.FC = () => {
    const location = useLocation();
    const { isAuthenticated, logout } = useAuth();

    // Hide navbar on embed pages
    if (location.pathname.startsWith('/embed')) return null;

    return (
        <>
            {/* Desktop Sidebar */}
            <nav className="hidden md:flex fixed top-0 left-0 h-screen w-20 flex-col items-center py-8 bg-[#0a0a0a]/90 border-r border-white/5 z-50 gap-2" role="navigation" aria-label="Main navigation">
                <Link to="/" className="mb-8" aria-label="YLIV Home">
                    <span className="text-2xl font-black text-red-600 brand">Y</span>
                </Link>

                <div className="flex flex-col gap-1 flex-grow">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        const Icon = item.icon;
                        return (
                            <Link key={item.path} to={item.path} aria-label={item.label} title={item.label}>
                                <motion.div
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                    className={`relative p-3 rounded-2xl transition-all duration-200 ${isActive
                                        ? 'bg-red-600/15 text-red-500'
                                        : 'text-gray-500 hover:text-white hover:bg-white/5'
                                        }`}
                                >
                                    <Icon size={22} />
                                    {isActive && (
                                        <motion.div
                                            layoutId="nav-indicator"
                                            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-1 h-6 bg-red-600 rounded-full"
                                        />
                                    )}
                                </motion.div>
                            </Link>
                        );
                    })}
                </div>

                {/* Notification Center */}
                <div className="relative mb-2">
                    <NotificationCenter />
                </div>

                {isAuthenticated ? (
                    <button
                        onClick={logout}
                        className="p-3 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-2xl transition-all"
                        aria-label="Sign Out"
                        title="Sign Out"
                    >
                        <LogIn size={22} className="rotate-180" />
                    </button>
                ) : (
                    <Link to="/login" aria-label="Sign In" title="Sign In">
                        <div className="p-3 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-2xl transition-all">
                            <LogIn size={22} />
                        </div>
                    </Link>
                )}
            </nav>

            {/* Mobile Bottom Bar */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 flex justify-around items-center h-16 bg-[#0a0a0a]/95 border-t border-white/5 z-50 backdrop-blur-xl" role="navigation" aria-label="Mobile navigation">
                {navItems.slice(0, 5).map((item) => {
                    const isActive = location.pathname === item.path;
                    const Icon = item.icon;
                    return (
                        <Link key={item.path} to={item.path} aria-label={item.label} title={item.label} className="flex flex-col items-center gap-1">
                            <Icon size={20} className={isActive ? 'text-red-500' : 'text-gray-500'} />
                            <span className={`text-[9px] font-bold uppercase tracking-wider ${isActive ? 'text-red-500' : 'text-gray-600'}`}>
                                {item.label}
                            </span>
                        </Link>
                    );
                })}
            </nav>
        </>
    );
};

export default Navbar;
