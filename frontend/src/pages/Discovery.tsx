import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MessageCircle, Share2, DollarSign, Users, Eye, Radio } from 'lucide-react';
import { streamApi } from '../services/api';
import { Link } from 'react-router-dom';

interface StreamItem {
    id: string;
    title: string;
    user: { id: string; username: string; avatar?: string };
    viewCount: number;
    isLive: boolean;
    category?: string;
    thumbnail?: string;
}

const Discovery: React.FC = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [streams, setStreams] = useState<StreamItem[]>([]);
    const [loading, setLoading] = useState(true);

    // Demo data for presentation — used as fallback
    const demoStreams: StreamItem[] = [
        { id: '1', title: 'Late Night Production Studio — 9 Guest Grid', user: { id: 'u1', username: 'AlexLivo', avatar: '' }, viewCount: 12400, isLive: true, category: 'Production' },
        { id: '2', title: 'Why 20 Xeron Latency Changes Everything', user: { id: 'u2', username: 'TechWiz', avatar: '' }, viewCount: 45200, isLive: true, category: 'Tech' },
        { id: '3', title: 'Elite 9-Guest Lobby Battle Royale', user: { id: 'u3', username: 'YlivGamer', avatar: '' }, viewCount: 1245000, isLive: true, category: 'Gaming' },
        { id: '4', title: 'Producer Breakdown: Multi-Platform RTMP', user: { id: 'u4', username: 'StreamPro', avatar: '' }, viewCount: 8900, isLive: true, category: 'Education' },
        { id: '5', title: 'CY LIVE Meetup — AI Director Demo', user: { id: 'u5', username: 'K2Director', avatar: '' }, viewCount: 34800, isLive: true, category: 'Events' },
    ];

    useEffect(() => {
        streamApi.list()
            .then(res => {
                if (res.data.length > 0) {
                    setStreams(res.data);
                } else {
                    setStreams(demoStreams);
                }
            })
            .catch(() => setStreams(demoStreams))
            .finally(() => setLoading(false));
    }, []);

    const handleScroll = (e: React.WheelEvent) => {
        if (streams.length === 0) return;
        if (e.deltaY > 0) {
            setCurrentIndex(prev => Math.min(prev + 1, streams.length - 1));
        } else {
            setCurrentIndex(prev => Math.max(prev - 1, 0));
        }
    };

    const formatCount = (n: number) => {
        if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
        if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
        return n.toString();
    };

    const current = streams[currentIndex];

    if (loading || !current) {
        return (
            <div className="w-full h-screen bg-black flex items-center justify-center">
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
                    <Radio size={40} className="text-red-600" />
                </motion.div>
            </div>
        );
    }

    const gradients = [
        'from-red-900/40 via-red-800/10 to-black',
        'from-purple-900/40 via-indigo-900/10 to-black',
        'from-blue-900/40 via-cyan-900/10 to-black',
        'from-green-900/40 via-emerald-900/10 to-black',
        'from-orange-900/40 via-amber-900/10 to-black',
    ];

    return (
        <div className="w-full h-screen bg-black overflow-hidden" onWheel={handleScroll}>
            <AnimatePresence mode="wait">
                <motion.div
                    key={current.id}
                    initial={{ y: '100%' }}
                    animate={{ y: 0 }}
                    exit={{ y: '-100%' }}
                    transition={{ type: 'spring', damping: 25, stiffness: 120 }}
                    className="relative w-full h-full flex items-center justify-center"
                >
                    {/* Full-Screen Background Gradient */}
                    <div className={`absolute inset-0 bg-gradient-to-b ${gradients[currentIndex % gradients.length]}`} />
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1598550874175-4d0fe4a23b39?q=80&w=2070')] bg-cover bg-center opacity-10" />

                    {/* Center Content */}
                    <div className="absolute inset-0 flex items-center justify-center z-10">
                        <div className="text-center">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: 'spring', delay: 0.2 }}
                                className="w-24 h-24 mx-auto rounded-full bg-red-600/20 border-2 border-red-600/50 flex items-center justify-center mb-6 shadow-[0_0_60px_rgba(255,59,48,0.3)]"
                            >
                                <Radio size={40} className="text-red-500 animate-pulse" />
                            </motion.div>
                            <p className="text-sm font-black uppercase tracking-[0.5em] text-red-600 mb-2">LIVE NOW</p>
                            <h2 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter max-w-2xl mx-auto leading-none">
                                {current.title}
                            </h2>
                            {current.category && (
                                <span className="inline-block mt-4 px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-xs font-black uppercase tracking-widest text-gray-400">
                                    {current.category}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Right Sidebar */}
                    <div className="absolute right-6 bottom-32 flex flex-col gap-8 z-20">
                        <div className="flex flex-col items-center gap-2">
                            <div className="w-14 h-14 rounded-full border-2 border-white overflow-hidden shadow-lg">
                                <img
                                    src={current.user.avatar || `https://ui-avatars.com/api/?name=${current.user.username}&background=random&color=fff`}
                                    alt={current.user.username}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <button className="bg-red-500 rounded-full w-5 h-5 -mt-4 text-xs flex items-center justify-center font-bold shadow-lg">+</button>
                        </div>

                        <EngagementButton icon={<Heart fill="currentColor" size={32} />} count={formatCount(current.viewCount)} />
                        <EngagementButton icon={<MessageCircle size={32} />} count="1.2K" />
                        <EngagementButton icon={<Share2 size={32} />} count="Share" />
                        <EngagementButton icon={<DollarSign size={32} className="text-yellow-500" />} count="SEND" highlight />
                    </div>

                    {/* Bottom Info */}
                    <div className="absolute left-6 bottom-10 max-w-lg z-20">
                        <Link to={`/watch/${current.id}`} className="group">
                            <h3 className="text-xl font-black mb-2 group-hover:text-red-500 transition-colors">@{current.user.username}</h3>
                        </Link>
                        <p className="text-gray-200 font-medium">{current.title}</p>
                        <div className="mt-4 flex gap-4 items-center">
                            <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
                                <Eye size={14} className="text-red-500" />
                                <span className="text-xs font-black">{formatCount(current.viewCount)}</span>
                            </div>
                            <span className="bg-white/5 px-3 py-1 rounded-full text-xs border border-white/5 font-bold">#yliv4</span>
                            <span className="bg-white/5 px-3 py-1 rounded-full text-xs border border-white/5 font-bold">#seewhy</span>
                        </div>
                    </div>

                    {/* Scroll indicator */}
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex flex-col gap-1.5 z-20">
                        {streams.map((_, i) => (
                            <div
                                key={i}
                                className={`w-1 rounded-full transition-all duration-300 ${i === currentIndex ? 'h-8 bg-red-600' : 'h-2 bg-white/20'}`}
                            />
                        ))}
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

const EngagementButton = ({ icon, count, highlight = false }: any) => (
    <div className="flex flex-col items-center gap-1 cursor-pointer group">
        <div className={`transition-transform duration-200 group-hover:scale-110 ${highlight ? 'p-3 bg-white/10 rounded-full shadow-lg border border-yellow-500/50' : ''}`}>
            {icon}
        </div>
        <span className="text-xs font-bold tracking-tighter">{count}</span>
    </div>
);

export default Discovery;
