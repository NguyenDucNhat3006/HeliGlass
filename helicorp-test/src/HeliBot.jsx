import React, { useState } from 'react';
import { MessageSquare, Send } from 'lucide-react';
import API_URL from './config/api';

export default function HeliBot() {
    const [showChat, setShowChat] = useState(false);
    const [chatInput, setChatInput] = useState('');
    const [chatLogs, setChatLogs] = useState([
        { sender: 'bot', text: 'Xin chào. Tôi có thể cung cấp thông tin gì về cấu trúc phần cứng của HeliGlass Pro?' }
    ]);
    const [isLoading, setIsLoading] = useState(false);

    const handleSendMessage = async () => {
        if (!chatInput.trim() || isLoading) return;

        const userMsg = chatInput;
        setChatLogs(prev => [...prev, { sender: 'user', text: userMsg }]);
        setChatInput('');
        setChatLogs(prev => [...prev, { sender: 'bot', text: '⏳ Đang xử lý...', isTyping: true }]);
        setIsLoading(true);

        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000);

            const response = await fetch(`${API_URL}/api/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: userMsg }),
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error(`API Error: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();

            setChatLogs(prev => {
                const filteredLogs = prev.filter(log => !log.isTyping);
                return [...filteredLogs, { sender: 'bot', text: data.reply || 'Không có phản hồi từ server' }];
            });
        } catch (error) {
            console.error('Chat error:', error);
            setChatLogs(prev => {
                const filteredLogs = prev.filter(log => !log.isTyping);
                const errorMsg = error.name === 'AbortError' 
                    ? '⏱️ Kết nối hết thời gian. Vui lòng thử lại.'
                    : `❌ Lỗi: ${error.message}. API URL: ${API_URL}/api/chat`;
                return [...filteredLogs, { sender: 'bot', text: errorMsg }];
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed bottom-4 right-4 z-50 font-sans text-xs">
            <div className="relative flex flex-col items-end">
                <button
                    onClick={() => setShowChat(!showChat)}
                    aria-label={showChat ? "Đóng hộp thoại tư vấn HeliBot" : "Mở hộp thoại tư vấn HeliBot"}
                    className="w-11 h-11 sm:w-12 sm:h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center shadow-xl hover:scale-105 active:scale-95 transition-all duration-200"
                >
                    <MessageSquare className="w-5 h-5 sm:w-5.5 sm:h-5.5" />
                </button>

                {/* CHAT WINDOW */}
                {showChat && (
                    <div className="absolute bottom-14 right-0 w-[280px] sm:w-[320px] h-[360px] sm:h-[400px] bg-white dark:bg-neutral-950 rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-800 flex flex-col overflow-hidden animate-scaleIn origin-bottom-right">
                        {/* HEADER */}
                        <div className="p-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                            <div>
                                <h4 className="font-bold text-[11px] sm:text-xs">HeliBot Assistant</h4>
                                <p className="text-[9px] sm:text-[10px] text-blue-100 font-normal">Hệ thống hỗ trợ phần cứng tự động</p>
                            </div>
                        </div>

                        {/* MESSAGES LAYER */}
                        <div className="flex-1 p-3 overflow-y-auto space-y-2.5 bg-neutral-50/50 dark:bg-neutral-900/10">
                            {chatLogs.map((log, index) => (
                                <div key={index} className={`flex ${log.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[85%] px-3 py-2 rounded-xl break-words whitespace-pre-wrap text-[12px] ${
                                        log.sender === 'user' 
                                            ? 'bg-blue-600 text-white rounded-tr-none' 
                                            : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 rounded-tl-none'
                                    } ${log.isTyping ? 'animate-pulse' : ''}`}>
                                        {log.text}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* INPUT ACTIONS */}
                        <div className="p-2 sm:p-3 bg-neutral-50 dark:bg-neutral-900/40 border-t border-neutral-200 dark:border-neutral-800 flex gap-1.5">
                            <input
                                type="text"
                                placeholder="Nhập câu hỏi..."
                                aria-label="Nhập nội dung câu hỏi cho HeliBot"
                                value={chatInput}
                                onChange={(e) => setChatInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && !isLoading && handleSendMessage()}
                                disabled={isLoading}
                                className="flex-1 px-3 py-2 rounded-xl text-xs bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white focus:outline-none min-w-0 disabled:opacity-50"
                            />
                            <button 
                                onClick={handleSendMessage}
                                disabled={isLoading}
                                aria-label="Gửi tin nhắn tư vấn"
                                className="p-2 sm:p-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shrink-0 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Send className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
