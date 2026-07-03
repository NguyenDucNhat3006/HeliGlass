import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Sun, Moon, ShoppingCart, Heart, MessageSquare, Send, Radio, Compass, Layers } from 'lucide-react';
import API_URL from './config/api';

// IMPORT TÀI NGUYÊN HÌNH ẢNH
import heroImg from './assets/product/images/hero.png';
import bannerImg from './assets/product/images/banner.png';

export default function LandingPage() {
    const [darkMode, setDarkMode] = useState(true);
    const [favorites, setFavorites] = useState(false);
    const [cart, setCart] = useState(0);

    // Form & Chatbot States
    const [formData, setFormData] = useState({ name: '', email: '' });
    const [formStatus, setFormStatus] = useState({ type: '', msg: '' });
    const [showChat, setShowChat] = useState(false);
    const [chatInput, setChatInput] = useState('');
    const [chatLogs, setChatLogs] = useState([
        { sender: 'bot', text: 'Xin chào. Tôi có thể cung cấp thông tin gì về cấu trúc phần cứng của HeliGlass Pro?' }
    ]);

    useEffect(() => {
        if (darkMode) document.documentElement.classList.add('dark');
        else document.documentElement.classList.remove('dark');
    }, [darkMode]);

    useEffect(() => {
        const elements = document.querySelectorAll('.reveal-on-scroll');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) entry.target.classList.add('is-visible');
            });
        }, { threshold: 0.05 });
        elements.forEach(el => observer.observe(el));
        return () => elements.forEach(el => observer.unobserve(el));
    }, []);

    const handleSubscribe = async (e) => {
        e.preventDefault();
        setFormStatus({ type: 'loading', msg: 'Đang gửi dữ liệu...' });

        try {
            const response = await fetch(API_URL + '/api/subscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (!response.ok) throw new Error('Lỗi server');

            setFormStatus({ type: 'success', msg: 'Thông tin đã được lưu trữ an toàn. Cảm ơn bạn.' });
            setFormData({ name: '', email: '' });
        } catch (error) {
            setFormStatus({ type: 'error', msg: 'Kết nối máy chủ thất bại. Vui lòng thử lại.' });
        }
    };

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
        <div className={`min-h-screen font-sans antialiased select-none ${darkMode ? 'bg-black text-white' : 'bg-[#ffffff] text-[#1d1d1f]'}`}>
            <Helmet>
                <title>HeliGlass Pro — HELICORP</title>
                <meta name="description" content="Thiết bị tính năng máy tính không gian cao cấp." />
            </Helmet>

            {/* TOP NAVIGATION */}
            <nav className={`sticky top-0 z-40 border-b ${darkMode ? 'border-neutral-900 bg-black/80' : 'border-neutral-100 bg-white/80'} backdrop-blur-md`}>
                {/* ĐÃ SỬA: Lề mobile px-4 thay vì px-6 */}
                <div className="container mx-auto max-w-5xl px-4 sm:px-6 h-14 flex justify-between items-center text-xs tracking-tight">
                    <div className="font-bold text-sm tracking-normal">HELICORP</div>

                    <div className="hidden sm:flex gap-8 font-normal text-neutral-500 dark:text-neutral-400">
                        <a href="#optics" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Thiết kế</a>
                        <a href="#specifications" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Thông số</a>
                        <a href="#reserve" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Đặt trước</a>
                    </div>

                    <div className="flex items-center gap-3 sm:gap-4">
                        <button onClick={() => setFavorites(!favorites)} className="p-1 text-neutral-400 hover:text-red-500 dark:hover:text-red-400 transition-colors">
                            <Heart className={`w-4 h-4 sm:w-4 sm:h-4 ${favorites ? 'fill-current text-red-500' : ''}`} />
                        </button>
                        <button onClick={() => setCart(c => c + 1)} className="p-1 text-neutral-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors relative">
                            <ShoppingCart className="w-4 h-4 sm:w-4 sm:h-4" />
                            {cart > 0 && <span className="absolute -top-1 -right-1.5 bg-blue-600 text-white text-[9px] w-3.5 h-3.5 rounded-full flex items-center justify-center font-bold">{cart}</span>}
                        </button>
                        <button onClick={() => setDarkMode(!darkMode)} className="p-1 rounded-full bg-neutral-100 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 hover:scale-105 transition-transform">
                            {darkMode ? <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <Moon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                        </button>
                    </div>
                </div>
            </nav>

            {/* 1. HERO SECTION */}
            <section className="container mx-auto max-w-5xl px-4 sm:px-6 pt-16 sm:pt-24 pb-12 sm:pb-16 text-center">
                <div className="space-y-3 sm:space-y-4">
                    <span className="text-[10px] sm:text-xs font-bold tracking-widest text-blue-600 dark:text-blue-500 uppercase">Kỷ nguyên không gian mới</span>
                    <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tighter leading-tight text-neutral-900 dark:text-white">
                        HeliGlass Pro
                    </h1>
                    <p className="text-base sm:text-lg md:text-xl font-normal text-neutral-500 dark:text-neutral-400 max-w-xl mx-auto tracking-tight px-2">
                        Thấu kính máy tính không gian mỏng nhất thế giới. Tái định nghĩa hoàn toàn phương thức tương tác số của bạn.
                    </p>
                    <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">Giá khởi điểm từ 12.990.000đ</p>
                </div>

                <div className="mt-10 sm:mt-16 max-w-2xl mx-auto relative flex justify-center items-center py-8 sm:py-12 reveal-on-scroll">
                    <div className={`absolute w-[90%] sm:w-[80%] h-[90%] sm:h-[80%] rounded-full bg-gradient-to-tr from-cyan-400 via-blue-500 to-purple-600 opacity-20 blur-2xl sm:blur-3xl transition-colors duration-1000 -z-10`}></div>
                    <img
                        src={heroImg}
                        alt="Kính thực tế ảo HeliGlass Pro"
                        className="relative z-10 w-full h-auto object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-700 px-4 sm:px-0"
                    />
                </div>
            </section>

            {/* 2. FULL WIDTH BANNER */}
            <section className="w-full relative h-[45vh] sm:h-[75vh] flex items-center justify-center overflow-hidden">
                <img
                    src={bannerImg}
                    alt="Trải nghiệm người dùng HeliGlass"
                    className="absolute inset-0 w-full h-full object-cover scale-105 hover:scale-100 transition-transform duration-[20s] ease-out"
                />
                <div className="absolute inset-0 bg-black/40 sm:bg-black/30 dark:bg-black/50"></div>
                <div className={`absolute inset-0 bg-gradient-to-t ${darkMode ? 'from-[#0a0a0b]' : 'from-[#f5f5f7]'} via-transparent to-transparent`}></div>
                <div className="relative z-10 text-center px-4 reveal-on-scroll">
                    <h2 className="text-2xl sm:text-5xl font-extrabold text-white tracking-tight drop-shadow-xl">
                        Tầm nhìn không giới hạn.
                    </h2>
                </div>
            </section>

            {/* 3. BENTO BOX SECTION */}
            <section id="optics" className="bg-[#f5f5f7] dark:bg-[#0a0a0b] py-16 sm:py-24 border-t border-neutral-100 dark:border-neutral-900">
                <div className="container mx-auto max-w-5xl px-4 sm:px-6">
                    <div className="reveal-on-scroll text-left mb-10 sm:mb-16 space-y-2">
                        <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-neutral-900 dark:text-white">Thiết kế bởi những chuyên gia.</h2>
                        <p className="text-sm sm:text-base text-neutral-500 dark:text-neutral-400 font-normal">Tập trung tuyệt đối vào công năng, lược bỏ mọi chi tiết thừa.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                        {/* ĐÃ SỬA: Thay h-80 thành min-h-[16rem] md:min-h-[20rem] để box tự động dài ra nếu chữ trên mobile bị rớt dòng */}
                        <div className="reveal-on-scroll md:col-span-2 bg-white dark:bg-[#121214] p-6 sm:p-12 rounded-3xl border border-neutral-200/60 dark:border-neutral-900 flex flex-col justify-between min-h-[16rem] md:min-h-[20rem]">
                            <div className="space-y-3 sm:space-y-4">
                                <Radio className="w-5 h-5 text-blue-600 dark:text-blue-500" />
                                <h3 className="text-lg sm:text-2xl font-bold text-neutral-900 dark:text-white">Tương tác võng mạc</h3>
                                <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 font-normal leading-relaxed max-w-md">
                                    Cảm biến quang học kép liên tục quét và tối ưu luồng sáng trực tiếp vào võng mạc, tạo chiều sâu hình ảnh chân thực mà không gây mỏi mắt.
                                </p>
                            </div>
                        </div>

                        <div className="reveal-on-scroll bg-white dark:bg-[#121214] p-6 sm:p-8 rounded-3xl border border-neutral-200/60 dark:border-neutral-900 flex flex-col justify-between min-h-[16rem] md:min-h-[20rem]">
                            <div className="space-y-3 sm:space-y-4">
                                <Compass className="w-5 h-5 text-purple-500" />
                                <h3 className="text-base sm:text-lg font-bold text-neutral-900 dark:text-white">Định vị không gian</h3>
                                <p className="text-xs text-neutral-600 dark:text-neutral-400 font-normal leading-relaxed">
                                    Chip HeliOS X2 phân tích môi trường xung quanh với tần suất 1000 lần mỗi giây, cố định chuẩn xác trong không gian vật lý.
                                </p>
                            </div>
                        </div>

                        <div className="reveal-on-scroll bg-white dark:bg-[#121214] p-6 sm:p-8 rounded-3xl border border-neutral-200/60 dark:border-neutral-900 flex flex-col justify-between min-h-[16rem] md:min-h-[20rem]">
                            <div className="space-y-3 sm:space-y-4">
                                <Layers className="w-5 h-5 text-emerald-500" />
                                <h3 className="text-base sm:text-lg font-bold text-neutral-900 dark:text-white">Vật liệu siêu nhẹ</h3>
                                <p className="text-xs text-neutral-600 dark:text-neutral-400 font-normal leading-relaxed">
                                    Toàn bộ cấu trúc khung kính đúc nguyên khối từ hợp kim hàng không, tối ưu hóa trọng lượng chỉ còn đúng 75 gram.
                                </p>
                            </div>
                        </div>

                        <div className="reveal-on-scroll md:col-span-2 bg-white dark:bg-[#121214] p-6 sm:p-12 rounded-3xl border border-neutral-200/60 dark:border-neutral-900 flex flex-col justify-between min-h-[16rem] md:min-h-[20rem]">
                            <div className="space-y-3 sm:space-y-4">
                                <div className="text-[10px] font-mono uppercase tracking-widest text-neutral-400">Độc quyền bởi HELICORP</div>
                                <h3 className="text-lg sm:text-2xl font-bold text-neutral-900 dark:text-white">Đóng gói bền vững</h3>
                                <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 font-normal leading-relaxed max-w-md">
                                    Đảm bảo 100% sợi tái chế thân thiện với môi trường, đáp ứng tiêu chuẩn chăm sóc sức khỏe toàn diện từ tập đoàn.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. TECHNICAL SPECIFICATIONS */}
            <section id="specifications" className="container mx-auto max-w-3xl px-4 sm:px-6 py-16 sm:py-24">
                <div className="reveal-on-scroll space-y-8 sm:space-y-10">
                    <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-white text-center">Thông số kỹ thuật.</h2>
                    <div className="divide-y divide-neutral-200 dark:divide-neutral-800 text-xs sm:text-sm">
                        {[
                            { title: "Màn hình hiển thị", value: "Hệ thống Micro-OLED AR, tần số quét 120Hz mượt mà" },
                            { title: "Cảm biến tích hợp", value: "Mô-đun LiDAR quét lập thể, 2x cảm biến tracking mắt hồng ngoại" },
                            { title: "Kiến trúc vi xử lý", value: "HeliOS Silicon X2 tích hợp nhân đồ họa tăng tốc không gian" },
                            { title: "Thời lượng", value: "Pin thể rắn mật độ cao, thời gian vận hành liên tục 12 giờ" }
                        ].map((item, index) => (
                            <div key={index} className="py-4 sm:py-5 flex flex-col sm:flex-row justify-between gap-1 sm:gap-2">
                                <div className="font-semibold text-neutral-900 dark:text-neutral-100 sm:w-1/3">{item.title}</div>
                                <div className="text-neutral-600 dark:text-neutral-400 font-normal sm:w-2/3">{item.value}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 5. PRE-ORDER FORM */}
            <section id="reserve" className="border-t border-neutral-200 dark:border-neutral-900 bg-[#f5f5f7] dark:bg-[#0a0a0b] py-16 sm:py-24 px-4 sm:px-6 text-center">
                <div className="reveal-on-scroll max-w-md mx-auto space-y-6">
                    <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-neutral-900 dark:text-white">Đặt chỗ sớm.</h2>
                    <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 font-normal">Hệ thống sẽ gửi mã ưu đãi giảm giá 20% vào email của bạn.</p>

                    <form onSubmit={handleSubscribe} className="space-y-4 text-left">
                        <div>
                            <label className="block text-[10px] sm:text-[11px] font-bold text-neutral-400 dark:text-neutral-500 uppercase mb-1.5">Họ và tên</label>
                            <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full px-4 py-3 sm:py-3.5 rounded-xl bg-white dark:bg-[#121214] border border-neutral-300 dark:border-neutral-800 focus:border-blue-500 focus:outline-none font-medium text-xs sm:text-sm text-neutral-900 dark:text-white shadow-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] sm:text-[11px] font-bold text-neutral-400 dark:text-neutral-500 uppercase mb-1.5">Địa chỉ Email</label>
                            <div className="flex flex-col sm:flex-row gap-3 sm:gap-2">
                                <input
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full px-4 py-3 sm:py-3.5 rounded-xl bg-white dark:bg-[#121214] border border-neutral-300 dark:border-neutral-800 focus:border-blue-500 focus:outline-none font-medium text-xs sm:text-sm text-neutral-900 dark:text-white shadow-sm"
                                />
                                <button type="submit" className="w-full sm:w-auto px-6 py-3 sm:py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-xs sm:text-sm transition-all shadow-md shrink-0">
                                    Đăng ký
                                </button>
                            </div>
                        </div>
                    </form>

                    {formStatus.msg && (
                        <div className={`p-3.5 rounded-xl text-xs font-semibold ${formStatus.type === 'success' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                                : formStatus.type === 'error' ? 'bg-red-500/10 text-red-600 dark:text-red-400'
                                    : 'text-blue-500'
                            }`}>
                            {formStatus.msg}
                        </div>
                    )}
                </div>
            </section>

            {/* FOOTER */}
            <footer className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12 text-[10px] sm:text-[11px] text-neutral-400 dark:text-neutral-500 font-normal leading-relaxed space-y-4">
                <p>1. Sản phẩm HeliGlass Pro hiện đang trong lộ trình thử nghiệm kỹ thuật nội bộ năm 2026 bởi tập đoàn HELICORP.</p>
                <div className="flex flex-col sm:flex-row justify-between pt-4 border-t border-neutral-200 dark:border-neutral-900 text-neutral-500 gap-3">
                    <div>Bản quyền © 2026 HELICORP.</div>
                    <div className="flex flex-wrap gap-4 font-medium">
                        <span className="hover:underline cursor-pointer">Bảo mật</span>
                        <span className="hover:underline cursor-pointer">Điều khoản</span>
                    </div>
                </div>
            </footer>

            {/* 6. MINIMAL CHATBOT WINDOW */}
            {/* ĐÃ SỬA: Đẩy lề right-4 bottom-4 trên mobile để không bị sát viền */}
            <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50">
                {!showChat ? (
                    <button onClick={() => setShowChat(true)} className="p-3.5 sm:p-4 bg-blue-600 text-white rounded-full shadow-xl hover:scale-105 transition-transform flex items-center justify-center">
                        <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6" />
                    </button>
                ) : (
                    /* ĐÃ SỬA: Chiều rộng tính bằng 100vw - 2rem để lọt thỏm vào màn hình di động, không bị tràn ngang. Chiều cao cũng co giãn max-h-[75vh] */
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
        </div>
    );
}