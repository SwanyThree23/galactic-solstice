import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MessageCircle, Share2, DollarSign } from 'lucide-react';

const Discovery: React.FC = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [videos, setVideos] = useState([
        { id: '1', user: 'ChefMaster', title: 'Late night ramen hack!', likes: '12K', shares: '4.5K', url: '#' },
        { id: '2', user: 'TechWiz', title: 'Why 20 xerons latency matters.', likes: '45K', shares: '12K', url: '#' },
        { id: '3', user: 'YlivGamer', title: 'Insane 9-guest lobby battle', likes: '1.2M', shares: '200K', url: '#' },
    ]);

    const handleScroll = (e: React.WheelEvent) => {
        if (e.deltaY > 0) {
            setCurrentIndex(prev => Math.min(prev + 1, videos.length - 1));
        } else {
            setCurrentIndex(prev => Math.max(prev - 1, 0));
        }
    };

    return (
        <div className="w-full h-screen bg-black overflow-hidden" onWheel={handleScroll}>
            <AnimatePresence mode="wait">
                <motion.div
                    key={videos[currentIndex].id}
                    initial={{ y: '100%' }}
                    animate={{ y: 0 }}
                    exit={{ y: '-100%' }}
                    transition={{ type: 'spring', damping: 25, stiffness: 120 }}
                    className="relative w-full h-full flex items-center justify-center"
                >
                    {/* Mock Video Player */}
                    <div className="w-full h-full bg-gradient-to-br from-gray-900 to-black flex items-center justify-center text-4xl font-bold opacity-50">
                        [VIDEO: {videos[currentIndex].user}]
                    </div>

                    {/* Right Sidebar UI (Engagement) */}
                    <div className="absolute right-6 bottom-32 flex flex-col gap-8">
                        <div className="flex flex-col items-center gap-2">
                            <div className="w-14 h-14 rounded-full border-2 border-white overflow-hidden">
                                <img src={`https://ui-avatars.com/api/?name=${videos[currentIndex].user}`} alt="User" />
                            </div>
                            <button className="bg-red-500 rounded-full w-5 h-5 -mt-4 text-xs flex items-center justify-center font-bold">+</button>
                        </div>

                        <EngagementButton icon={<Heart fill="currentColor" size={32} />} count={videos[currentIndex].likes} />
                        <EngagementButton icon={<MessageCircle size={32} />} count="1.2K" />
                        <EngagementButton icon={<Share2 size={32} />} count={videos[currentIndex].shares} />
                        <EngagementButton icon={<DollarSign size={32} className="text-yellow-500" />} count="SEND" highlight />
                    </div>

                    {/* Bottom Info */}
                    <div className="absolute left-6 bottom-10 max-w-lg">
                        <h3 className="text-xl font-bold mb-2">@{videos[currentIndex].user}</h3>
                        <p className="text-gray-200">{videos[currentIndex].title}</p>
                        <div className="mt-4 flex gap-4">
                            <span className="bg-white/10 px-3 py-1 rounded-full text-sm">#yliv4</span>
                            <span className="bg-white/10 px-3 py-1 rounded-full text-sm">#streaming</span>
                        </div>
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
