from pydantic import BaseModel

# Skema untuk Autentikasi User
class UserCreate(BaseModel):
    username: str
    password: str

class UserLogin(BaseModel):
    username: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

# Skema Fasilitas (Pastikan ini sesuai dengan tabel fasilitas_publik Anda)
class FasilitasBase(BaseModel):
    nama: str
    longitude: float
    latitude: float
    # Anda bisa menambahkan jenis/kategori di sini jika ada di tabel Anda

class FasilitasCreate(FasilitasBase):
    pass

class FasilitasUpdate(FasilitasBase):
    pass