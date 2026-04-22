import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Login from './components/login';
import Register from './components/Register';
import MapView from './components/MapView';
import './App.css';

// Komponen pelindung: Jika belum login, tendang ke /login
const ProtectedRoute = ({ children }) => {
    const { user } = useAuth();
    if (!user) {
        return <Navigate to="/login" replace />;
    }
    return children;
};

function App() {
    // BARIS INI YANG SEBELUMNYA HILANG:
    const { user, logout } = useAuth();

    return (
        <div className="flex flex-col h-screen">
            {/* Header Glassmorphism dengan Tailwind v4 Class */}
            <header className="relative z-50 flex justify-between items-center px-6 py-4 bg-slate-950/80 backdrop-blur-md border-b border-white/10 shadow-lg">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-linear-to-br from-indigo-500 to-purple-600 rounded-lg shadow-[0_0_10px_rgba(99,102,241,0.5)]">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"></path>
                        </svg>
                    </div>
                    <h1 className="text-2xl font-black text-transparent bg-clip-text bg-linear-to-r from-indigo-200 to-purple-200 tracking-wider">
                        GEO<span className="text-indigo-500">SPATIAL</span>
                    </h1>
                </div>
                
                {user && (
                    <button onClick={logout} className="flex items-center gap-2 px-5 py-2.5 bg-white/5 border border-white/10 rounded-xl hover:bg-red-500/20 hover:border-red-500/50 hover:text-red-400 text-slate-300 transition-all shadow-sm">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                        <span className="font-semibold text-sm">Akhiri Sesi</span>
                    </button>
                )}
            </header>

            <main className="flex-1 overflow-hidden relative">
                <Routes>
                    <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
                    <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />
                    <Route 
                        path="/" 
                        element={
                            <ProtectedRoute>
                                <MapView />
                            </ProtectedRoute>
                        } 
                    />
                </Routes>
            </main>
        </div>
    );
}

export default App;