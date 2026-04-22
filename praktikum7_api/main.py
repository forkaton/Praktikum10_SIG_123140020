from fastapi import FastAPI, HTTPException, Query, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
import json
from contextlib import asynccontextmanager
import asyncpg

# Import dari file lokal
from database import create_pool
from models import FasilitasCreate, FasilitasUpdate, UserCreate, Token
from auth import get_password_hash, verify_password, create_access_token, get_current_user

# Inisialisasi pool koneksi dengan Type Hinting untuk Pylance
pool: asyncpg.Pool | None = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    global pool
    pool = await create_pool()
    yield
    if pool:
        await pool.close()

app = FastAPI(
    title="WebGIS Full-Stack API - Anselmus Herpin Hasugian (123140020)",
    description="API Terproteksi JWT untuk Praktikum 9 SIG",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- ENDPOINT AUTENTIKASI ---

@app.post("/api/auth/register", tags=["Auth"])
async def register(user: UserCreate):
    if pool is None:
        raise HTTPException(status_code=500, detail="Database belum siap")
    
    async with pool.acquire() as conn: # <-- Pastikan ejaannya 'acquire'
        existing_user = await conn.fetchrow("SELECT id FROM users WHERE username = $1", user.username)
        if existing_user:
            raise HTTPException(status_code=400, detail="Username sudah terdaftar")
        
        hashed_pw = get_password_hash(user.password)
        await conn.execute(
            "INSERT INTO users (username, hashed_password) VALUES ($1, $2)",
            user.username, hashed_pw
        )
        return {"message": "Registrasi berhasil, silakan login"}

@app.post("/api/auth/login", response_model=Token, tags=["Auth"])
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    if pool is None:
        raise HTTPException(status_code=500, detail="Database belum siap")
        
    async with pool.acquire() as conn:
        user = await conn.fetchrow("SELECT username, hashed_password FROM users WHERE username = $1", form_data.username)
        
        if not user or not verify_password(form_data.password, user['hashed_password']):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Username atau password salah",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        access_token = create_access_token(data={"sub": user['username']})
        return {"access_token": access_token, "token_type": "bearer"}

# --- ENDPOINT CRUD FASILITAS (SPASIAL) ---

@app.get("/api/geojson/fasilitas", tags=["Fasilitas"])
async def get_fasilitas_geojson():
    if pool is None:
        raise HTTPException(status_code=500, detail="Database belum siap")
        
    async with pool.acquire() as conn:
        query = """
        SELECT jsonb_build_object(
            'type', 'FeatureCollection',
            'features', jsonb_agg(ST_AsGeoJSON(t.*)::json)
        )
        FROM (SELECT id, nama, geom FROM fasilitas_publik) as t;
        """
        record = await conn.fetchval(query)
        return json.loads(record) if record else {"type": "FeatureCollection", "features": []}

@app.post("/api/fasilitas", tags=["Fasilitas"])
async def create_fasilitas(data: FasilitasCreate, current_user: str = Depends(get_current_user)):
    if pool is None:
        raise HTTPException(status_code=500, detail="Database belum siap")
        
    async with pool.acquire() as conn:
        query = """
        INSERT INTO fasilitas_publik (nama, geom)
        VALUES ($1, ST_SetSRID(ST_Point($2, $3), 4326))
        RETURNING id
        """
        new_id = await conn.fetchval(query, data.nama, data.longitude, data.latitude)
        return {"status": "success", "id": new_id, "created_by": current_user}

@app.put("/api/fasilitas/{id}", tags=["Fasilitas"])
async def update_fasilitas(id: int, data: FasilitasUpdate, current_user: str = Depends(get_current_user)):
    if pool is None:
        raise HTTPException(status_code=500, detail="Database belum siap")
        
    async with pool.acquire() as conn:
        query = """
        UPDATE fasilitas_publik 
        SET nama = $1, geom = ST_SetSRID(ST_Point($2, $3), 4326)
        WHERE id = $4
        """
        result = await conn.execute(query, data.nama, data.longitude, data.latitude, id)
        if result == "UPDATE 0":
            raise HTTPException(status_code=404, detail="Data tidak ditemukan")
        return {"message": f"Data ID {id} berhasil diupdate oleh {current_user}"}

@app.delete("/api/fasilitas/{id}", tags=["Fasilitas"])
async def delete_fasilitas(id: int, current_user: str = Depends(get_current_user)):
    if pool is None:
        raise HTTPException(status_code=500, detail="Database belum siap")
        
    async with pool.acquire() as conn:
        result = await conn.execute("DELETE FROM fasilitas_publik WHERE id = $1", id)
        if result == "DELETE 0":
            raise HTTPException(status_code=404, detail="Data tidak ditemukan")
        return {"message": f"Data ID {id} berhasil dihapus oleh {current_user}"}