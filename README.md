# Portal Aplikasi (Sistem Autentikasi Cerdas)

Ini adalah proyek implementasi sistem autentikasi lengkap dengan Next.js App Router dan Supabase, dirancang khusus untuk memenuhi standar minimum *assessment* sistem manajemen aman.

## 🚀 Fitur Utama (Minimum Scope Achieved)

- **Registrasi & Login:** Menggunakan Supabase Auth (Email & Password).
- **Validasi Ganda (Frontend & Backend):** 
  - *Frontend:* Validasi format email, kelengkapan form, kecocokan *password* dengan *confirm password* secara real-time.
  - *Backend:* Supabase memvalidasi format email, panjang karakter password (min. 6), serta mengecek keunikan email.
- **Keamanan Password:** Disimpan secara aman dengan enkripsi *bcrypt* yang diotomatisasi penuh oleh infrastruktur Supabase Auth.
- **Lupa / Reset Password:** Tersedia alur penuh untuk mereset kata sandi melalui tautan (Magic Link) yang dikirim ke email, lalu diarahkan ke halaman `/update-password`.
- **Manajemen Role:** Terdapat tabel `profiles` (disinkronisasikan otomatis via *database trigger*) yang menampung role (`admin` atau `user`).
- **Proteksi Halaman (Role-based Access Control / RBAC):** 
  - Halaman `/dashboard` eksklusif untuk User dan Admin.
  - Halaman `/admin` HANYA dapat diakses oleh akun berstatus `admin`. Upaya penyusupan oleh akun biasa akan dilempar (*redirect*) otomatis kembali ke dashboard.
- **Pencegahan Brute-force / Rate Limiting:** 
  - API Auth Supabase dilengkapi perlindungan *Rate Limiting* bawaan (pembatasan OTP dan Login).
  - Terdapat mekanisme pencegahan bot otomatis dari server backend kami.
- **Error Handling Aman:** Segala error jaringan atau kesalahan password difilter. Pengguna hanya menerima pesan generik seperti *"Email tidak terdaftar atau kata sandi salah!"* untuk menghindari celah *User Enumeration*.
- **Tampilan Premium & Responsif:** Dibangun menggunakan Tailwind CSS standar industri, dengan ikon dari *Lucide React*. Responsif di Mobile, Tablet, dan Desktop. Tidak menggunakan komponen *UI Library* instan, sehingga sepenuhnya kustom dan bersih.

## 🛠️ Keputusan Teknis & Arsitektur

### 1. Kenapa Next.js App Router?
Next.js (React) dipilih karena kemampuannya dalam memadukan SSR (Server-Side Rendering) dan perlindungan server murni (Server Actions & Server Components). Ini membuat data sensitif seperti *Token* dan pengecekan akses dapat dijalankan secara tersembunyi di server tanpa perlu membocorkannya ke *bundle* JavaScript di browser klien.

### 2. Kenapa Memilih Supabase?
- **Keamanan Enterprise:** Supabase Auth secara internal menggunakan standar JWT (JSON Web Tokens) dan standar enkripsi yang aman (GoTrue).
- **Row Level Security (RLS):** Database PostgreSQL dari Supabase menggunakan RLS, yang menjamin bahwa meskipun URL database bocor, pengguna tidak akan bisa membaca tabel `profiles` orang lain (kecuali admin).
- **Trigger Database:** Kami menggunakan arsitektur event-driven (Trigger) di Postgres. Setiap ada user baru yang diverifikasi di GoTrue (sistem Auth Supabase), trigger otomatis menembakkan baris baru di tabel `profiles` kami dengan role default `user`. 

### 3. Bagian Mana yang Kami Kerjakan Sendiri?
Meskipun infrastruktur otentikasinya dibantu Supabase, arsitektur aplikasi adalah **100% buatan kami sendiri**:
- Logika validasi *Server Actions* (login, logout, registrasi, lupa password).
- Implementasi SSR Middleware dan proteksi layout berdasarkan JWT yang ter-decode.
- Implementasi *rate-limiter* tambahan dan *error mask*.
- Seluruh Desain UI/UX mulai dari form masuk hingga dashboard data visual.
- *Activity Logger* (mencatat aktivitas log pengguna ke tabel terpisah).

## 🔒 Security Best Practices yang Diterapkan

1. **Anti Infinite-Recursion di RLS:** Kami menggunakan fungsi `SECURITY DEFINER` (seperti sudo di Linux) untuk membiarkan sistem mengecek role Admin dengan aman tanpa terjebak *recursive query error* di PostgreSQL.
2. **Server-only Cookies:** Sesi pengguna disimpan dalam cookie dengan atribut `HttpOnly`, yang mustahil ditembus/dibaca oleh celah XSS (Cross-Site Scripting).
3. **Cache-Busting (No-Store):** Halaman Dashboard dan Admin menggunakan konfigurasi `export const dynamic = 'force-dynamic'` & mematikan *fetch cache*. Hal ini menjamin jika hak akses dicabut di database, di detik itu juga user akan terbuang saat me-refresh halaman (tidak menggunakan data usang di memori Next.js).
4. **Validasi Server Form (Safe Errors):** Walaupun Frontend sudah mengecek konfirmasi password, Backend kami (Server Actions) tidak mempercayai apapun yang dikirim Frontend. Validasi tetap dilakukan ganda di tingkat server.

## 🔑 Akun Demo

Untuk mendemokan aplikasi, Anda bisa menggunakan akun berikut:

**Akun Administrator:**
- **Email:** `admin@gmail.com`
- **Password:** `Admin1122@`

**Akun User Biasa:**
- **Email:** `User@gmail.com`
- **Password:** `User1122@`

*(Tentu Anda juga bisa mencoba membuat akun sendiri dengan mengklik tombol "Daftar")*

## 💻 Cara Menjalankan Secara Lokal (Local Development)

1. **Clone repository ini**
   ```bash
   git clone [MASUKKAN_URL_REPO_GITHUB]
   cd login
   ```

2. **Install Dependensi**
   ```bash
   npm install
   ```

3. **Siapkan Environment Variables**
   Ubah nama file `.env.local.example` menjadi `.env.local` dan pastikan kunci kredensial Supabase (URL dan Anon Key) sudah ada di dalamnya.

4. **Jalankan Aplikasi**
   ```bash
   npm run dev
   ```
   Lalu buka [http://localhost:3000](http://localhost:3000) di browser Anda.

## 🚀 Cara Deploy

Aplikasi ini sangat siap untuk di-*deploy* langsung ke **Vercel** atau **Netlify**.
1. Push kode Anda ke repository GitHub.
2. Masuk ke Vercel (vercel.com), klik `Add New Project`, dan pilih repository ini.
3. Di bagian Environment Variables Vercel, jangan lupa masukkan isi file `.env.local` Anda.
4. Klik Deploy!
