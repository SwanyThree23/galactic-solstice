import React from 'react';
import { Play, Volume2, Shield, Download } from 'lucide-react';

interface EmbeddedPlayerProps {
    streamId: string;
}

const EmbeddedPlayer: React.FC<EmbeddedPlayerProps> = ({ streamId }) => {
    const [isPlaying, setIsPlaying] = React.useState(false);

    // In production, we'd fetch the actual ninja view ID for this stream
    const viewId = streamId.includes('watch-now') ? 'vdo_ninja_demo_viewer' : streamId;

    return (
        <div className="w-full aspect-video bg-black rounded-3xl overflow-hidden relative group border border-white/10 shadow-2xl">
            {/* Background Poster */}
            {!isPlaying && (
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2070')] bg-cover bg-center opacity-40" />
            )}

            {/* Real Video Feed Interface */}
            {isPlaying ? (
                <iframe
                    src={`https://vdo.ninja/?view=${viewId}&autoplay&latency=20&transparent&bgcol=000`}
                    className="absolute inset-0 w-full h-full border-0"
                    allow="autoplay; camera; microphone; fullscreen; picture-in-picture;"
                    title="SeeWhy LIVE Stream Feed"
                />
            ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm z-10 transition-opacity duration-500 group-hover:bg-black/20">
                    <button
                        onClick={() => setIsPlaying(true)}
                        title="Click to Play"
                        className="w-20 h-20 rounded-full bg-red-600 flex items-center justify-center text-white shadow-[0_0_40px_rgba(255,59,48,0.6)] transform hover:scale-110 transition-transform cursor-pointer"
                    >
                        <Play fill="white" size={32} />
                    </button>
                    <p className="mt-6 text-xl font-black italic tracking-tighter uppercase brand">Join the Live Experience</p>
                    <div className="mt-2 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse" />
                        <span className="text-[10px] font-black text-white/40 tracking-widest uppercase">Encrypted 20 Xeron Gateway</span>
                    </div>
                </div>
            )}

            {/* UI Controls - Only visible when not playing or on hover */}
            <div className={`absolute bottom-6 left-6 right-6 flex justify-between items-center z-20 pointer-events-none transition-opacity duration-300 ${isPlaying ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'}`}>
                <div className="flex items-center gap-4 bg-black/60 backdrop-blur px-4 py-2 rounded-2xl border border-white/10">
                    <Volume2 size={18} className="text-gray-400" />
                    <div className="flex flex-col">
                        <span className="text-[10px] font-black uppercase text-red-500">LIVE NOW</span>
                        <span className="text-xs font-bold">2,481 Active Viewers</span>
                    </div>
                </div>

                <button
                    onClick={() => window.open('https://cy.live/download', '_blank')}
                    className="flex items-center gap-3 bg-white text-black px-6 py-2.5 rounded-2xl font-black text-xs uppercase tracking-tighter hover:bg-gray-200 transition-colors shadow-lg pointer-events-auto"
                >
                    <Download size={16} />
                    DOWNLOAD PRO APP
                </button>
            </div>

            {/* Brand Corner */}
            <div className="absolute top-6 right-6 bg-black/60 backdrop-blur-xl px-3 py-1.5 rounded-xl border border-white/10 flex items-center gap-2 z-10">
                <Shield size={14} className="text-red-500" />
                <span className="text-[10px] font-black tracking-widest uppercase text-red-500">CY SECURE BRIDGE</span>
            </div>
        </div>
    );
};

export default EmbeddedPlayer;
