import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MicOff, VideoOff, Maximize2, Minimize2, Radio, Activity } from 'lucide-react';

interface StreamPanelProps {
    guest: {
        id: string;
        name: string;
        isMuted: boolean;
        isVideoOff: boolean;
        isAudioOnly?: boolean;
        avatar?: string;
        ninjaId?: string; // Added for WebRTC integration
    };
    isEnlarged: boolean;
    onClick: () => void;
    streamType?: string;
}

const StreamPanel: React.FC<StreamPanelProps> = ({ guest, isEnlarged, onClick, streamType }) => {
    const isAudioMode = guest.isAudioOnly || streamType === 'audio';

    return (
        <motion.div
            layout
            className={`video-panel group ${isEnlarged ? 'enlarged' : ''} ${isAudioMode ? 'bg-gradient-to-b from-[#111] to-[#050505]' : 'bg-black'}`}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            whileHover={{ borderColor: 'var(--accent-primary)', scale: isEnlarged ? 1 : 1.02 }}
        >
            <AnimatePresence mode="wait">
                {isAudioMode ? (
                    <motion.div
                        key="audio"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex flex-col items-center justify-center h-full space-y-6 relative overflow-hidden"
                    >
                        {/* Waveform Visualization */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-10">
                            <div className="flex gap-2">
                                {[1, 2, 3, 4, 5, 6, 3, 2, 4, 5].map((h, i) => (
                                    <motion.div
                                        key={i}
                                        animate={{ height: [20, h * 15, 20] }}
                                        transition={{ duration: 1, repeat: Infinity, delay: i * 0.1 }}
                                        className="w-4 bg-red-600 rounded-full"
                                    />
                                ))}
                            </div>
                        </div>

                        <div className="w-40 h-40 rounded-full border-4 border-red-600/20 p-2 relative group-hover:border-red-600/50 transition-colors duration-500">
                            <img
                                src={guest.avatar || `https://ui-avatars.com/api/?name=${guest.name}&background=random&color=fff`}
                                alt={guest.name}
                                className="w-full h-full rounded-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                            />
                            <div className="absolute -bottom-2 -right-2 bg-red-600 p-2 rounded-xl shadow-lg">
                                <Radio size={20} className="text-white" />
                            </div>
                        </div>

                        <div className="text-center z-10">
                            <h4 className="text-2xl font-black brand uppercase tracking-tighter">{guest.name}</h4>
                            <div className="flex items-center gap-2 justify-center mt-2">
                                <Activity size={12} className="text-green-500" />
                                <span className="text-[10px] font-black tracking-widest text-gray-500 uppercase">Voice Only Mode</span>
                            </div>
                        </div>
                    </motion.div>
                ) : guest.isVideoOff ? (
                    <motion.div
                        key="video-off"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="w-full h-full flex flex-col items-center justify-center bg-[#0d0d0d]"
                    >
                        <div className="w-24 h-24 rounded-3xl border-2 border-white/5 bg-black flex items-center justify-center mb-4">
                            <VideoOff size={32} className="text-gray-700" />
                        </div>
                        <p className="text-xs font-bold text-gray-600 uppercase tracking-widest">{guest.name} is hidden</p>
                    </motion.div>
                ) : (
                    <motion.div
                        key="video"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="relative w-full h-full"
                    >
                        {/* 20 Xeron Ninja Integration */}
                        <div className="w-full h-full bg-[#121212] overflow-hidden flex items-center justify-center relative">
                            {guest.ninjaId ? (
                                <iframe
                                    src={`https://vdo.ninja/?view=${guest.ninjaId}&autoplay&latency=20&push=k&transparent&bgcol=000&id=${guest.id}`}
                                    className="absolute inset-0 w-full h-full border-0 pointer-events-none"
                                    allow="autoplay; camera; microphone; fullscreen; picture-in-picture;"
                                />
                            ) : (
                                <img
                                    src={`https://images.unsplash.com/photo-1598550874175-4d0fe4a23b39?q=80&w=2070`}
                                    className="w-full h-full object-cover opacity-60"
                                    alt="Stream"
                                />
                            )}
                            <div className="w-full h-full absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 z-10" />
                            <span className="text-[10px] font-black text-white/20 tracking-[1em] z-0 absolute">CY_LIVE_FEED_SECURE</span>
                        </div>

                        <div className="guest-meta z-20">
                            <div className="flex items-center gap-3">
                                <div className="bg-red-600 text-white text-[8px] font-black px-2 py-0.5 rounded uppercase">Live</div>
                                <span className="font-black text-xs uppercase tracking-widest">{guest.name}</span>
                            </div>
                            <div className="flex gap-1">
                                {guest.isMuted && (
                                    <div className="p-1.5 bg-black/50 backdrop-blur rounded-lg border border-red-500/30">
                                        <MicOff size={14} className="text-red-500" />
                                    </div>
                                )}
                                <button onClick={(e) => { e.stopPropagation(); onClick(); }} className="p-1.5 bg-black/50 backdrop-blur rounded-lg border border-white/10 hover:bg-white/20 transition-all">
                                    {isEnlarged ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default StreamPanel;
