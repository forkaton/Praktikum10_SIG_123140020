# WebGIS Fasilitas Publik (Frontend) - Praktikum 8 SIG

Repositori ini berisi implementasi antarmuka (*frontend*) WebGIS interaktif menggunakan **ReactJS** dan **Leaflet**. Proyek ini merupakan pemenuhan Tugas Praktikum 8 Sistem Informasi Geografis, yang terintegrasi dengan REST API FastAPI dari Praktikum 7.

**Oleh:** Anselmus Herpin Hasugian (123140020)

##  Fitur Utama
- Fetch data GeoJSON secara asinkronus (Axios).
- Visualisasi peta dasar (OpenStreetMap).
- Styling dinamis berdasarkan kategori/jenis fasilitas.
- Interaksi: Popup informasi detail dan *hover highlight*.
- Interaksi: Animasi navigasi (*zoom to feature/flyTo*) saat marker diklik.

##  Teknologi yang Digunakan
- ReactJS (Vite)
- Leaflet & React-Leaflet
- Axios

##  Cara Menjalankan (Local Setup)
1. Pastikan server backend FastAPI (Praktikum 7) Anda sudah menyala di `http://127.0.0.1:8000`.
2. Clone repositori ini.
3. Install dependensi: `npm install`
4. Jalankan server: `npm run dev`
5. Buka `http://localhost:5173` di browser.

## Dokumentasi
![alt text](<Screenshot 2026-04-17 204615.png>)
![alt text](<Screenshot 2026-04-17 200512.png>)
![alt text](<Screenshot 2026-04-17 202621.png>)
