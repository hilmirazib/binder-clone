# Binder Web

Versi web dari aplikasi Binder: ruang obrolan (chat) dan catatan (notes) berbasis grup.
Dibangun dengan fokus pada kesederhanaan, realtime, dan pengalaman pengguna.

## Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router, TypeScript)
- **UI**: [Tailwind CSS](https://tailwindcss.com/)
- **Database**: PostgreSQL (hosted via [Supabase](https://supabase.com/))
- **ORM**: [Prisma](https://www.prisma.io/)
- **Auth**: Supabase Auth (OTP / magic link)
- **Realtime**: Supabase Realtime (changes + broadcast/presence)
- **Hosting**: Vercel (frontend) + Supabase (DB/Auth/Realtime)

## Cara Menjalankan (Development)

```bash
# clone repo
git clone https://github.com/<user>/<repo>.git
cd <repo>

# install dependencies
pnpm install

# salin env contoh
cp .env.example .env
# isi dengan key dari Supabase (URL, anon key, db url)

# generate prisma client (jika schema sudah ada)
pnpm prisma generate

# jalankan dev server
pnpm dev
```

Buka [http://localhost:3000](http://localhost:3000).

## Status Progres

- ✅ Persiapan awal (stack & repo)
- 🔄 Setup project (Next.js + Tailwind + tooling)
- ⏳ Integrasi Supabase (DB, Auth, Realtime)
- ⏳ Fitur utama: grup, chat, notes

## TODO (Docker)

- Dockerfile untuk Next.js (builder + runner)
- docker-compose dengan service web + (nantinya) postgres lokal (opsional)
- dukung `.env` build-time untuk Supabase (production)

---
