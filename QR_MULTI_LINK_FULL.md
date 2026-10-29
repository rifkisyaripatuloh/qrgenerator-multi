# QRLink — Multi-Link QR Generator

Aplikasi static client-side untuk membuat satu QR code yang membawa 1–10 link. Tidak ada backend, database, login, atau admin panel.

## Menjalankan

Pastikan Node.js `v22.23.3` aktif:

```powershell
node -v
npm install
npm run dev
```

Build production:

```powershell
npm run build
npm run preview
```

Deploy folder `dist` ke Vercel, Netlify, Cloudflare Pages, atau GitHub Pages. Buat QR baru dari domain HTTPS production agar dapat dipindai perangkat lain. `localhost` menunjuk ke perangkat pemindai itu sendiri.

## Catatan keamanan dan privasi

Payload disimpan di query URL dan dikompresi menggunakan `lz-string`; kompresi bukan enkripsi. Jangan memasukkan token, kredensial, atau data rahasia. Link publik tetap dapat menuju situs berbahaya, sehingga pengguna perlu memeriksa alamat sebelum membuka.

Redirect otomatis WhatsApp/Instagram hanya heuristik user-agent dan bersifat best effort. Jika identitas scanner tidak diteruskan atau link ambigu, landing page akan ditampilkan.
