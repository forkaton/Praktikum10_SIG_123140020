# Menggunakan Python versi ringan
FROM python:3.10-slim

# Menentukan folder kerja di dalam kontainer
WORKDIR /app

# Menyalin file daftar pustaka
COPY requirements.txt .

# Menginstal pustaka tanpa menyimpan cache agar ringan
RUN pip install --no-cache-dir -r requirements.txt

# Menyalin seluruh kode API Anda
COPY . .

# Membuka gerbang port 8000
EXPOSE 8000

# Perintah menjalankan server FastAPI
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]