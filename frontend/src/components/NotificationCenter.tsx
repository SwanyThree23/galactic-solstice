import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, CheckCircle, DollarSign, Radio, Zap } from 'lucide-react';
import { notificationApi } from '../services/api';
import { useAuth } from '../hooks/useAuth';

interface Notification {
    id: string;
    title: string;
    message: string;
    isRead: boolean;
    createdAt: string;
}

const NotificationCenter: React.FC = () => {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);

    // Demo notifications for presentation quality
    const demoNotifications: Notification[] = [
        { id: '1', title: 'Donation Received', message: 'BigSpender sent you $50.00 via CashApp', isRead: false, createdAt: new Date().toISOString() },
        { id: '2', title: 'AI Highlight Clipped', message: 'K2 Clipper detected a viral moment at 2:00', isRead: false, createdAt: new Date(Date.now() - 60000).toISOString() },
        { id: '3', title: 'New Follower', message: 'GlitchKing started following you', isRead: true, createdAt: new Date(Date.now() - 300000).toISOString() },
        { id: '4', title: 'Stream Performance', message: 'Your last stream hit 8.2K viewers — new record!', isRead: true, createdAt: new Date(Date.now() - 3600000).toISOString() },
        { id: '5', title: 'Payout Complete', message: '$2,405.75 sent to your CashApp', isRead: true, createdAt: new Date(Date.now() - 7200000).toISOString() },
    ];

    useEffect(() => {
        if (user?.id) {
            notificationApi.getAll(user.id)
                .then(res => {
                    setNotifications(res.data.notifications);
                    setUnreadCount(res.data.unreadCount);
                })
                .catch(() => {
                    // Fallback to demo data for offline/presentation mode
                    setNotifications(demoNotifications);
                    setUnreadCount(demoNotifications.filter(n => !n.isRead).length);
                });
        } else {
            setNotifications(demoNotifications);
            setUnreadCount(demoNotifications.filter(n => !n.isRead).length);
        }
    }, [user]);

    const markAllRead = useCallback(() => {
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        setUnreadCount(0);
        if (user?.id) {
            notificationApi.markAllRead(user.id).catch(() => { });
        }
    }, [user]);

    const getIcon = (title: string) => {
        if (title.includes('Donation')) return <DollarSign size={16} className="text-green-500" />;
        if (title.includes('AI') || title.includes('Highlight')) return <Zap size={16} className="text-orange-500" />;
        if (title.includes('Stream')) return <Radio size={16} className="text-red-500" />;
        return <Bell size={16} className="text-gray-400" />;
    };

    const timeAgo = (dateStr: string) => {
        const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
        if (seconds < 60) return 'Just now';
        if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
        if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
        return `${Math.floor(seconds / 86400)}d ago`;
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-3 text-gray-500 hover:text-white hover:bg-white/5 rounded-2xl transition-all"
                aria-label="Notifications"
                title="Notifications"
            >
                <Bell size={22} />
                {unreadCount > 0 && (
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-red-600 rounded-full flex items-center justify-center text-[9px] font-black text-white shadow-lg shadow-red-600/50"
                    >
                        {unreadCount}
                    </motion.div>
                )}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-[900]"
                            onClick={() => setIsOpen(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, y: -10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                            className="absolute top-16 right-0 w-96 max-h-[70vh] bg-[#0a0a0a]/95 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl z-[1000] overflow-hidden flex flex-col"
                        >
                            <div className="p-5 border-b border-white/5 flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <Bell size={16} className="text-red-600" />
                                    <h3 className="text-sm font-black uppercase tracking-widest">Alerts</h3>
                                </div>
                                <div className="flex items-center gap-2">
                                    {unreadCount > 0 && (
                                        <button
                                            onClick={markAllRead}
                                            className="text-[10px] font-black uppercase tracking-wide text-red-500 hover:text-red-400"
                                        >
                                            Mark All Read
                                        </button>
                                    )}
                                    <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-white/5 rounded-lg" title="Close notifications" aria-label="Close notifications">
                                        <X size={16} className="text-gray-500" />
                                    </button>
                                </div>
                            </div>

                            <div className="flex-grow overflow-y-auto scrollbar-hide">
                                {notifications.map((n, i) => (
                                    <motion.div
                                        key={n.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                        className={`p-4 border-b border-white/[0.03] hover:bg-white/[0.03] transition-colors cursor-pointer ${!n.isRead ? 'bg-red-600/[0.03] border-l-2 border-l-red-600' : ''}`}
                                    >
                                        <div className="flex gap-3">
                                            <div className="flex-shrink-0 mt-0.5">
                                                {getIcon(n.title)}
                                            </div>
                                            <div className="flex-grow min-w-0">
                                                <div className="flex justify-between items-start">
                                                    <p className={`text-xs font-black uppercase tracking-tight ${!n.isRead ? 'text-white' : 'text-gray-400'}`}>
                                                        {n.title}
                                                    </p>
                                                    <span className="text-[9px] text-gray-600 font-bold flex-shrink-0 ml-2">
                                                        {timeAgo(n.createdAt)}
                                                    </span>
                                                </div>
                                                <p className="text-[11px] text-gray-500 mt-1 leading-relaxed">{n.message}</p>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
};

export default NotificationCenter;
