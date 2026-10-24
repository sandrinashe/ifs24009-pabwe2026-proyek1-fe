# TripBuddy Frontend

Antarmuka web aplikasi perencana perjalanan dan pengelolaan anggaran wisata **TripBuddy**.
Aplikasi ini membutuhkan REST API dari repository back-end: `<URL-REPOSITORY-BACKEND>`.

| | |
| --- | --- |
| Framework | Nuxt 4 (mode SPA, `ssr: false`), TypeScript |
| State | Pinia |
| UI | Tailwind CSS v4, lucide-vue-next, SweetAlert2 |
| Pengujian | Vitest + @vue/test-utils + jsdom, coverage 100% |
| Package manager | bun |

## Menjalankan di komputer lokal

Jalankan **back-end terlebih dahulu** (lihat README repository back-end, port 4000), lalu:

```bash
git clone <URL-REPOSITORY-FRONTEND>
cd <nama-folder-repository>
bun install
cp .env.example .env        # Windows: copy .env.example .env
bun run dev                 # http://localhost:3000
```

Variabel `VITE_API_BASEURL` di `.env` menunjuk ke API (default `http://localhost:4000/api`).

## Pengujian

```bash
bun run test:coverage
bun run build               # build produksi
```

Panduan lengkap (struktur, rute, gambar, deployment, naskah video): [PANDUAN.md](./PANDUAN.md).
