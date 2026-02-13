import React from 'react';
import { Play, Volume2, Shield, Download } from 'lucide-react';

interface EmbeddedPlayerProps {
    streamId: string;
}

const EmbeddedPlayer: React.FC<EmbeddedPlayerProps> = ({ streamId }) => {
    return (
        <div className="w-full aspect-video bg-black rounded-3xl overflow-hidden relative group border border-white/10 shadow-2xl">
            {/* Background Poster */}
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2070')] bg-cover bg-center opacity-40" />

            {/* Play Overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm z-10 transition-opacity duration-500 group-hover:bg-black/20">
                <button className="w-20 h-20 rounded-full bg-red-600 flex items-center justify-center text-white shadow-[0_0_30px_rgba(255,59,48,0.5)] transform hover:scale-110 transition-transform">
                    <Play fill="white" size={32} />
                </button>
                <p className="mt-6 text-xl font-bold tracking-tight">Watching LIVE on YLIV 4.0</p>
            </div>

            {/* UI Controls */}
            <div className="absolute bottom-6 left-6 right-6 flex justify-between items-center z-20">
                <div className="flex items-center gap-4 bg-black/60 backdrop-blur px-4 py-2 rounded-2xl border border-white/10">
                    <Volume2 size={18} className="text-gray-400" />
                    <div className="flex flex-col">
                        <span className="text-[10px] font-black uppercase text-red-500">LIVE NOW</span>
                        <span className="text-xs font-bold">2.4K Viewers</span>
                    </div>
                </div>

                <button
                    onClick={() => window.open('https://cy.live/download', '_blank')}
                    className="flex items-center gap-2 bg-white text-black px-6 py-2.5 rounded-2xl font-black text-xs uppercase tracking-tighter hover:bg-gray-200 transition-colors shadow-lg"
                >
                    <Download size={16} />
                    DOWNLOAD CY APP
                </button>
            </div>

            {/* Brand Corner */}
            <div className="absolute top-6 right-6 bg-black/60 backdrop-blur-xl px-3 py-1.5 rounded-xl border border-white/10 flex items-center gap-2">
                <Shield size={14} className="text-red-500" />
                <span className="text-[10px] font-black tracking-widest uppercase">YLIV SECURE</span>
            </div>
        </div>
    );
};

export default EmbeddedPlayer;
