import React, { useState } from 'react';
import StreamPanel from './StreamPanel';
import { motion, AnimatePresence } from 'framer-motion';

interface StreamGridProps {
    streamType: string; // 'single', 'grid', 'audio'
}

const StreamGrid: React.FC<StreamGridProps> = ({ streamType }) => {
    const [enlargedId, setEnlargedId] = useState<string | null>(null);

    // Mocking 9 guests as per requirement
    const [guests, setGuests] = useState([
        { id: '1', name: 'Host_Alex', isMuted: false, isVideoOff: false, ninjaId: 'v123_host' },
        { id: '2', name: 'Guest_2', isMuted: true, isVideoOff: false, ninjaId: 'v456_guest2' },
        { id: '3', name: 'Guest_3', isMuted: false, isVideoOff: true },
        { id: '4', name: 'Guest_4', isMuted: false, isVideoOff: false, ninjaId: 'v789_guest4' },
        { id: '5', name: 'Guest_5', isMuted: true, isVideoOff: false },
        { id: '6', name: 'Guest_6', isMuted: false, isVideoOff: false },
        { id: '7', name: 'Guest_7', isMuted: false, isVideoOff: false },
        { id: '8', name: 'Guest_8', isMuted: true, isVideoOff: true },
        { id: '9', name: 'Guest_9', isMuted: false, isVideoOff: false },
    ]);

    const handlePanelClick = (id: string) => {
        setEnlargedId(enlargedId === id ? null : id);
    };

    const getGridLayout = () => {
        if (streamType === 'single') return 'grid-cols-1';
        if (guests.length <= 4) return 'grid-cols-2';
        return 'grid-cols-3';
    };

    const visibleGuests = streamType === 'single' ? guests.slice(0, 1) : guests;

    return (
        <div className="w-full h-full p-4 flex flex-col items-center justify-center relative overflow-hidden">
            {/* Cinematic Studio Gradient */}
            <div className="absolute inset-0 bg-radial-gradient from-red-600/5 to-transparent pointer-events-none" />

            <motion.div
                layout
                className={`w-full h-full grid gap-4 transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] ${getGridLayout()}`}
            >
                <AnimatePresence mode="popLayout">
                    {visibleGuests.map((guest) => (
                        <StreamPanel
                            key={guest.id}
                            guest={guest}
                            isEnlarged={enlargedId === guest.id}
                            onClick={() => handlePanelClick(guest.id)}
                            streamType={streamType}
                        />
                    ))}
                </AnimatePresence>
            </motion.div>

            {/* Clapper Style Scene Transition Mock */}
            <AnimatePresence>
                {enlargedId && (
                    <motion.div
                        initial={{ opacity: 0, scale: 1.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-50 pointer-events-none"
                    >
                        <div className="bg-red-600/20 backdrop-blur-3xl px-12 py-6 rounded-[3rem] border border-red-600/50 shadow-[0_0_100px_rgba(255,59,48,0.3)]">
                            <h4 className="text-4xl font-black italic tracking-tighter uppercase text-white drop-shadow-[0_0_20px_rgba(0,0,0,0.5)]">FOCUS MODE</h4>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Director Grid Info */}
            <div className="absolute top-6 right-6 flex items-center gap-2 bg-black/40 backdrop-blur px-3 py-1 rounded-full border border-white/5 opacity-50 z-20">
                <span className="text-[8px] font-black tracking-widest text-gray-400 uppercase">GRID CONFIG: 3X3_PRODUCTION</span>
            </div>
        </div>
    );
};

export default StreamGrid;
