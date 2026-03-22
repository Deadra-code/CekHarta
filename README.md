# 💎 Cek Harta

**Cek Harta** (Asset Tracker) adalah aplikasi manajemen aset pribadi yang modern, aman, dan offline-first. Dirancang untuk membantu Anda mencatat, melacak, dan mengamankan data aset berharga Anda dengan antarmuka yang premium dan elegan.

## ✨ Fitur Unggulan

- **🔒 App Lock (PIN Security)**: Amankan data Anda dengan PIN 4 digit yang disimpan secara lokal. Aplikasi akan terkunci secara otomatis setiap kali dibuka kembali.
- **🖼️ Document Viewer**: Pratinjau langsung untuk dokumen penting (PDF & Gambar) tanpa perlu mengunduh ke sistem file perangkat.
- **🎨 Premium UI/UX**: Antarmuka modern dengan efek *glassmorphism*, tipografi elegan (Inter & Manrope), serta sistem dialog kustom yang mewah.
- **📶 Offline First (PWA)**: Data Anda adalah milik Anda. Semua informasi disimpan secara lokal di perangkat menggunakan `IndexedDB` dan `localStorage`. Dapat diinstal sebagai aplikasi di HP atau laptop.
- **📁 Manajemen Dokumen & Kontak**: Simpan salinan digital sertifikat dan kontak darurat (notaris, pengacara, dll) di satu tempat yang aman.
- **📊 Dasbor Statistik**: Gambaran cepat nilai total aset dan aktivitas terbaru Anda.

## 🚀 Teknologi

- **Frontend**: [React 18](https://reactjs.org/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Database Lokal**: [idb-keyval](https://github.com/jakearchibald/idb-keyval) (IndexedDB)
- **Icons**: [Google Material Symbols](https://fonts.google.com/icons)
- **Testing**: [Vitest](https://vitest.dev/) + [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)

## 🛠️ Pengembangan Lokal

1. **Clone repository**:
   ```bash
   git clone https://github.com/Deadra-code/CekHarta.git
   cd CekHarta
   ```

2. **Instal dependensi**:
   ```bash
   npm install
   ```

3. **Jalankan server dev**:
   ```bash
   npm run dev
   ```

4. **Jalankan pengujian**:
   ```bash
   npm run test:unit
   ```

## 🌐 Deployment

Aplikasi ini dikonfigurasi untuk **Deployment Otomatis** ke GitHub Pages melalui GitHub Actions. Setiap perubahan yang di-push ke branch `main` akan memicu proses build dan sinkronisasi otomatis.

---
Dikembangkan dengan ❤️ untuk keamanan aset berharga Anda.
