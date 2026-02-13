import React, { useState, useEffect } from 'react';
import { Send, Heart, Gift, MessageCircle } from 'lucide-react';
import { useSocket } from '../hooks/useSocket';

const ChatPanel: React.FC<{ streamId?: string }> = ({ streamId = 'default' }) => {
    const { socket } = useSocket();
    const [messages, setMessages] = useState([
        { id: '1', user: 'LivoFan', text: 'This stream is fire! 🔥', isPremium: false },
        { id: '2', user: 'BigSpender', text: 'Just sent $50 direct! Check your dashboard.', isPremium: true },
        { id: '3', user: 'DevGuy', text: 'The latency is actually zero. Insane.', isPremium: false },
    ]);
    const [input, setInput] = useState('');

    useEffect(() => {
        if (!socket) return;
        socket.on('receive_message', (data) => {
            setMessages((prev) => [...prev, { id: Date.now().toString(), ...data }]);
        });
        return () => { socket.off('receive_message'); };
    }, [socket]);

    const sendMessage = () => {
        if (!input.trim() || !socket) return;
        const msg = { user: 'You', text: input, isPremium: false };
        socket.emit('send_message', { streamId, ...msg });
        setInput('');
    };

    return (
        <div className="flex flex-col h-full">
            <div className="p-4 border-b border-[#222] bg-[#0d0d0d] flex items-center justify-between">
                <h3 className="font-bold flex items-center gap-2">
                    <MessageCircle size={18} className="text-red-500" />
                    LIVE CHAT
                </h3>
                <span className="text-[10px] bg-red-600/20 text-red-500 px-2 py-0.5 rounded-full font-black">2.4K WATCHING</span>
            </div>

            <div className="flex-grow overflow-y-auto p-4 space-y-4 scrollbar-hide">
                {messages.map((msg) => (
                    <div key={msg.id} className={`flex flex-col ${msg.isPremium ? 'bg-yellow-500/10 p-3 rounded-xl border border-yellow-500/20' : ''}`}>
                        <span className={`text-xs font-black uppercase tracking-tighter ${msg.isPremium ? 'text-yellow-500' : 'text-gray-500'}`}>
                            {msg.user}
                        </span>
                        <p className="text-sm leading-relaxed mt-1">{msg.text}</p>
                    </div>
                ))}
            </div>

            <div className="p-4 bg-[#0d0d0d] border-t border-[#222]">
                <div className="flex items-center gap-2 mb-4 overflow-x-auto py-2 no-scrollbar">
                    <GiftButton label="$1" />
                    <GiftButton label="$5" />
                    <GiftButton label="$20" />
                    <GiftButton label="$100" gold />
                </div>

                <div className="relative">
                    <input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                        placeholder="Join the conversation..."
                        className="w-full bg-black border border-white/5 rounded-2xl py-3 pl-4 pr-12 text-sm focus:border-red-500 transition-all outline-none"
                    />
                    <button
                        onClick={sendMessage}
                        title="Send Message"
                        className="absolute right-2 top-1.5 p-2 text-red-500 hover:bg-red-500/10 rounded-xl transition-colors"
                    >
                        <Send size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
};

const GiftButton = ({ label, gold = false }: any) => (
    <button className={`flex-shrink-0 px-4 py-2 rounded-xl flex items-center gap-2 border transition-all ${gold ? 'bg-yellow-600 border-yellow-500 text-white font-black' : 'border-white/5 bg-white/5 hover:bg-white/10'}`}>
        <span className="text-xs">{label}</span>
        <Gift size={14} />
    </button>
);

export default ChatPanel;
