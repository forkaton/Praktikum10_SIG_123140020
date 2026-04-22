import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import api from '../config/api';

// Memperbaiki bug default icon Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function MapClickHandler({ onMapClick }) {
    useMapEvents({
        click(e) {
            onMapClick(e.latlng);
        }
    });
    return null;
}

function MapView() {
    const [geojsonData, setGeojsonData] = useState(null);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const [activeAction, setActiveAction] = useState(null);
    const [selectedFeature, setSelectedFeature] = useState(null);
    const [newLocation, setNewLocation] = useState(null);
    const [formData, setFormData] = useState({ nama: '' });

    useEffect(() => {
        const fetchGeoJSON = async () => {
            try {
                const response = await api.get('/geojson/fasilitas');
                setGeojsonData(null); 
                setTimeout(() => setGeojsonData(response.data), 50);
            } catch (error) {
                console.error("Gagal mengambil data:", error);
            }
        };
        fetchGeoJSON();
    }, [refreshTrigger]);

    const refreshMap = () => setRefreshTrigger(prev => prev + 1);

    const getStyle = (feature) => {
        const nama = feature.properties.nama.toLowerCase();
        let pointColor = '#666666'; 

        if (nama.includes('rs') || nama.includes('rumah sakit') || nama.includes('klinik')) {
            pointColor = '#FF0000';
        } else if (nama.includes('masjid') || nama.includes('musholla')) {
            pointColor = '#00FF00';
        } else if (nama.includes('sekolah') || nama.includes('sman')) {
            pointColor = '#0000FF';
        }
        return { radius: 8, fillColor: pointColor, color: '#ffffff', weight: 2, opacity: 1, fillOpacity: 0.9 };
    };

    const onEachFeature = (feature, layer) => {
        layer.on({
            mouseover: (e) => { e.target.setStyle({ weight: 4, color: '#a855f7', fillOpacity: 1 }); },
            mouseout: (e) => { e.target.setStyle(getStyle(feature)); },
            click: (e) => {
                L.DomEvent.stopPropagation(e); // Mencegah bentrok dengan klik peta
                const map = e.target._map; 
                map.flyTo(e.latlng, 17, { duration: 1.5 });
                
                setSelectedFeature({
                    id: feature.properties.id,
                    nama: feature.properties.nama,
                    latitude: e.latlng.lat,
                    longitude: e.latlng.lng
                });
                setFormData({ nama: feature.properties.nama });
                setActiveAction('info');
            }
        });
    };

    const handleAddSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/fasilitas', {
                nama: formData.nama,
                longitude: newLocation.lng,
                latitude: newLocation.lat
            });
            setActiveAction(null);
            setFormData({ nama: '' });
            refreshMap();
        } catch (error) {
            alert("Gagal menambah data: " + (error.response?.data?.detail || error.message));
        }
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.put(`/fasilitas/${selectedFeature.id}`, {
                nama: formData.nama,
                longitude: selectedFeature.longitude,
                latitude: selectedFeature.latitude
            });
            setActiveAction('info');
            setSelectedFeature({...selectedFeature, nama: formData.nama});
            refreshMap();
        } catch (error) {
            alert("Gagal mengupdate data: " + (error.response?.data?.detail || error.message));
        }
    };

    const handleDelete = async () => {
        if (!window.confirm(`Yakin ingin menghapus ${selectedFeature.nama}?`)) return;
        try {
            await api.delete(`/fasilitas/${selectedFeature.id}`);
            setActiveAction(null);
            setSelectedFeature(null);
            refreshMap();
        } catch (error) {
            alert("Gagal menghapus data: " + (error.response?.data?.detail || error.message));
        }
    };

    return (
        <div className="relative w-full h-[calc(100vh-76px)] bg-slate-950">
            {/* PETA */}
            <MapContainer center={[-5.350, 105.310]} zoom={13} style={{ height: '100%', width: '100%', zIndex: 10 }}>
                {/* Menggunakan peta mode gelap (Dark Mode Map) agar sesuai tema */}
                <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                    attribution='&copy; <a href="https://carto.com/">CARTO</a>'
                />
                
                <MapClickHandler onMapClick={(latlng) => {
                    setNewLocation(latlng);
                    setFormData({ nama: '' });
                    setActiveAction('add');
                }} />

                {geojsonData && (
                    <GeoJSON data={geojsonData} pointToLayer={(f, ll) => L.circleMarker(ll, getStyle(f))} onEachFeature={onEachFeature} />
                )}
            </MapContainer>

            {/* PANEL UI OVERLAY (Neon Glassmorphism) */}
            {activeAction && (
                <div className="absolute top-6 right-6 z-1000 w-88 bg-slate-900/80 backdrop-blur-xl p-6 rounded-2xl shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] border border-white/10 text-slate-200 transform transition-all duration-300">
                    
                    {/* Header Panel */}
                    <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-3">
                        <div className="flex items-center gap-3">
                            {/* Ikon Dinamis berdasarkan Aksi */}
                            {activeAction === 'add' ? (
                                <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                            ) : activeAction === 'edit' ? (
                                <svg className="w-6 h-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                            ) : (
                                <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            )}
                            <h3 className="font-bold text-lg text-transparent bg-clip-text bg-linear-to-r from-indigo-300 to-purple-300">
                                {activeAction === 'add' ? 'Registrasi Spasial' : 
                                 activeAction === 'edit' ? 'Modifikasi Data' : 'Detail Entitas'}
                            </h3>
                        </div>
                        <button onClick={() => setActiveAction(null)} className="p-1 rounded-md text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                        </button>
                    </div>

                    {/* Form Tambah */}
                    {activeAction === 'add' && (
                        <form onSubmit={handleAddSubmit} className="space-y-4">
                            <div className="bg-slate-950/50 p-3 rounded-xl border border-slate-800">
                                <p className="text-xs text-slate-400 mb-1 font-mono">Koordinat Deteksi:</p>
                                <p className="text-sm text-indigo-300 font-mono">{newLocation.lat.toFixed(5)}, {newLocation.lng.toFixed(5)}</p>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-400 mb-1">Nomenklatur Fasilitas</label>
                                <input type="text" required value={formData.nama} onChange={(e) => setFormData({nama: e.target.value})}
                                    className="w-full bg-slate-800/50 border border-indigo-500/30 text-indigo-100 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-slate-500" 
                                    placeholder="Contoh: RSUD Provinsi" />
                            </div>
                            <button type="submit" className="w-full py-2.5 mt-2 text-white bg-linear-to-r from-indigo-600 to-purple-600 rounded-xl hover:from-indigo-500 hover:to-purple-500 shadow-[0_0_15px_rgba(99,102,241,0.4)] transition-all font-semibold tracking-wide flex justify-center items-center gap-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"></path></svg>
                                SIMPAN DATA SPASIAL
                            </button>
                        </form>
                    )}

                    {/* Mode Info (Read/Delete) */}
                    {activeAction === 'info' && selectedFeature && (
                        <div className="space-y-5">
                            <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800">
                                <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Identifikasi</p>
                                <p className="font-bold text-lg text-indigo-200">{selectedFeature.nama}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-slate-950/50 p-3 rounded-xl border border-slate-800">
                                    <p className="text-xs text-slate-500 uppercase">Latitude</p>
                                    <p className="text-sm text-cyan-300 font-mono mt-1">{selectedFeature.latitude.toFixed(5)}</p>
                                </div>
                                <div className="bg-slate-950/50 p-3 rounded-xl border border-slate-800">
                                    <p className="text-xs text-slate-500 uppercase">Longitude</p>
                                    <p className="text-sm text-cyan-300 font-mono mt-1">{selectedFeature.longitude.toFixed(5)}</p>
                                </div>
                            </div>
                            <div className="flex gap-3 pt-3 border-t border-white/5">
                                <button onClick={() => setActiveAction('edit')} className="flex-1 py-2.5 flex justify-center items-center gap-2 bg-linear-to-r from-amber-600 to-orange-600 text-white rounded-xl shadow-[0_0_15px_rgba(217,119,6,0.4)] hover:from-amber-500 hover:to-orange-500 transition-all font-semibold text-sm">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                                    UBAH
                                </button>
                                <button onClick={handleDelete} className="flex-1 py-2.5 flex justify-center items-center gap-2 bg-linear-to-r from-red-600 to-rose-600 text-white rounded-xl shadow-[0_0_15px_rgba(220,38,38,0.4)] hover:from-red-500 hover:to-rose-500 transition-all font-semibold text-sm">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                    HAPUS
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Form Edit */}
                    {activeAction === 'edit' && selectedFeature && (
                        <form onSubmit={handleEditSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-amber-400 mb-1">Perbarui Nomenklatur</label>
                                <input type="text" required value={formData.nama} onChange={(e) => setFormData({nama: e.target.value})}
                                    className="w-full bg-slate-800/50 border border-amber-500/50 text-amber-100 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all" />
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button type="submit" className="flex-1 py-2.5 flex justify-center items-center gap-2 bg-linear-to-r from-emerald-600 to-teal-600 text-white rounded-xl shadow-[0_0_15px_rgba(5,150,105,0.4)] hover:from-emerald-500 hover:to-teal-500 transition-all font-semibold text-sm">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                    SIMPAN
                                </button>
                                <button type="button" onClick={() => setActiveAction('info')} className="flex-1 py-2.5 flex justify-center items-center gap-2 bg-slate-700 text-slate-200 rounded-xl border border-slate-600 hover:bg-slate-600 transition-all font-semibold text-sm">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                                    BATAL
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            )}
        </div>
    );
}

export default MapView;