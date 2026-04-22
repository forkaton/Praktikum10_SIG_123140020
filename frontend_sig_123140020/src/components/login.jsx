import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../config/api';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new URLSearchParams();
            formData.append('username', username);
            formData.append('password', password);

            const response = await api.post('/auth/login', formData, {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            });
            
            login(response.data.access_token);
            navigate('/'); 
        } catch (err) {
            setError(err.response?.data?.detail || 'Autentikasi gagal. Periksa kredensial Anda.');
        }
    };

    return (
        <div className="relative flex items-center justify-center min-h-screen bg-slate-950 overflow-hidden">
            
            {/* Dekorasi dengan ukuran kanonikal v4 (w-160, h-160) */}
            <div className="absolute top-[-10%] left-[-10%] w-160 h-160 bg-indigo-600/30 rounded-full blur-[100px]"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-160 h-160 bg-purple-600/30 rounded-full blur-[100px]"></div>

            {/* Kartu Glassmorphism (w-104) */}
            <div className="relative z-10 p-10 bg-white/10 backdrop-blur-xl rounded-3xl shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] border border-white/20 w-104">
                
                <div className="flex justify-center mb-6">
                    <div className="p-4 bg-indigo-500/20 rounded-2xl border border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.5)]">
                        <svg className="w-10 h-10 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4"></path>
                        </svg>
                    </div>
                </div>

                {/* Teks dengan bg-linear-to-r v4 */}
                <h2 className="text-3xl font-extrabold mb-8 text-center text-transparent bg-clip-text bg-linear-to-r from-indigo-300 to-purple-300">
                    Sistem SIG
                </h2>

                {error && (
                    <div className="mb-6 p-3 bg-red-500/20 border border-red-500/50 rounded-xl flex items-center gap-3">
                        <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        <p className="text-sm text-red-200">{error}</p>
                    </div>
                )}
                
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-indigo-200 mb-1">Identitas Pengguna</label>
                        <div className="relative">
                            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required
                                className="w-full pl-4 pr-10 py-3 bg-slate-900/50 border border-indigo-500/30 text-indigo-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all placeholder-slate-500" 
                                placeholder="Masukkan username" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-indigo-200 mb-1">Kata Sandi</label>
                        <div className="relative">
                            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
                                className="w-full pl-4 pr-10 py-3 bg-slate-900/50 border border-indigo-500/30 text-indigo-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all placeholder-slate-500" 
                                placeholder="••••••••" />
                        </div>
                    </div>
                    <button type="submit" className="w-full py-3 mt-4 text-white bg-linear-to-r from-indigo-600 to-purple-600 rounded-xl hover:from-indigo-500 hover:to-purple-500 shadow-[0_0_20px_rgba(99,102,241,0.4)] transition-all font-bold tracking-wide">
                        OTORISASI MASUK
                    </button>
                </form>
                
                <p className="mt-6 text-sm text-center text-slate-400">
                    Belum terdaftar? <Link to="/register" className="text-indigo-400 hover:text-indigo-300 hover:underline transition-colors font-medium">Buat Kredensial Baru</Link>
                </p>
            </div>
        </div>
    );
}

export default Login;