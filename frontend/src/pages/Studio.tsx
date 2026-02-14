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
import FloatingWindow from '../components/FloatingWindow';
import EngagementHeatmap from '../components/EngagementHeatmap';

const Studio: React.FC = () => {
    const { socket, isConnected } = useSocket();
    const { success, error: toastError } = useToast();
    const [isShareOpen, setIsShareOpen] = useState(false);
    const [isPaymentOpen, setIsPaymentOpen] = useState(false);
    const [isUploadOpen, setIsUploadOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('chat');
    const [streamType, setStreamType] = useState('grid'); // single, grid, audio
    const [isLive, setIsLive] = useState(false);
    const [totalEarnings, setTotalEarnings] = useState(2405.75);
    const [lastDonation, setLastDonation] = useState<any>(null);
    const [windowPositions, setWindowPositions] = useState<Record<string, { x: number; y: number }>>({
        'program-pvw': { x: 30, y: 550 },
        'ai-swarm': { x: 30, y: 150 },
        'engagement-heatmap': { x: 1400, y: 150 }
    });
    const streamId = "cy-live-prod-001";

    const [aiLogs, setAiLogs] = useState<string[]>([
        '[15:18:51] K2 Director: Switching to Guest_4 Focus',
        '[15:18:45] K2 Mod: User @troll_001 blocked for spam',
        '[15:18:32] K2 Clipper: Moment detected! Saving highlight...',
        '[15:18:20] K2 Signal: RTMP Ingest Stable (20ms)'
    ]);

    React.useEffect(() => {
        const saved = localStorage.getItem('seewhy_studio_layout');
        if (saved) {
            try {
                setWindowPositions(JSON.parse(saved));
            } catch (e) {
                console.error("Failed to load studio layout", e);
            }
        }
    }, []);

    const savePosition = (id: string, x: number, y: number) => {
        setWindowPositions(prev => {
            const next = { ...prev, [id]: { x, y } };
            localStorage.setItem('seewhy_studio_layout', JSON.stringify(next));
            return next;
        });
    };

    React.useEffect(() => {
        if (socket) {
            socket.emit('join_stream', streamId);
        }
    }, [socket, streamId]);

    React.useEffect(() => {
        if (!socket) return;

        const handleAiAction = (data: any) => {
            const newLog = `[${data.timestamp}] ${data.message}`;
            setAiLogs(prev => [newLog, ...prev].slice(0, 10));

            // Hybrid logic: If AI suggests a scene change, we could auto-trigger it
            // if (data.message.includes('Suggesting SOLO')) setStreamType('single');
        };

        const handleDonation = (data: any) => {
            setTotalEarnings(prev => prev + data.amount);
            setLastDonation(data);
            success(`Donation Alert: $${data.amount} from ${data.sender}!`);
            setTimeout(() => setLastDonation(null), 8000);
        };

        socket.on('ai_director_action', handleAiAction);
        socket.on('alert_donation', handleDonation);
        return () => {
            socket.off('ai_director_action', handleAiAction);
            socket.off('alert_donation', handleDonation);
        };
    }, [socket]);

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

    const handleFinishStream = async () => {
        try {
            await streamApi.close(streamId);
            setIsLive(false);
            success('Stream closed successfully. VOD processing...');
        } catch {
            toastError('Failed to close stream');
        }
    };

    return (
        <div className="flex flex-col h-screen bg-[#050505] text-white overflow-hidden text-xs">
            {/* Top Navigation Bar */}
            <header className="h-14 bg-[#0a0a0a] border-b border-white/5 flex items-center justify-between px-4 shrink-0 relative z-[200]">
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center rotate-3 shadow-lg shadow-red-600/30">
                            <Radio size={18} className="text-white" />
                        </div>
                        <span className="text-sm font-black brand tracking-tighter uppercase italic">SeeWhy <span className="text-red-500">Studio</span></span>
                    </div>

                    <div className="h-6 w-[1px] bg-white/10" />

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 bg-red-600/10 px-3 py-1 rounded-full border border-red-500/20">
                            <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                            <span className="text-[10px] font-black text-red-500 uppercase tracking-widest">Live: 01:24:05</span>
                        </div>
                        <div className="flex items-center gap-2 bg-white/5 px-3 py-1 rounded-full border border-white/5">
                            <Users size={12} className="text-gray-400" />
                            <span className="text-[10px] font-black">2,481</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button title="Ultra Low Latency Mode" className="flex items-center gap-2 bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-xl border border-white/5 transition-all group">
                        <Zap size={14} className="text-yellow-500 group-hover:scale-110 transition-transform" />
                        <span className="font-bold">20 Xeron Mode</span>
                    </button>
                    <button
                        onClick={() => setIsShareOpen(true)}
                        title="Share Stream"
                        className="p-2 hover:bg-white/5 rounded-xl text-gray-400 border border-transparent hover:border-white/5 transition-all"
                    >
                        <Share2 size={18} />
                    </button>
                    <button
                        className="btn-primary px-5 py-2 rounded-xl font-black uppercase tracking-tighter text-[11px] shadow-lg shadow-red-600/20"
                        onClick={handleFinishStream}
                    >
                        Finish Stream
                    </button>
                </div>
            </header>

            <div className="flex flex-grow overflow-hidden">
                {/* Left Sidebar: Controls & Guests */}
                <aside className="w-72 bg-[#0a0a0a] border-r border-white/5 flex flex-col shrink-0">
                    <div className="flex-grow overflow-y-auto p-4 space-y-6">
                        {/* Stream Controls Section */}
                        <div className="space-y-3">
                            <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] px-1 italic">VDO Production</h3>
                            <DirectorControls streamType={streamType} onTypeChange={setStreamType} />
                        </div>

                        {/* Guest Quick Panel */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between px-1">
                                <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] italic">Guest Swarm</h3>
                                <button title="Invite Guest" className="text-[10px] font-black text-red-500 hover:text-red-400">Invite +</button>
                            </div>
                            <div className="space-y-2">
                                {guests.map(guest => (
                                    <div key={guest.id} className="flex items-center justify-between bg-black/40 p-2.5 rounded-2xl border border-white/5 group hover:bg-white/5 transition-all">
                                        <div className="flex items-center gap-3">
                                            <div className="relative">
                                                <div className="w-8 h-8 rounded-full bg-white/10 border border-white/10 flex items-center justify-center overflow-hidden">
                                                    <img src={`https://ui-avatars.com/api/?name=${guest.name}&background=random&color=fff`} alt="" />
                                                </div>
                                                <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 border-2 border-[#0a0a0a] rounded-full" />
                                            </div>
                                            <span className="font-bold text-gray-300">{guest.name}</span>
                                        </div>
                                        <div className="flex items-center gap-1 opacity-20 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => handleMuteGuest(guest.id)}
                                                title={guest.isMuted ? "Unmute Guest" : "Mute Guest"}
                                                className={`p-1.5 rounded-lg transition-colors ${guest.isMuted ? 'text-red-500' : 'hover:bg-white/10 text-gray-500'}`}
                                            >
                                                <Mic size={14} fill={guest.isMuted ? 'currentColor' : 'none'} />
                                            </button>
                                            <button title="Guest Settings" className="p-1.5 hover:bg-white/10 rounded-lg text-gray-500">
                                                <Settings size={14} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="p-4 border-t border-white/5 space-y-3 bg-black/20">
                        <button
                            onClick={() => setIsPaymentOpen(true)}
                            className="w-full bg-[#111] hover:bg-[#151515] text-white border border-white/5 py-3 rounded-2xl flex items-center justify-between px-4 group transition-all"
                        >
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-yellow-500/10 rounded-xl">
                                    <DollarSign size={16} className="text-yellow-500" />
                                </div>
                                <div className="text-left">
                                    <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest">Earnings</p>
                                    <p className="text-sm font-black">${totalEarnings.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                                </div>
                            </div>
                            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-red-600 transition-colors">
                                <Zap size={14} />
                            </div>
                        </button>
                        <button
                            onClick={() => setIsUploadOpen(true)}
                            className="w-full btn-primary py-3 rounded-2xl flex items-center justify-center gap-3 font-black uppercase tracking-tighter"
                        >
                            <Upload size={16} />
                            Video Production
                        </button>
                    </div>
                </aside>

                {/* Main Content Area: Scene Preview */}
                <main className="flex-grow bg-black relative flex flex-col overflow-hidden">
                    <div className="flex-grow relative bg-[#050505] p-6 overflow-y-auto">
                        <div className="h-full w-full">
                            <StreamGrid streamType={streamType} />
                        </div>

                        {/* Donation Alert Overlay */}
                        <AnimatePresence>
                            {lastDonation && (
                                <motion.div
                                    initial={{ y: 100, opacity: 0, scale: 0.5 }}
                                    animate={{ y: 0, opacity: 1, scale: 1 }}
                                    exit={{ y: -100, opacity: 0, scale: 0.8 }}
                                    className="absolute bottom-12 left-1/2 -translate-x-1/2 z-[500] pointer-events-none"
                                >
                                    <div className="bg-gradient-to-br from-yellow-500 to-amber-600 p-1 rounded-[2.5rem] shadow-[0_0_80px_rgba(245,158,11,0.4)]">
                                        <div className="bg-black/90 backdrop-blur-3xl rounded-[2.4rem] px-10 py-6 flex items-center gap-6 border border-white/10">
                                            <div className="w-20 h-20 bg-yellow-500 rounded-full flex items-center justify-center shadow-lg">
                                                <DollarSign size={40} className="text-black" />
                                            </div>
                                            <div>
                                                <h4 className="text-xs font-black text-yellow-500 uppercase tracking-[0.3em] mb-1">New Support!</h4>
                                                <p className="text-4xl font-black italic tracking-tighter uppercase whitespace-nowrap">
                                                    ${lastDonation.amount} <span className="text-gray-400 font-bold text-xl ml-2">from {lastDonation.sender}</span>
                                                </p>
                                                <p className="text-sm font-bold text-gray-500 mt-1">"{lastDonation.message}"</p>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Bottom Status Bar */}
                    <div className="h-10 bg-[#0a0a0a] border-t border-white/5 flex items-center justify-between px-6 px-4 shrink-0">
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 shadow-[0_0_8px_#22c55e]' : 'bg-red-500 animate-pulse'}`} />
                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                                    {isConnected ? 'Bridge Operational' : 'Offline'}
                                </span>
                            </div>
                            <div className="flex items-center gap-4 text-[10px] font-bold text-gray-500 font-mono">
                                <span>FPS: <span className="text-white">60.2</span></span>
                                <span>KBIT: <span className="text-white">8402</span></span>
                                <span>20XN: <span className="text-green-500">20ms</span></span>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="text-[9px] font-black text-gray-600 uppercase">K2 Director Core v4.0.1</span>
                        </div>
                    </div>
                </main>

                {/* Interaction Center — Dynamic Tab Content */}
                <aside className="w-[400px] border-l border-white/5 bg-[#0a0a0a]">
                    <AnimatePresence mode="wait">
                        {activeTab === 'chat' ? (
                            <motion.div
                                key="chat"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="h-full flex flex-col"
                            >
                                <div className="h-14 border-b border-white/5 flex items-center px-6 justify-between">
                                    <div className="flex items-center gap-2">
                                        <Monitor size={16} className="text-red-500" />
                                        <span className="font-black uppercase tracking-widest">Global Interaction</span>
                                    </div>
                                    <div className="flex gap-1 bg-black p-1 rounded-xl">
                                        <button
                                            onClick={() => setActiveTab('chat')}
                                            className="px-4 py-1.5 bg-white/5 rounded-lg font-black text-[10px]"
                                        >
                                            CHAT
                                        </button>
                                        <button
                                            onClick={() => setActiveTab('multi')}
                                            className="px-4 py-1.5 hover:bg-white/5 rounded-lg font-black text-[10px] text-gray-500"
                                        >
                                            MULTI
                                        </button>
                                    </div>
                                </div>
                                <div className="flex-grow overflow-hidden">
                                    <ChatPanel streamId={streamId} />
                                </div>
                            </motion.div>
                        ) : activeTab === 'multi' ? (
                            <motion.div
                                key="multi"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="h-full flex flex-col"
                            >
                                <div className="h-14 border-b border-white/5 flex items-center px-6 justify-between">
                                    <div className="flex items-center gap-2">
                                        <Zap size={16} className="text-yellow-500" />
                                        <span className="font-black uppercase tracking-widest">Multi-Cast Control</span>
                                    </div>
                                    <button onClick={() => setActiveTab('chat')} className="text-[10px] font-black text-gray-500 hover:text-white transition-colors">BACK TO CHAT</button>
                                </div>
                                <div className="p-6 space-y-4 overflow-y-auto">
                                    <div className="bg-red-600/10 p-4 rounded-2xl border border-red-500/20 text-center mb-6">
                                        <p className="text-[10px] font-black text-red-500 uppercase italic">Multi-Broadcast Enabled</p>
                                        <p className="text-[8px] font-bold text-gray-400 mt-1 uppercase tracking-widest">Streaming to 8 Platforms Simultaneously</p>
                                    </div>
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

            {/* Floating Windows / Previews */}
            <FloatingWindow
                id="program-pvw"
                title="Program Return (PVW)"
                initialPosition={windowPositions['program-pvw']}
                onPositionChange={savePosition}
            >
                <div className="w-full h-full flex flex-col">
                    <div className="flex-grow bg-black flex items-center justify-center relative group">
                        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1593305841991-05c297ba4575?q=80&w=2000')] bg-cover bg-center opacity-40 transition-transform group-hover:scale-105" />
                        <div className="absolute top-2 left-2 bg-red-600 px-1.5 py-0.5 rounded-sm text-[8px] font-black text-white">LIVE</div>
                        <div className="relative z-10 flex flex-col items-center gap-2">
                            <Radio className="text-red-500 animate-pulse" size={32} />
                            <span className="text-[10px] font-black text-white uppercase tracking-tighter">Broadcasting SeeWhy LIVE...</span>
                        </div>
                    </div>
                    <div className="h-8 bg-black/80 flex items-center justify-between px-3 border-t border-white/5">
                        <span className="text-[8px] font-bold text-gray-500">1080p60 | 6.5 Mbps</span>
                        <div className="flex gap-2 text-[8px] font-black">
                            <span className="text-green-500">CPU: 12%</span>
                            <span className="text-orange-500">FPS: 60</span>
                        </div>
                    </div>
                </div>
            </FloatingWindow>

            <FloatingWindow
                id="ai-swarm"
                title="AI Swarm Monitor"
                initialPosition={windowPositions['ai-swarm']}
                onPositionChange={savePosition}
            >
                <div className="p-4 space-y-3 flex flex-col h-full overflow-hidden">
                    <div className="flex justify-between items-center bg-white/5 p-2 rounded-lg border border-white/5">
                        <span className="text-[9px] font-bold text-gray-400">Moderation Confidence</span>
                        <span className="text-[9px] font-black text-green-500">99.8%</span>
                    </div>
                    <div className="flex-grow bg-black/40 rounded-xl border border-white/5 p-3 overflow-y-auto font-mono text-[9px] space-y-2">
                        {aiLogs.map((log, i) => (
                            <p key={i} className={log.includes('Mod') ? 'text-red-400' : log.includes('Mod') ? 'text-yellow-400' : 'text-gray-400'}>
                                {log}
                            </p>
                        ))}
                    </div>
                </div>
            </FloatingWindow>

            <FloatingWindow
                id="engagement-heatmap"
                title="Engagement Heatmap"
                initialPosition={windowPositions['engagement-heatmap']}
                onPositionChange={savePosition}
            >
                <EngagementHeatmap />
            </FloatingWindow>

            <ShareModal
                isOpen={isShareOpen}
                onClose={() => setIsShareOpen(false)}
                contentId={streamId}
                shareId="director-share-001"
            />
            <PaymentModal isOpen={isPaymentOpen} onClose={() => setIsPaymentOpen(false)} />
            <VideoUpload isOpen={isUploadOpen} onClose={() => setIsUploadOpen(false)} />
        </div>
    );
};

const RTMPTarget = ({ platform, status, color }: { platform: string; status: string; color: string }) => (
    <div className="flex items-center justify-between bg-black/40 p-3 rounded-2xl border border-white/5 hover:border-white/10 transition-all cursor-pointer group">
        <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl bg-${color}-500/10 flex items-center justify-center border border-${color}-500/20`}>
                <Radio size={16} className={`text-${color}-500`} />
            </div>
            <div>
                <p className="font-black tracking-tight">{platform}</p>
                <p className="text-[8px] font-bold text-gray-500 uppercase tracking-widest">{status}</p>
            </div>
        </div>
        <div className={`w-2 h-2 rounded-full ${status === 'Ready' ? 'bg-green-500' : 'bg-gray-700'}`} />
    </div>
);

export default Studio;
