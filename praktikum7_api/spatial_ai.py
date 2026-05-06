import cv2
import rasterio
import numpy as np
from ultralytics import YOLO
import json
import os
from pyproj import Transformer

# 1. Load Model YOLOv8 
print("Memuat model YOLOv8...")
model = YOLO('yolov8n.pt') 

# Alat untuk mengubah koordinat Meter (3857) ke Derajat (4326)
transformer = Transformer.from_crs("epsg:3857", "epsg:4326", always_xy=True)

def run_spatial_pipeline(image_path, output_geojson_path, tile_size=640, overlap=128):
    if not os.path.exists(image_path):
        print(f"ERROR: File {image_path} tidak ditemukan! Pastikan file gambar ada di folder yang sama.")
        return

    # 2. Buka citra dengan Rasterio untuk mengekstrak transformasi geografisnya
    print(f"Membaca citra satelit QGIS: {image_path}")
    with rasterio.open(image_path) as src:
        # Transformasi affine untuk konversi pixel ke lat/lon
        transform = src.transform
        
        # BACA PIKSEL GAMBAR MENGGUNAKAN RASTERIO (Lebih aman untuk GeoTIFF)
        img_array = src.read()
        
        # Ubah urutan dimensi dari (Channels, Height, Width) menjadi (Height, Width, Channels)
        img = np.transpose(img_array, (1, 2, 0))
        
        # Konversi warna ke format BGR yang diminta YOLO
        if img.shape[2] == 4:     # Jika QGIS mengekspor dengan Alpha Channel (RGBA)
            img = cv2.cvtColor(img, cv2.COLOR_RGBA2BGR)
        elif img.shape[2] == 3:   # Jika format RGB biasa
            img = cv2.cvtColor(img, cv2.COLOR_RGB2BGR)

        h, w = img.shape[:2]
        step = tile_size - overlap 
        
        geo_detections = []
        total_tiles = ((h // step) + 1) * ((w // step) + 1)
        processed_tiles = 0

        print(f"Gambar berhasil dimuat! Ukuran: {w}x{h} piksel.")
        print(f"Mulai memotong menjadi sekitar {total_tiles} tile dan mendeteksi objek...")

        # 3. Proses Tiling (Pemotongan) dan Deteksi
        for y in range(0, h, step):
            for x in range(0, w, step):
                processed_tiles += 1
                
                # Tampilkan progress ke terminal
                if processed_tiles % 20 == 0 or processed_tiles == total_tiles:
                    print(f"Memproses tile {processed_tiles} dari {total_tiles}...")

                # Potong gambar
                tile = img[y:y+tile_size, x:x+tile_size]
                
                # Lewati jika potongan terlalu kecil di ujung gambar
                if tile.shape[0] < 100 or tile.shape[1] < 100:
                    continue

                # Jalankan YOLOv8 dengan sensitivitas 5% (conf=0.05) untuk gambar satelit
                results = model(tile, verbose=False, conf=0.05)

                # Ekstrak hasil deteksi
                for box in results[0].boxes:
                    cls_id = int(box.cls[0]) 
                    
                    # Filter: Hanya ambil deteksi kendaraan/orang (ID 0, 2, 3, 5, 7 di COCO)
                    if cls_id not in [0, 2, 3, 5, 7]:
                        continue
                        
                    x1, y1, x2, y2 = box.xyxy[0].tolist() 
                    conf = float(box.conf[0]) 

                    # Kembalikan koordinat kotak ke posisi gambar asli (global)
                    global_x1, global_y1 = x1 + x, y1 + y
                    global_x2, global_y2 = x2 + x, y2 + y
                    
                    # Cari titik tengah objek
                    cx = (global_x1 + global_x2) / 2
                    cy = (global_y1 + global_y2) / 2

                    # 4. Konversi Pixel ke Koordinat (hasilnya Meter)
                    lon_meter, lat_meter = transform * (cx, cy)
                    
                    # Terjemahkan Meter ke Derajat (Longitude, Latitude)
                    lon, lat = transformer.transform(lon_meter, lat_meter)

                    # Simpan data dalam format GeoJSON Feature
                    geo_detections.append({
                        'type': 'Feature',
                        'geometry': {
                            'type': 'Point',
                            'coordinates': [lon, lat]
                        },
                        'properties': {
                            'class_id': cls_id,
                            'class_name': model.names[cls_id], 
                            'confidence': round(conf, 3)
                        }
                    })

        # 5. Export hasil akhir ke file GeoJSON
        geojson = {
            'type': 'FeatureCollection',
            'features': geo_detections
        }
        
        with open(output_geojson_path, 'w') as f:
            json.dump(geojson, f, indent=2)

        print(f"✅ Pipeline Selesai! {len(geo_detections)} objek terdeteksi.")
        print(f"✅ Hasil diekspor ke: {output_geojson_path}")

# --- Eksekusi Pipeline ---
run_spatial_pipeline('aerial_image.tif', 'hasil_deteksi_ai.geojson')