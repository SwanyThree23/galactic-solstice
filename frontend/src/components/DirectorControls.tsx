import React from 'react';
import { Mic, MicOff, UserMinus, LayoutGrid, Monitor, Settings, Zap } from 'lucide-react';

interface DirectorControlsProps {
    streamType: string;
    onTypeChange: (type: string) => void;
}

const DirectorControls: React.FC<DirectorControlsProps> = ({ streamType, onTypeChange }) => {
    return (
        <div className="space-y-4">
            <div className="bg-black/40 p-1 rounded-2xl border border-white/5 grid grid-cols-2 gap-1">
                <SceneButton
                    active={streamType === 'grid'}
                    icon={<LayoutGrid size={16} />}
                    label="GRID"
                    onClick={() => onTypeChange('grid')}
                />
                <SceneButton
                    active={streamType === 'single'}
                    icon={<Zap size={16} />}
                    label="SOLO"
                    onClick={() => onTypeChange('single')}
                />
                <SceneButton
                    active={streamType === 'audio'}
                    icon={<Mic size={16} />}
                    label="AUDIO"
                    onClick={() => onTypeChange('audio')}
                />
                <SceneButton
                    active={streamType === 'pip'}
                    icon={<Settings size={16} />}
                    label="PIP"
                    onClick={() => onTypeChange('pip')}
                />
            </div>

            <div className="bg-white/5 p-4 rounded-2xl border border-white/5 space-y-3">
                <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Master Output</span>
                    <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_#22c55e]" />
                </div>
                <div className="space-y-2">
                    <ProductionToggle label="20 Xeron Gateway" active />
                    <ProductionToggle label="AI Scene Assist" active />
                    <ProductionToggle label="Auto-Clipping" />
                </div>
            </div>
        </div>
    );
};

const ProductionToggle = ({ label, active = false }: { label: string; active?: boolean }) => (
    <div className="flex items-center justify-between p-2 hover:bg-white/5 rounded-xl transition-colors cursor-pointer group">
        <span className={`text-[10px] font-bold ${active ? 'text-gray-300' : 'text-gray-600'}`}>{label}</span>
        <div className={`w-8 h-4 rounded-full transition-colors relative ${active ? 'bg-red-600' : 'bg-gray-800'}`}>
            <div className={`absolute top-1 w-2 h-2 rounded-full bg-white transition-all ${active ? 'right-1' : 'left-1'}`} />
        </div>
    </div>
);

const SceneButton = ({ icon, label, active = false, onClick }: any) => (
    <button
        onClick={onClick}
        className={`flex items-center gap-2 p-3 rounded-xl border transition-all ${active ? 'bg-red-600 border-red-600 text-white shadow-lg shadow-red-600/20' : 'border-transparent text-gray-500 hover:text-white hover:bg-white/5'}`}
    >
        {icon}
        <span className="text-[9px] font-black tracking-tighter">{label}</span>
    </button>
);

export default DirectorControls;
