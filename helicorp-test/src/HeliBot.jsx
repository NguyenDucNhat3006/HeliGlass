import React, { useState } from 'react';
import { MessageSquare, Send } from 'lucide-react';
import API_URL from './config/api';

export default function HeliBot() {
    const [showChat, setShowChat] = useState(false);
    const [chatInput, setChatInput] = useState('');
    const [chatLogs, setChatLogs] = useState([
        { sender: 'bot', text: 'Xin chào. Tôi có thể cung cấp thông tin gì về cấu trúc phần cứng của HeliGlass Pro?' }
    ]);

    const handleSendMessage = async () => {
        if (!chatInput.trim()) return;

        const userMsg = chatInput;
        setChatLogs(prev => [...prev, { sender: 'user', text: userMsg }]);
        setChatInput('');
        setChatLogs(prev => [...prev, { sender: 'bot', text: '...', isTyping: true }]);

        try {
            const response = await fetch(API_URL + '/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: userMsg })
            });

            if (!response.ok) throw new Error('Lỗi API');
            const data = await response.json();

            setChatLogs(prev => {
                const filteredLogs = prev.filter(log => !log.isTyping);
                return [...filteredLogs, { sender: 'bot', text: data.reply }];
            });
        } catch (error) {
            setChatLogs(prev => {
                const filteredLogs = prev.filter(log => !log.isTyping);
                return [...filteredLogs, { sender: 'bot', text: 'Hệ thống AI đang bảo trì. Vui lòng thử lại sau.' }];
            });
        }
    };

    return (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50">
            {!showChat ? (
                <button onClick={() => setShowChat(true)} className="p-3.5 sm:p-4 bg-blue-600 text-white rounded-full shadow-xl hover:scale-105 transition-transform flex items-center justify-center">
                    <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
            ) : (
                <div className="w-[calc(100vw-2rem)] sm:w-80 h-[70vh] sm:h-96 max-h-[500px] bg-white dark:bg-[#121214] rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-800 flex flex-col overflow-hidden animate-fade-in shrink-0">
                    <div className="bg-neutral-50 dark:bg-neutral-900/50 px-4 py-3 flex justify-between items-center border-b border-neutral-200 dark:border-neutral-800">
                        <span className="font-bold text-xs text-neutral-800 dark:text-neutral-200">Trợ lý HeliBot</span>
                        <button onClick={() => setShowChat(false)} className="text-[10px] font-bold text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 uppercase p-1">Đóng</button>
                    </div>
                    <div className="flex-1 p-3 sm:p-4 overflow-y-auto space-y-3 text-xs font-medium">
                        {chatLogs.map((log, i) => (
                            <div key={i} className={`flex ${log.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[90%] sm:max-w-[85%] px-3 py-2 rounded-xl break-words whitespace-pre-wrap ${log.sender === 'user' ? 'bg-blue-600 text-white' : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200'}`}>
                                    {log.text}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="p-2 sm:p-3 bg-neutral-50 dark:bg-neutral-900/40 border-t border-neutral-200 dark:border-neutral-800 flex gap-1.5">
                        <input
                            type="text"
                            placeholder="Nhập câu hỏi..."
                            value={chatInput}
                            onChange={(e) => setChatInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                            className="flex-1 px-3 py-2 rounded-xl text-xs bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white focus:outline-none min-w-0"
                        />
                        <button onClick={handleSendMessage} className="p-2 sm:p-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shrink-0">
                            <Send className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}