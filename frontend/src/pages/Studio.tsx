import React, { useState } from 'react';
import StreamGrid from '../components/StreamGrid';
import ChatPanel from '../components/ChatPanel';
import ShareModal from '../components/ShareModal';
import PaymentModal from '../components/PaymentModal';
import { Share2, DollarSign, Settings, Users, Grid, Zap, Monitor, Lock, Mic } from 'lucide-react';
import { motion } from 'framer-motion';

const Studio: React.FC = () => {
    const [isShareOpen, setIsShareOpen] = useState(false);
    const [isPaymentOpen, setIsPaymentOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('chat');
    const [streamType, setStreamType] = useState('grid'); // single, grid, audio

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
                    <div className="bg-white/5 px-3 py-1.5 rounded-lg flex items-center gap-2 border border-white/5 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                        <Lock size={12} className="text-green-500" />
                        Private Panel: SECURE-992
                    </div>

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
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-gray-800 to-black p-[1px]">
                            <div className="w-full h-full rounded-2xl bg-black flex items-center justify-center font-black text-xs border border-white/10 group-hover:border-red-500 transition-colors">
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

                {/* Interaction Center */}
                <aside className="w-[400px] border-l border-white/5 bg-[#0a0a0a]">
                    <ChatPanel />
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

export default Studio;
