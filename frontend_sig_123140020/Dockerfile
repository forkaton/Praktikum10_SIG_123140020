# Menggunakan Node.js versi ringan
FROM node:22-alpine

WORKDIR /app

# Menyalin konfigurasi package
COPY package*.json ./

# Menginstal dependensi
RUN npm install

# Menyalin seluruh kode React Anda
COPY . .

# Mengubah kode menjadi file statis siap rilis (Production)
RUN npm run build

# Menginstal web server ringan ('serve')
RUN npm install -g serve

# Membuka gerbang port 5173
EXPOSE 5173

# Menjalankan aplikasi
CMD ["serve", "-s", "dist", "-l", "5173"]