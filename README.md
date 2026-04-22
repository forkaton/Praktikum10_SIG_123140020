# **WebGIS Full-Stack: Auth & CRUD Management - Praktikum 9 SIG**

Repositori ini berisi implementasi lengkap aplikasi **WebGIS berbasis full-stack** yang mengintegrasikan sistem autentikasi keamanan dan manajemen data spasial fasilitas publik secara dinamis. Proyek ini dibangun sebagai pemenuhan **Tugas Praktikum 9** mata kuliah **Sistem Informasi Geografis (SIG)** Institut Teknologi Sumatera, mencakup pengembangan **FastAPI (Backend)**, **React.js (Frontend)**, dan orkestrasi kontainer menggunakan **Docker**.

---

## **Oleh**
**Anselmus Herpin Hasugian**  
**NIM: 123140020**

---

# **Pemenuhan Kriteria Tugas Praktikum 9**

Proyek ini telah memenuhi seluruh kriteria evaluasi yang ditetapkan dalam modul **Hands-on Praktikum 9**:

- [x] **Arsitektur Full-Stack & Monorepo**  
      Pemisahan service backend dan frontend dalam satu repositori yang terorganisir.

- [x] **Sistem Autentikasi JWT**  
      Implementasi alur registrasi dan login menggunakan JSON Web Token (JWT) dan enkripsi kata sandi Bcrypt.

- [x] **Operasi CRUD Lengkap**  
      Fasilitas pengelolaan data (Tambah, Lihat, Ubah, Hapus) yang terintegrasi langsung dengan basis data spasial.

- [x] **Frontend dengan Protected Routes**  
      Implementasi AuthContext dan Private Routes pada React untuk memastikan peta hanya dapat diakses oleh pengguna terautentikasi.

- [x] **Interaktivitas Peta**  
      Visualisasi data GeoJSON pada peta Leaflet dengan fitur fly-to animasi dan panel kontrol berbasis Neon Glassmorphism.

- [x] **Kontainerisasi Docker**  
      Penggunaan Docker Compose untuk manajemen deployment yang konsisten di berbagai lingkungan kerja.

---

# **Teknologi yang Digunakan**

## **Backend (Python)**

- **Framework:** FastAPI
- **Security:** Python-Jose (JWT), Passlib (Bcrypt)
- **Database Driver:** Asyncpg & Python-Dotenv
- **Database:** PostgreSQL dengan ekstensi PostGIS

---

## **Frontend (JavaScript)**

- **Library Utama:** React.js (Vite)
- **Styling:** Tailwind CSS v4 (Custom Neon Glassmorphism)
- **Mapping:** Leaflet.js & React-Leaflet
- **Komunikasi Data:** Axios dengan interceptors

---

## **Infrastruktur**

- **Containerization:** Docker & Docker Compose

---

# **Daftar Endpoint API**

| Method | Endpoint | Deskripsi | Otorisasi |
|--------|-----------|------------|------------|
| `POST` | `/api/register` | Mendaftarkan pengguna baru ke sistem | Public |
| `POST` | `/api/login` | Autentikasi pengguna dan mendapatkan token JWT | Public |
| `GET` | `/api/fasilitas` | Mengambil seluruh data spasial fasilitas publik | Bearer Token |
| `POST` | `/api/fasilitas` | Menambahkan titik fasilitas baru ke database | Bearer Token |
| `PUT` | `/api/fasilitas/{id}` | Memperbarui informasi fasilitas berdasarkan ID | Bearer Token |
| `DELETE` | `/api/fasilitas/{id}` | Menghapus data fasilitas dari sistem | Bearer Token |

---

# **Persiapan Menjalankan Program (Docker Setup)**

Sangat disarankan menjalankan proyek ini menggunakan **Docker** untuk menghindari konflik dependensi versi Node.js atau Python di mesin lokal.

---

## **1. Kloning Repositori**

```bash
git clone https://github.com/forkaton/Praktikum9_SIG_123140020.git
cd Praktikum9_123140020
```

---

## **2. Konfigurasi Variabel Lingkungan**

Pastikan file `.env` di dalam direktori backend sudah terkonfigurasi untuk akses database lokal melalui host gateway Docker:

```env
DB_HOST=host.docker.internal
DB_PORT=5432
SECRET_KEY=masukkan_secret_key_anda
ALGORITHM=HS256
```

---

## **3. Build dan Menjalankan Kontainer**

Jalankan perintah berikut untuk mengotomatisasi instalasi dependensi dan menjalankan server:

```bash
docker-compose up -d --build
```

---

## **4. Akses Aplikasi**

- **Web Interface:**  
  http://localhost:5173

- **API Documentation:**  
  http://localhost:8000/docs

---

# **Dokumentasi Hasil Implementasi**

Bagian ini berisi bukti fungsionalitas sistem WebGIS yang telah dikembangkan.

---

## **1. Antarmuka Autentikasi (Login & Register)**

![Login Page](<capture/Screenshot 2026-04-22 221404.png>)
![Login Page 2](<capture/Screenshot 2026-04-22 221414.png>)
---

## **2. Tampilan Utama WebGIS (GeoJSON Layer)**
![alt text](<capture/Screenshot 2026-04-22 221440.png>)

---

## **3. Manajemen Data (Fitur CRUD)**
![alt text](<capture/Screenshot 2026-04-22 221451.png>)
![alt text](<capture/Screenshot 2026-04-22 221459.png>)
![alt text](<capture/Screenshot 2026-04-22 221522.png>)
![alt text](<capture/Screenshot 2026-04-22 221539.png>)
![alt text](<capture/Screenshot 2026-04-22 221552.png>)
![alt text](<capture/Screenshot 2026-04-22 221605.png>)
---

## **4. Status Kontainer Docker**
![alt text](<capture/Screenshot 2026-04-22 220341.png>)
![alt text](<capture/Screenshot 2026-04-22 222142.png>)
---

---

# **Struktur Proyek**

```bash
Praktikum9_123140020/
│
├── backend/
│   ├── app/
│   ├── requirements.txt
│   ├── Dockerfile
│   └── .env
│
├── frontend/
│   ├── src/
│   ├── package.json
│   ├── vite.config.js
│   └── Dockerfile
│
├── docker-compose.yml
└── README.md
```

---

# **Fitur Utama Aplikasi**

- 🛡️ Secure Authentication menggunakan JWT & Bcrypt
- 🌍 Interactive WebGIS berbasis Leaflet & GeoJSON
- 📌 Manajemen data fasilitas publik secara dinamis
- 📝 Update dan edit data secara real-time
- 🗑️ Penghapusan data terintegrasi dengan database
- 🔒 Protected Routes untuk keamanan akses pengguna
- ⚙️ Deployment terkontainerisasi dengan Docker Compose
- ✨ Modern UI dengan konsep Neon Glassmorphism

---


**Anselmus Herpin Hasugian**  
Teknik Informatika - Institut Teknologi Sumatera (ITERA)

Project ini dibuat untuk keperluan akademik pada mata kuliah **Sistem Informasi Geografis (SIG)**.

---

## **123140020 Anselmus Herpin Hasugian © 2026**