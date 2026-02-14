import React from 'react';
import { motion } from 'framer-motion';
import { Eye, Radio } from 'lucide-react';
import { Link } from 'react-router-dom';

interface LivePreviewCardProps {
    stream: {
        id: string;
        title: string;
        username: string;
        viewCount: number;
        thumbnail?: string;
    };
}

const LivePreviewCard: React.FC<LivePreviewCardProps> = ({ stream }) => {
    return (
        <motion.div
            whileHover={{ y: -5, scale: 1.02 }}
            className="group relative w-72 h-44 bg-[#0a0a0a] rounded-2xl overflow-hidden border border-white/5 shadow-2xl transition-all hover:border-red-600/30"
        >
            <Link to={`/watch/${stream.id}`}>
                {/* Simulated Video Feed */}
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1593305841991-05c297ba4575?q=80&w=2000')] bg-cover bg-center transition-transform duration-700 group-hover:scale-110">
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40" />
                </div>

                {/* Overlays */}
                <div className="absolute top-3 left-3 flex items-center gap-2">
                    <div className="bg-red-600 text-white text-[8px] font-black px-2 py-0.5 rounded-sm flex items-center gap-1 uppercase tracking-widest">
                        <div className="w-1 h-1 bg-white rounded-full animate-pulse" />
                        LIVE
                    </div>
                </div>

                <div className="absolute top-3 right-3 bg-black/60 backdrop-blur px-2 py-0.5 rounded flex items-center gap-1.5 border border-white/5">
                    <Eye size={10} className="text-red-500" />
                    <span className="text-[10px] font-black text-white">{(stream.viewCount / 1000).toFixed(1)}K</span>
                </div>

                {/* Bottom Info */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                    <p className="text-xs font-black text-white line-clamp-1 mb-1 italic uppercase tracking-tight">{stream.title}</p>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full bg-gradient-to-tr from-gray-700 to-gray-500 border border-white/10" />
                        <span className="text-[10px] font-bold text-gray-400 group-hover:text-red-500 transition-colors">@{stream.username}</span>
                    </div>
                </div>

                {/* Hover Play Button */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 backdrop-blur-[2px]">
                    <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center text-white shadow-[0_0_20px_rgba(255,59,48,0.5)]">
                        <Radio size={20} />
                    </div>
                </div>
            </Link>
        </motion.div>
    );
};

export default LivePreviewCard;
