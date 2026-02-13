import React from 'react';
import { Mic, MicOff, UserMinus, LayoutGrid, Monitor, Settings, Zap } from 'lucide-react';

interface DirectorControlsProps {
    guests: any[];
    onMute: (id: string) => void;
    onRemove: (id: string) => void;
}

const DirectorControls: React.FC<DirectorControlsProps> = ({ guests, onMute, onRemove }) => {
    return (
        <div className="flex flex-col h-full gap-6">
            <div className="flex items-center gap-2 mb-2">
                <Monitor className="text-red-500" size={24} />
                <h2 className="text-xl font-bold uppercase tracking-widest text-white">Director</h2>
            </div>

            <div className="space-y-4 flex-grow overflow-y-auto pr-2">
                <p className="text-xs font-bold text-gray-500 uppercase">Live Guests ({guests.length}/9)</p>

                {guests.map((guest) => (
                    <div key={guest.id} className="glass-morphism p-3 flex items-center justify-between border-l-4 border-red-500">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gray-800" />
                            <span className="text-sm font-medium truncate max-w-[100px]">{guest.name}</span>
                        </div>
                        <div className="flex gap-1">
                            <ControlButton
                                icon={guest.isMuted ? <MicOff size={16} className="text-red-500" /> : <Mic size={16} />}
                                onClick={() => onMute(guest.id)}
                            />
                            <ControlButton
                                icon={<UserMinus size={16} className="text-gray-400" />}
                                onClick={() => onRemove(guest.id)}
                                danger
                            />
                        </div>
                    </div>
                ))}

                {guests.length < 9 && (
                    <button className="w-full py-3 border-2 border-dashed border-gray-700 rounded-xl text-gray-500 hover:border-red-500 hover:text-red-500 transition-all text-xs font-bold">
                        + INVITE GUEST
                    </button>
                )}
            </div>

            <div className="space-y-3 pt-6 border-t border-gray-800">
                <p className="text-xs font-bold text-gray-500 uppercase">Production Scene</p>
                <div className="grid grid-cols-2 gap-2">
                    <SceneButton active icon={<LayoutGrid size={18} />} label="GRID" />
                    <SceneButton icon={<Zap size={18} />} label="FOCUS" />
                    <SceneButton icon={<Monitor size={18} />} label="SOLO" />
                    <SceneButton icon={<Settings size={18} />} label="PIP" />
                </div>
            </div>

            <button className="btn-primary w-full py-4 mt-auto">
                FINISH STREAM
            </button>
        </div>
    );
};

const ControlButton = ({ icon, onClick, danger = false }: any) => (
    <button
        onClick={onClick}
        className={`p-2 rounded-lg transition-colors ${danger ? 'hover:bg-red-500/20' : 'hover:bg-white/10'}`}
    >
        {icon}
    </button>
);

const SceneButton = ({ icon, label, active = false }: any) => (
    <button className={`flex items-center justify-center gap-2 p-3 rounded-xl border transition-all ${active ? 'bg-red-500 border-red-500 text-white' : 'border-gray-800 text-gray-500 hover:border-gray-600'}`}>
        {icon}
        <span className="text-[10px] font-black">{label}</span>
    </button>
);

export default DirectorControls;
