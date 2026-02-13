import React, { useState } from 'react';
import StreamGrid from '../components/StreamGrid';
import ChatPanel from '../components/ChatPanel';
import DirectorControls from '../components/DirectorControls';
import ShareModal from '../components/ShareModal';
import PaymentModal from '../components/PaymentModal';
import VideoUpload from '../components/VideoUpload';
import { Share2, DollarSign, Settings, Users, Grid, Zap, Monitor, Lock, Mic, Upload, Radio } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSocket } from '../hooks/useSocket';
import { streamApi } from '../services/api';
import { useToast } from '../hooks/useToast';

const Studio: React.FC = () => {
    const { socket, isConnected } = useSocket();
    const { success, error: toastError } = useToast();
    const [isShareOpen, setIsShareOpen] = useState(false);
    const [isPaymentOpen, setIsPaymentOpen] = useState(false);
    const [isUploadOpen, setIsUploadOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('chat');
    const [streamType, setStreamType] = useState('grid'); // single, grid, audio
    const [isLive, setIsLive] = useState(false);
    const streamId = "cy-live-prod-001";

    React.useEffect(() => {
        if (socket) {
            socket.emit('join_stream', streamId);
        }
    }, [socket, streamId]);

    const [guests, setGuests] = useState([
        { id: '1', name: 'Host_Alex', isMuted: false, isVideoOff: false },
        { id: '2', name: 'Guest_2', isMuted: true, isVideoOff: false },
        { id: '3', name: 'Guest_3', isMuted: false, isVideoOff: true },
        { id: '4', name: 'Guest_4', isMuted: false, isVideoOff: false },
        { id: '5', name: 'Guest_5', isMuted: true, isVideoOff: false },
        { id: '6', name: 'Guest_6', isMuted: false, isVideoOff: false },
        { id: '7', name: 'Guest_7', isMuted: false, isVideoOff: false },
        { id: '8', name: 'Guest_8', isMuted: true, isVideoOff: true },
        { id: '9', name: 'Guest_9', isMuted: false, isVideoOff: false },
    ]);

    const handleMuteGuest = (id: string) => {
        setGuests(prev => prev.map(g => g.id === id ? { ...g, isMuted: !g.isMuted } : g));
        if (socket) {
            socket.emit('director_mute_guest', { streamId, guestId: id });
        }
    };

    const handleRemoveGuest = (id: string) => {
        setGuests(prev => prev.filter(g => g.id !== id));
        if (socket) {
            socket.emit('director_remove_guest', { streamId, guestId: id });
        }
    };

    const toggleLive = () => setIsLive(!isLive);

    return (
        <div className="flex h-screen w-full flex-col bg-[#050505]">
            {/* Premium SeeWhy LIVE Header */}
            <header className="h-16 border-b border-white/5 bg-[#0a0a0a]/80 backdrop-blur-md px-6 flex items-center justify-between z-50">
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center font-black italic">CY</div>
                        <h1 className="text-xl font-black brand tracking-tighter uppercase italic">SeeWhy <span className="text-red-600">LIVE</span></h1>
                    </div>

                    <nav className="hidden md:flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/5">
                        <TypeButton active={streamType === 'single'} onClick={() => setStreamType('single')} icon={<Monitor size={14} />} label="Solo" />
                        <TypeButton active={streamType === 'grid'} onClick={() => setStreamType('grid')} icon={<Grid size={14} />} label="9+ Guests" />
                        <TypeButton active={streamType === 'audio'} onClick={() => setStreamType('audio')} icon={<Mic size={14} />} label="Audio Only" />
                    </nav>
                </div>

                <div className="flex items-center gap-3">
                    {/* Live Status */}
                    <button
                        onClick={toggleLive}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all text-xs font-black uppercase tracking-tighter border ${isLive
                            ? 'bg-red-600 border-red-500 text-white shadow-[0_0_20px_rgba(255,59,48,0.4)] pulse-live'
                            : 'bg-white/5 border-white/10 text-gray-400 hover:border-red-600/50 hover:text-white'
                            }`}
                    >
                        <Radio size={14} />
                        {isLive ? 'LIVE' : 'GO LIVE'}
                    </button>

                    <div className="bg-white/5 px-3 py-1.5 rounded-lg flex items-center gap-2 border border-white/5 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                        <Lock size={12} className="text-green-500" />
                        Private Panel: SECURE-992
                    </div>

                    <button
                        onClick={() => setIsUploadOpen(true)}
                        className="flex items-center gap-2 bg-white/5 hover:bg-white/10 px-4 py-2 rounded-xl transition-all border border-white/5"
                        title="Upload video"
                        aria-label="Upload video"
                    >
                        <Upload size={16} className="text-gray-400" />
                    </button>

                    <button
                        onClick={() => setIsShareOpen(true)}
                        className="flex items-center gap-2 bg-white/5 hover:bg-white/10 px-4 py-2 rounded-xl transition-all border border-white/5 group"
                    >
                        <Share2 size={16} className="group-hover:text-red-500 transition-colors" />
                        <span className="text-xs font-black uppercase tracking-tighter">Spread</span>
                    </button>

                    <button
                        onClick={() => setIsPaymentOpen(true)}
                        className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-orange-500 hover:shadow-[0_0_20px_rgba(255,59,48,0.4)] px-5 py-2 rounded-xl transition-all"
                    >
                        <DollarSign size={16} />
                        <span className="text-xs font-black uppercase tracking-tighter">Direct Support</span>
                    </button>
                </div>
            </header>

            <div className="flex flex-grow overflow-hidden">
                {/* Production Sidebar */}
                <aside className="w-20 border-r border-white/5 bg-[#0a0a0a] flex flex-col items-center py-8 gap-8">
                    <ToolbarIcon icon={<Zap size={22} />} label="AI Hub" active={activeTab === 'ai'} onClick={() => setActiveTab('ai')} />
                    <ToolbarIcon icon={<Users size={22} />} label="Guests" active={activeTab === 'guests'} onClick={() => setActiveTab('guests')} />
                    <ToolbarIcon icon={<Settings size={22} />} label="RTMP" active={activeTab === 'rtmp'} onClick={() => setActiveTab('rtmp')} />

                    <div className="mt-auto mb-8 flex flex-col items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-600'} animate-pulse`} />
                        <span className="text-[8px] font-black text-gray-600 uppercase">{isConnected ? 'SYNC' : 'OFFLINE'}</span>
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-gray-800 to-black p-[1px]">
                            <div className="w-full h-full rounded-2xl bg-black flex items-center justify-center font-black text-xs border border-white/10">
                                CY4
                            </div>
                        </div>
                        <span className="text-[8px] font-black text-gray-600 uppercase">Ver. 4.0.1</span>
                    </div>
                </aside>

                {/* Dynamic Studio Stage */}
                <main className="flex-grow bg-black relative">
                    <StreamGrid streamType={streamType} />

                    {/* 20 Xeron Indicator */}
                    <div className="absolute bottom-6 left-6 flex items-center gap-2 bg-black/60 backdrop-blur px-3 py-1.5 rounded-full border border-white/5 opacity-50">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                        <span className="text-[8px] font-black tracking-[0.2em] text-white">LATENCY: 20 XERONS</span>
                    </div>
                </main>

                {/* Interaction Center — Dynamic Tab Content */}
                <aside className="w-[400px] border-l border-white/5 bg-[#0a0a0a]">
                    <AnimatePresence mode="wait">
                        {activeTab === 'guests' ? (
                            <motion.div
                                key="director"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="h-full p-6"
                            >
                                <DirectorControls
                                    guests={guests}
                                    onMute={handleMuteGuest}
                                    onRemove={handleRemoveGuest}
                                />
                            </motion.div>
                        ) : activeTab === 'ai' ? (
                            <motion.div
                                key="ai"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="h-full p-6 flex flex-col"
                            >
                                <div className="flex items-center gap-2 mb-6">
                                    <Zap className="text-red-500" size={24} />
                                    <h2 className="text-xl font-bold uppercase tracking-widest text-white">K2 Swarm</h2>
                                </div>
                                <div className="space-y-4 flex-grow">
                                    <AIStatusCard label="Director Agent" status="Active" desc="Monitoring 9 feeds for optimal scene switching" />
                                    <AIStatusCard label="Moderator Agent" status="Active" desc="Chat safety — 0 violations detected" />
                                    <AIStatusCard label="Clipper Agent" status="Standby" desc="Ready to auto-extract viral moments" />
                                    <AIStatusCard label="TTS Agent" status="Idle" desc="Text-to-speech for donations & alerts" />
                                </div>
                                <button
                                    onClick={async () => {
                                        try {
                                            await streamApi.getAIHighlights(streamId);
                                            success('AI Scan started! Generating highlights...');
                                        } catch {
                                            toastError('Failed to start AI Scan');
                                        }
                                    }}
                                    className="btn-primary w-full py-4 mt-6"
                                >
                                    TRIGGER AI HIGHLIGHT SCAN
                                </button>
                            </motion.div>
                        ) : activeTab === 'rtmp' ? (
                            <motion.div
                                key="rtmp"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="h-full p-6 flex flex-col"
                            >
                                <div className="flex items-center gap-2 mb-6">
                                    <Settings className="text-red-500" size={24} />
                                    <h2 className="text-xl font-bold uppercase tracking-widest text-white">Multi-Stream</h2>
                                </div>
                                <div className="space-y-4 flex-grow">
                                    <RTMPTarget platform="YouTube" status="Connected" color="red" />
                                    <RTMPTarget platform="Twitch" status="Connected" color="purple" />
                                    <RTMPTarget platform="Facebook" status="Ready" color="blue" />
                                    <RTMPTarget platform="TikTok" status="Not Configured" color="gray" />
                                    <RTMPTarget platform="LinkedIn" status="Not Configured" color="gray" />
                                    <RTMPTarget platform="Instagram Live" status="Not Configured" color="gray" />
                                    <RTMPTarget platform="X / Twitter" status="Not Configured" color="gray" />
                                    <RTMPTarget platform="Kick" status="Ready" color="green" />
                                    <RTMPTarget platform="Custom RTMP" status="Ready" color="orange" />
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="chat"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="h-full"
                            >
                                <ChatPanel streamId={streamId} />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </aside>
            </div>

            <ShareModal
                isOpen={isShareOpen}
                onClose={() => setIsShareOpen(false)}
                contentId="cy-live-prod-001"
                shareId="share-id-99"
            />

            <PaymentModal
                isOpen={isPaymentOpen}
                onClose={() => setIsPaymentOpen(false)}
            />

            <VideoUpload
                isOpen={isUploadOpen}
                onClose={() => setIsUploadOpen(false)}
            />
        </div>
    );
};

const TypeButton = ({ active, onClick, icon, label }: any) => (
    <button
        onClick={onClick}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all ${active ? 'bg-white/10 text-white shadow-sm' : 'text-gray-500 hover:text-gray-300'}`}
    >
        {icon}
        <span className="text-[10px] font-black uppercase tracking-tight">{label}</span>
    </button>
);

const ToolbarIcon = ({ icon, label, active, onClick }: any) => (
    <button
        onClick={onClick}
        className="flex flex-col items-center gap-2 group"
    >
        <div className={`p-3.5 rounded-2xl transition-all duration-300 ${active ? 'bg-red-600 text-white shadow-[0_0_20px_rgba(255,59,48,0.3)]' : 'text-gray-600 hover:text-white hover:bg-white/5'}`}>
            {icon}
        </div>
        <span className={`text-[9px] font-black uppercase tracking-widest ${active ? 'text-white' : 'text-gray-600 group-hover:text-gray-400'}`}>
            {label}
        </span>
    </button>
);

const AIStatusCard = ({ label, status, desc }: any) => (
    <div className="glass-morphism p-4 flex items-start gap-4 border-l-4 border-red-500">
        <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${status === 'Active' ? 'bg-green-500 animate-pulse' : status === 'Standby' ? 'bg-yellow-500' : 'bg-gray-600'}`} />
        <div>
            <div className="flex items-center gap-2">
                <p className="text-sm font-bold">{label}</p>
                <span className={`text-[8px] font-black uppercase px-1.5 py-0.5 rounded ${status === 'Active' ? 'bg-green-500/10 text-green-500' : status === 'Standby' ? 'bg-yellow-500/10 text-yellow-500' : 'bg-gray-500/10 text-gray-500'}`}>
                    {status}
                </span>
            </div>
            <p className="text-[10px] text-gray-500 mt-1 font-medium">{desc}</p>
        </div>
    </div>
);

const RTMPTarget = ({ platform, status, color }: any) => {
    const colorMap: Record<string, string> = {
        red: 'border-red-500/30 text-red-500',
        purple: 'border-purple-500/30 text-purple-500',
        blue: 'border-blue-500/30 text-blue-500',
        green: 'border-green-500/30 text-green-500',
        orange: 'border-orange-500/30 text-orange-500',
        gray: 'border-gray-700/30 text-gray-600',
    };

    const isConnected = status === 'Connected';

    return (
        <div className={`flex items-center justify-between p-3.5 rounded-xl border ${colorMap[color] || colorMap.gray} bg-white/[0.02] hover:bg-white/[0.04] transition-all`}>
            <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : status === 'Ready' ? 'bg-yellow-500' : 'bg-gray-700'}`} />
                <span className="text-xs font-bold">{platform}</span>
            </div>
            <span className={`text-[9px] font-black uppercase tracking-tight ${isConnected ? 'text-green-500' : status === 'Ready' ? 'text-yellow-500' : 'text-gray-600'}`}>
                {status}
            </span>
        </div>
    );
};

export default Studio;
