import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    target: 'esnext', // Sử dụng Javascript hiện đại để triệt tiêu các polyfill dư thừa
    minify: 'esbuild', // Nén code siêu tốc, tối ưu hóa kích thước file text xuất ra
    cssCodeSplit: true, // Chỉ load CSS đi kèm với component đang hiển thị
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Kỹ thuật Code Splitting tách nhỏ các package trong node_modules
          if (id.includes('node_modules')) {
            if (id.includes('lucide-react')) {
              return 'vendor-icons'; // Đóng gói kho icon khổng lồ ra một tệp riêng biệt
            }
            if (id.includes('react')) {
              return 'vendor-core'; // Giữ cache React lõi lâu bền trên trình duyệt người dùng
            }
            return 'vendor-libs';
          }
        },
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]'
      }
    },
    chunkSizeWarningLimit: 600
  }
});