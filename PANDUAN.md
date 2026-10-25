# Panduan Front-End TripBuddy (Nuxt)

Repository ini adalah **front-end** TripBuddy. Back-end (Express + SQLite) ada di repository terpisah dan dideploy terpisah.

## 1. Struktur Proyek

```
.
├── nuxt.config.ts          # Nuxt 4 SPA, srcDir: src/, Tailwind, Pinia
├── vite.config.ts          # konfigurasi Vitest + coverage 100%
├── public/
│   ├── logo.svg
│   ├── covers/cover-1..4.svg   # ilustrasi sampul bawaan (pantai, gunung, kota, hutan)
│   └── images/hero-travel.svg  # ilustrasi halaman login
└── src/
    ├── App.vue, routes.ts, router.options.ts
    ├── helpers/            # apiHelper (fetch + token), toolsHelper (dialog, format, defaultCover)
    ├── hooks/useInput.ts
    └── features/
        ├── auth/           # api, states, layouts (AuthLayout), pages (Login, Register)
        ├── trips/
        │   ├── api/        # tripApi, itineraryApi, expenseApi
        │   ├── states/     # tripsStore (Pinia)
        │   ├── components/ # NavbarComponent, BudgetSummary, ItineraryPanel, ExpensePanel, TripCover
        │   ├── modals/     # TripModal, ItineraryModal, ExpenseModal
        │   ├── layouts/    # TripLayout
        │   └── pages/      # HomePage (dashboard), DetailPage, ExpensesPage, ProfilePage
        └── common/         # NotFoundPage
```

## 2. Konfigurasi

```bash
bun install
cp .env.example .env
```

| Variabel | Fungsi | Contoh |
| --- | --- | --- |
| `VITE_API_BASEURL` | URL dasar REST API (dibaca saat **build**) | `http://localhost:4000/api` |
| `APP_PORT` | Port Nuxt dev | `3000` |

Nilai `VITE_API_BASEURL` disuntikkan sebagai konstanta global `API_BASEURL` lewat `vite.define` (deklarasi tipe di `src/env.d.ts`) dan dipakai oleh `apiHelper.ts`.

## 3. Logika Aplikasi

1. **Helper**: `apiHelper.ts` membungkus `fetch`, menyisipkan token Bearer otomatis, dan menyediakan `getAccessToken`/`putAccessToken`/`removeAccessToken`. `toolsHelper.ts` berisi dialog SweetAlert2 (`showSuccessDialog`, `showErrorDialog`, `showConfirmDialog`), format rupiah dan tanggal, serta `defaultCover`.
2. **Hook**: `useInput.ts`, composable pengikat input form.
3. **Auth**: `authApi`, `authStore`, `AuthLayout` (panel ilustrasi + form), `LoginPage`, `RegisterPage`.
4. **Trips**: `tripsStore` menyimpan daftar trip, trip aktif, agenda, dan pengeluaran. `BudgetSummary` menampilkan total anggaran, total pengeluaran, sisa, persentase penggunaan, dan rincian per kategori.
5. **Rute** (`src/routes.ts`, dipasok ke Nuxt lewat `src/router.options.ts`):

| Rute | Halaman |
| --- | --- |
| `/auth/login`, `/auth/register` | Login, Registrasi (dibungkus `AuthLayout`) |
| `/` | Dashboard daftar trip (dibungkus `TripLayout`) |
| `/expenses` | Semua pengeluaran dari seluruh trip, dengan filter kategori |
| `/profile` | Data akun dan ringkasan (jumlah trip, total anggaran, total pengeluaran) |
| `/trips/:tripId` | Detail trip: banner sampul, ringkasan anggaran, agenda, pengeluaran |
| `/:pathMatch(.*)*` | 404 |

## 4. Gambar pada Tampilan

| Lokasi | Gambar |
| --- | --- |
| Halaman login/registrasi | Ilustrasi `public/images/hero-travel.svg` di panel kiri (tampil pada layar lebar) |
| Dashboard | Setiap kartu trip memiliki gambar sampul di bagian atas |
| Detail trip | Banner sampul besar dengan judul, lokasi, dan tanggal di atasnya |
| Form trip | Kolom **Gambar Sampul (URL, opsional)** dengan pratinjau langsung |

Cara kerja sampul (komponen `TripCover.vue`):

- Bila trip punya `cover_image`, gambar itu yang ditampilkan.
- Bila kosong, atau URL gagal dimuat, otomatis dipakai salah satu dari 4 ilustrasi bawaan di `public/covers/` (dipilih dari id trip: `cover-{(id % 4) + 1}.svg`), sehingga tampilan tidak pernah memuat gambar rusak.

Untuk mengganti ilustrasi, timpa file di `public/covers/` atau `public/images/` dengan nama yang sama.

## 5. Pengujian dan Build

```bash
bun run test:coverage      # 151 tes, coverage 100%
bun run build              # build produksi
```

Threshold 100% dipasang di `vite.config.ts`, sehingga perintah gagal bila coverage turun. Catatan untuk Jenkins: `bun install`, `bun run test:coverage`, `bun run build`.

### Aksesibilitas dan Kualitas

Seluruh halaman diaudit dengan Lighthouse dan axe-core pada build produksi, termasuk halaman terproteksi (setelah login). Hasil: Performance, Accessibility, dan SEO **100**, serta tanpa pelanggaran axe (WCAG 2.1 A/AA). Yang dijaga: kontras teks minimal 4,5:1, landmark `<main>` pada setiap halaman, urutan heading yang benar, label pada semua kolom form, tabel dengan `caption` dan `scope`, `meta description`, dan `robots.txt`. Nilai Best Practices bisa kurang 4 poin bila font Google tidak dapat dimuat (jaringan yang memblokir).

## 6. Deployment ke Vercel

Pastikan **back-end sudah live** dan catat URL-nya.

1. **Push ke GitHub** (repository front-end sendiri)

   ```bash
   git init && git add . && git commit -m "TripBuddy frontend"
   git branch -M main
   git remote add origin https://github.com/<username>/<repo-frontend>.git
   git push -u origin main
   ```

2. **Import ke Vercel**: Add New → Project → pilih repository front-end. Framework Preset akan terdeteksi sebagai `Nuxt.js`; Root Directory dibiarkan default.
3. Tambahkan Environment Variable:

   | Variabel | Nilai |
   | --- | --- |
   | `VITE_API_BASEURL` | `https://<nama-backend>.vercel.app/api` |

4. Deploy. Karena nilai variabel dibaca saat build, jika kamu mengubahnya kamu harus **Redeploy**.
5. (Disarankan) Di project Vercel **back-end**, ubah `CORS_ORIGIN` menjadi URL front-end (`https://<nama-frontend>.vercel.app`), lalu Redeploy back-end.

URL front-end inilah yang dikumpulkan sebagai "URL aplikasi yang dapat diakses online".

### Isian form grading UI

| Kolom | Isi |
| --- | --- |
| Base URL | URL frontend di Vercel, tanpa garis miring di akhir, harus diawali `https://ifs24009-pabwe2026-proyek1` |
| Path halaman publik | `/auth/login` dan `/auth/register` |
| Akun uji coba | Akun yang sudah didaftarkan di aplikasi online. Kolom *username* diisi **email** akun tersebut |
| Path halaman terproteksi | `/`, `/expenses`, `/profile`, `/trips/1` (ganti `1` dengan id trip milik akun uji) |

Pastikan akun uji memiliki minimal satu trip agar `/trips/<id>` berisi data, dan backend sudah live.

## 7. Naskah Video YouTube (mulai dari clone repository)

Tampilkan terminal dan jelaskan tiap perintah beserta hasilnya. Video ini memakai **dua repository**.

1. Perkenalan: nama, NIM, judul proyek TripBuddy, dan bahwa aplikasi terdiri dari back-end dan front-end.
2. **Back-end**, terminal 1:
   - `git clone <URL-REPOSITORY-BACKEND>` lalu `cd <folder-backend>`
   - `bun install`
   - `cp .env.example .env` (Windows: `copy .env.example .env`)
   - `bun run dev`, lalu buka `http://localhost:4000/api/health`
3. **Front-end**, terminal 2:
   - `git clone <URL-REPOSITORY-FRONTEND>` lalu `cd <folder-frontend>`
   - `bun install`
   - `cp .env.example .env`
   - `bun run dev`, lalu buka `http://localhost:3000`
4. Demo: daftar akun → masuk → buat trip dengan gambar sampul (URL) dan satu trip tanpa gambar (tunjukkan ilustrasi bawaan) → buka detail → tambah agenda Hari 1 dan Hari 2 → catat pengeluaran beberapa kategori → tunjukkan sisa anggaran dan persentase berubah → tunjukkan halaman Pengeluaran (filter kategori) dan Profil → ubah dan hapus trip.
5. Pengujian: jalankan `bun run test:coverage` di kedua repository dan tunjukkan semuanya 100%.
6. Tunjukkan URL online di Vercel (front-end dan `/api/health` back-end), lalu penutup.
