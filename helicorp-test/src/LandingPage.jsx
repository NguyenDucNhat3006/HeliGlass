import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Helmet } from 'react-helmet-async';
import { Sun, Moon, ShoppingCart, Heart, Radio, Compass, Layers } from 'lucide-react';
import API_URL from './config/api';

import heroImg from './assets/product/images/hero.webp';
import bannerImg from './assets/product/images/banner.webp';

const HeliBot = lazy(() => import('./HeliBot'));

export default function LandingPage() {
    const [darkMode, setDarkMode] = useState(true);
    const [favorites, setFavorites] = useState(false);
    const [cart, setCart] = useState(0);

    // Form State
    const [formData, setFormData] = useState({ name: '', email: '' });
    const [formStatus, setFormStatus] = useState({ type: '', msg: '' });

    useEffect(() => {
        if (darkMode) document.documentElement.classList.add('dark');
        else document.documentElement.classList.remove('dark');
    }, [darkMode]);

    useEffect(() => {
        const elements = document.querySelectorAll('.reveal-on-scroll');
        if (elements.length === 0) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('opacity-100', 'translate-y-0');
                    entry.target.classList.remove('opacity-0', 'translate-y-8');
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

        elements.forEach(el => observer.observe(el));
        return () => observer.disconnect();
    }, []);

    const handleSubscribe = async (e) => {
        e.preventDefault();
        if (!formData.name || !formData.email) {
            setFormStatus({ type: 'error', msg: 'Vui lòng điền đầy đủ thông tin.' });
            return;
        }

        setFormStatus({ type: 'loading', msg: 'Đang xử lý...' });

        try {
            const response = await fetch(API_URL + '/api/subscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                setFormStatus({ type: 'success', msg: 'Đăng ký nhận ưu đãi thành công!' });
                setFormData({ name: '', email: '' });
            } else {
                setFormStatus({ type: 'error', msg: data.message || 'Có lỗi xảy ra, vui lòng thử lại.' });
            }
        } catch (error) {
            setFormStatus({ type: 'error', msg: 'Không thể kết nối đến máy chủ.' });
        }
    };

    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-50 font-sans transition-colors duration-300">
            <Helmet>
                <title>HeliGlass Pro - Kính Thực Tế Ảo Thế Hệ Mới bởi HELICORP</title>
                <meta name="description" content="Khám phá HeliGlass Pro - Thiết bị kính thực tế ảo siêu nhẹ 75g, pin 12 giờ, tích hợp thấu kính phân cực đổi màu linh hoạt từ HELICORP." />
            </Helmet>

            {/* NAVBAR */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-neutral-50/80 dark:bg-neutral-950/80 backdrop-blur-md border-b border-neutral-200/50 dark:border-neutral-900/50">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
                    <span className="text-sm font-black tracking-widest text-neutral-900 dark:text-white">
                        HELI<span className="text-blue-600">CORP</span>
                    </span>
                    <div className="flex items-center gap-1.5 sm:gap-2">
                        <button 
                            onClick={() => setDarkMode(!darkMode)}
                            aria-label={darkMode ? "Chuyển sang giao diện sáng" : "Chuyển sang giao diện tối"}
                            className="p-2 rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-900 text-neutral-600 dark:text-neutral-400 transition-colors"
                        >
                            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                        </button>
                        <button 
                            onClick={() => setFavorites(!favorites)}
                            aria-label={favorites ? "Xóa khỏi danh sách yêu thích" : "Thêm vào danh sách yêu thích"}
                            className="p-2 rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-900 text-neutral-600 dark:text-neutral-400 transition-colors relative"
                        >
                            <Heart className={`w-4 h-4 transition-colors ${favorites ? 'fill-red-500 text-red-500' : ''}`} />
                        </button>
                        <button 
                            onClick={() => setCart(prev => prev + 1)}
                            aria-label="Thêm vào giỏ hàng và xem giỏ hàng"
                            className="p-2 rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-900 text-neutral-600 dark:text-neutral-400 transition-colors relative"
                        >
                            <ShoppingCart className="w-4 h-4" />
                            {cart > 0 && (
                                <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-blue-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center animate-scaleIn">
                                    {cart}
                                </span>
                            )}
                        </button>
                    </div>
                </div>
            </nav>

            {/* HERO SECTION */}
            <header className="relative pt-28 pb-16 sm:pt-36 sm:pb-24 overflow-hidden">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-12 gap-8 items-center relative z-10">
                    <div className="md:col-span-7 space-y-5 text-center md:text-left">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[10px] font-semibold uppercase tracking-wider mx-auto md:mx-0">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></span>
                            Công nghệ độc quyền 2026
                        </div>
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-[1.1] text-neutral-900 dark:text-white">
                            HeliGlass Pro<br />
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-500 dark:from-blue-400 dark:to-indigo-400">
                                Định Hình Thực Tại Mới
                            </span>
                        </h1>
                        <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 max-w-xl mx-auto md:mx-0 font-normal leading-relaxed">
                            Tuyệt tác kính thông minh lai thực tế ảo siêu nhẹ chỉ 75g từ HELICORP. Trải nghiệm không gian làm việc đa màng hình vô hạn cùng thời lượng pin bền bỉ ấn tượng suốt 12 giờ liên tục.
                        </p>
                    </div>
                    <div className="md:col-span-5 relative flex justify-center">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 blur-3xl rounded-full scale-75 -z-10"></div>
                        <img
                            src={heroImg}
                            alt="Thiết bị kính thực tế ảo HeliGlass Pro cao cấp"
                            fetchpriority="high"
                            width="480"
                            height="320"
                            className="relative z-10 w-full max-w-[480px] h-auto object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-700 px-4 sm:px-0"
                        />
                    </div>
                </div>
            </header>

            {/* ARCHITECTURE FEATURES */}
            <main className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-20 space-y-24">
                <section aria-labelledby="features-heading" className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <h2 id="features-heading" className="sr-only">Tính năng nổi bật của HeliGlass Pro</h2>
                    <div className="reveal-on-scroll opacity-0 translate-y-8 transition-all duration-700 delay-100 p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/60 dark:border-neutral-800/60 shadow-sm space-y-3">
                        <div className="w-8 h-8 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400">
                            <Layers className="w-4 h-4" />
                        </div>
                        <h3 className="text-sm font-bold text-neutral-900 dark:text-white">Cơ chế Khúc xạ Đa tần</h3>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed font-normal">
                            Kiến trúc ống kính Micro-OLED kép thế hệ mới đồng bộ pha tần số cao, giảm thiểu triệt để hiện tượng sai lệch sắc rìa, mang lại độ nét võng mạc hoàn hảo trên từng pixel điểm ảnh.
                        </p>
                    </div>

                    <div className="reveal-on-scroll opacity-0 translate-y-8 transition-all duration-700 delay-200 p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/60 dark:border-neutral-800/60 shadow-sm space-y-3">
                        <div className="w-8 h-8 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                            <Radio className="w-4 h-4" />
                        </div>
                        <h3 className="text-sm font-bold text-neutral-900 dark:text-white">Thấu kính Phân cực Đổi màu</h3>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed font-normal">
                            Lớp phủ quang học thông minh tự động tinh chỉnh độ xuyên sáng (VLT) từ 15% đến 85% dựa trên cường độ tia cực tím môi trường thực tế, giúp tối ưu hiển thị cả trong nhà lẫn ngoài trời.
                        </p>
                    </div>

                    <div className="reveal-on-scroll opacity-0 translate-y-8 transition-all duration-700 delay-300 p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/60 dark:border-neutral-800/60 shadow-sm space-y-3">
                        <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                            <Compass className="w-4 h-4" />
                        </div>
                        <h3 className="text-sm font-bold text-neutral-900 dark:text-white">Định vị Không gian 6-DoF</h3>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed font-normal">
                            Hệ thống cảm biến quán tính IMU siêu nhạy kết hợp thuật toán thị giác máy tính SLAM thời gian thực, khóa cứng các cửa sổ ứng dụng ảo vào không gian cố định với độ trễ gần như bằng 0.
                        </p>
                    </div>
                </section>

                {/* CALL TO ACTION BANNER */}
                <section aria-labelledby="cta-heading" className="reveal-on-scroll opacity-0 translate-y-8 transition-all duration-1000 relative rounded-3xl overflow-hidden bg-neutral-900 dark:bg-neutral-900 min-h-[320px] sm:min-h-[380px] flex items-center px-6 sm:px-12 text-white">
                    <img
                        src={bannerImg}
                        alt="Không gian trải nghiệm người dùng HeliGlass sinh động"
                        loading="lazy"
                        decoding="async"
                        width="1024"
                        height="450"
                        className="absolute inset-0 w-full h-full object-cover scale-105 hover:scale-100 transition-transform duration-[20s] ease-out opacity-65"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent"></div>
                    <div className="relative z-10 max-w-md space-y-4">
                        <h2 id="cta-heading" className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
                            Sẵn Sàng Trải Nghiệm Khác Biệt?
                        </h2>
                        <p className="text-xs text-neutral-300 leading-relaxed font-normal">
                            Trở thành những người đầu tiên sở hữu đặc quyền công nghệ tương lai từ HELICORP. Đăng ký thông tin ngay hôm nay để nhận thông báo sớm nhất về phiên bản thử nghiệm giới hạn.
                        </p>
                    </div>
                </section>

                {/* REGISTRATION FORM */}
                <section aria-labelledby="register-heading" className="reveal-on-scroll opacity-0 translate-y-8 transition-all duration-700 max-w-md mx-auto space-y-6 pt-6">
                    <div className="text-center space-y-1.5">
                        <h2 id="register-heading" className="text-xl sm:text-2xl font-black tracking-tight text-neutral-900 dark:text-white">Đăng ký nhận ưu đãi 20%</h2>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 font-normal">Để lại thông tin để đặt chỗ trước cho phiên bản HeliGlass Pro thương mại.</p>
                    </div>

                    <form onSubmit={handleSubscribe} className="space-y-3">
                        <div className="space-y-1">
                            <input
                                type="text"
                                placeholder="Họ và tên của bạn"
                                aria-label="Nhập họ và tên của bạn"
                                value={formData.name}
                                onChange={(e) => setFormData(e.name = e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl text-xs bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 transition-colors"
                            />
                        </div>
                        <div className="space-y-1">
                            <input
                                type="email"
                                placeholder="Địa chỉ email cá nhân"
                                aria-label="Nhập địa chỉ email cá nhân"
                                value={formData.email}
                                onChange={(e) => setFormData(e.email = e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl text-xs bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 transition-colors"
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full py-2.5 rounded-xl text-xs font-bold tracking-wide bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/10 transition-all flex items-center justify-center gap-1.5"
                        >
                            Gửi Đăng Ký Bản Thử Nghiệm
                        </button>
                    </form>

                    {formStatus.msg && (
                        <div className={`p-3 rounded-xl text-center text-xs font-medium animate-fadeIn ${
                            formStatus.type === 'success' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                            : formStatus.type === 'error' ? 'bg-red-500/10 text-red-600 dark:text-red-400'
                                : 'text-blue-500'
                            }`}>
                            {formStatus.msg}
                        </div>
                    )}
                </section>
            </main>

            {/* FOOTER */}
            <footer className="max-w-5xl mx-auto px-4 sm:px-6 py-8 text-[10px] sm:text-[11px] text-neutral-400 dark:text-neutral-500 font-normal leading-relaxed space-y-4">
                <p>1. Sản phẩm HeliGlass Pro hiện đang trong lộ trình thử nghiệm kỹ thuật nội bộ năm 2026 bởi tập đoàn HELICORP.</p>
                <div className="flex flex-col sm:flex-row justify-between pt-4 border-t border-neutral-200 dark:border-neutral-900 text-neutral-500 gap-3">
                    <div>Bản quyền © 2026 HELICORP.</div>
                    <div className="flex flex-wrap gap-4 font-medium">
                        <span className="hover:underline cursor-pointer">Bảo mật</span>
                        <span className="hover:underline cursor-pointer">Điều khoản</span>
                    </div>
                </div>
            </footer>

            {/* CHATBOT LAZY LOAD */}
            <Suspense fallback={null}>
                <HeliBot />
            </Suspense>
        </div>
    );
}