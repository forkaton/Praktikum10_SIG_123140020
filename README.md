# **WebGIS Full-Stack: Integrasi AI Spasial (YOLOv8) & WebGIS - Praktikum 10 SIG**

Repositori ini berisi implementasi aplikasi **WebGIS berbasis full-stack** yang mengintegrasikan *Computer Vision* (AI) dengan pemetaan digital. Proyek ini dibangun sebagai pemenuhan **Tugas Praktikum 10** mata kuliah **Sistem Informasi Geografis (SIG)** Institut Teknologi Sumatera, mencakup proses ekstraksi citra satelit, pendeteksian objek menggunakan **YOLOv8**, transformasi koordinat spasial, dan visualisasi dinamis pada **React.js** bersanding dengan data PostgreSQL.

---

## **Oleh**
**Anselmus Herpin Hasugian**
**NIM: 123140020**

---

# **Pemenuhan Kriteria Tugas Praktikum 10**

Proyek ini telah memenuhi seluruh kriteria evaluasi yang ditetapkan dalam modul **Hands-on Praktikum 10**:

- [x] **Ekstraksi Citra Satelit (GeoTIFF)**
  Penggunaan QGIS untuk mengambil citra satelit area Kampus ITERA/Way Huwi dengan resolusi tinggi yang memiliki metadata spasial (*georeferenced*).

- [x] **Pemrosesan Tiling & Deteksi Objek AI**
  Penerapan teknik pemotongan gambar (*tiling*) berukuran 640x640 menggunakan Rasterio, dilanjutkan dengan deteksi kendaraan/orang menggunakan model Pre-trained YOLOv8 dari Ultralytics.

- [x] **Transformasi Koordinat Spasial**
  Konversi sistem koordinat piksel gambar ke sistem referensi koordinat bumi, serta transformasi CRS dari EPSG:3857 (*Pseudo-Mercator*) menjadi EPSG:4326 (*WGS 84*) menggunakan PyProj.

- [x] **Pembuatan Data GeoJSON Otomatis**
  Ekspor hasil deteksi (titik tengah *bounding box*) beserta metadata objek (*class* dan *confidence*) secara terprogram ke dalam format `.geojson` standar.

- [x] **Visualisasi Multi-Layer Interaktif**
  Menampilkan ratusan *marker* hasil deteksi AI di atas peta Leaflet (*Dark Mode*), berdampingan secara mulus dengan titik fasilitas umum yang ditarik langsung dari database PostgreSQL.

---

# **Teknologi yang Digunakan**

## **AI & Pemrosesan Spasial (Python)**

- **Model AI:** YOLOv8 (Ultralytics)
- **Spatial Data Processing:** Rasterio, PyProj
- **Image Processing:** OpenCV, NumPy
- **GIS Software:** QGIS (Pengambilan data XYZ Tiles Google Satellite)

## **Backend (Python)**

- **Framework:** FastAPI
- **Database Driver:** Asyncpg
- **Database:** PostgreSQL dengan ekstensi PostGIS

## **Frontend (JavaScript)**

- **Library Utama:** React.js (Vite)
- **Mapping:** Leaflet.js & React-Leaflet
- **Styling:** Tailwind CSS v4 (Custom Neon Glassmorphism)

---

# **Alur Kerja (*Pipeline*) AI Spasial**

1. `aerial_image.tif` (GeoTIFF) dibaca secara aman menggunakan **Rasterio**.
2. Citra dipotong menjadi grid kecil (640x640) menggunakan teknik *Tiling* ber-*overlap* untuk menghindari objek terpotong di pinggir.
3. Model **YOLOv8** mendeteksi kendaraan dan objek lalu lintas di setiap potongan gambar.
4. Titik tengah (*centroid*) setiap objek dikembalikan ke koordinat global gambar, lalu dikonversi menggunakan *Affine Transform* Rasterio (menghasilkan satuan Meter EPSG:3857).
5. **PyProj** menerjemahkan titik meter tersebut menjadi Derajat Geografis Lintang dan Bujur (EPSG:4326).
6. Titik spasial disimpan menjadi `hasil_deteksi_ai.geojson` di folder `public` frontend untuk kemudian dirender oleh **React Leaflet**.

---

# **Persiapan Menjalankan Program (Local Setup)**

Proyek ini dirancang untuk dapat dijalankan secara mandiri di *local environment* untuk mendemonstrasikan proses deteksi AI tanpa memerlukan kontainerisasi Docker.

---

## **1. Kloning Repositori**

```bash
git clone https://github.com/forkaton/Praktikum10_SIG_123140020.git
cd Praktikum10_SIG_123140020
```

## **2. Menjalankan Pipeline AI Spasial**

Buka terminal dan masuk ke direktori backend. Aktifkan virtual environment Anda, lalu jalankan skrip deteksi:

```bash
cd praktikum7_api
# Pastikan (.venv) aktif
pip install -r requirements.txt
python spatial_ai.py
```

> Tunggu hingga proses tiling dan deteksi selesai. Script akan menghasilkan file GeoJSON dengan ratusan data objek.

## **3. Menjalankan Server Backend (FastAPI)**

Masih di direktori `praktikum7_api`, jalankan server untuk melayani data fasilitas dari database:

```bash
uvicorn main:app --reload
```

## **4. Menjalankan Frontend (React.js)**

Buka tab terminal baru, masuk ke direktori frontend, dan jalankan server pengembangan:

```bash
cd frontend_sig_123140020
npm install
npm run dev
```

Akses WebGIS di: **http://localhost:5173**

---

# **Dokumentasi Hasil Implementasi**

## **1. Proses Deteksi YOLOv8 di Terminal**
![alt text](<Screenshot 2026-05-06 130455-1.png>)
![alt text](<Screenshot 2026-05-06 130520.png>)

## **2. Visualisasi WebGIS Multi-Layer (AI + Database)**
![alt text](<Screenshot 2026-05-06 134407.png>)
![alt text](<Screenshot 2026-05-06 134359.png>)
![alt text](<Screenshot 2026-05-06 134619.png>)
![alt text](<Screenshot 2026-05-06 134718.png>)

## **3. Interaksi Pop-up Hasil Deteksi AI**
![alt text](<Screenshot 2026-05-06 134438.png>)
![alt text](<Screenshot 2026-05-06 134458.png>)

---

# **Struktur Proyek**
Praktikum10_SIG_123140020/
│
├── praktikum7_api/                       # Direktori Backend & AI Spasial
│   ├── app/
│   ├── spatial_ai.py                     # Script utama pipeline YOLOv8
│   ├── aerial_image.tif                  # Citra GeoTIFF (Excluded in .gitignore)
│   ├── main.py
│   └── requirements.txt
│
├── frontend_sig_123140020/               # Direktori Frontend React
│   ├── public/
│   │   └── hasil_deteksi_ai.geojson      # File output dari spatial_ai.py
│   ├── src/
│   ├── package.json
│   └── vite.config.js
│
└── README.md

---

**Anselmus Herpin Hasugian**
Teknik Informatika — Institut Teknologi Sumatera (ITERA)

*Project ini dibuat untuk keperluan akademik pada mata kuliah Sistem Informasi Geografis (SIG).*

*123140020 · Anselmus Herpin Hasugian © 2026*