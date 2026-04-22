import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../config/api';

function Register() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState({ type: '', text: '' });
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Register menggunakan JSON body
            await api.post('/auth/register', { username, password });
            setMessage({ type: 'success', text: 'Registrasi berhasil! Mengalihkan ke login...' });
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.detail || 'Gagal mendaftar.' });
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="p-8 bg-white rounded-lg shadow-md w-96">
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Daftar Akun Baru</h2>
                {message.text && (
                    <p className={`mb-4 text-sm p-2 rounded ${message.type === 'success' ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100'}`}>
                        {message.text}
                    </p>
                )}
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Username Baru</label>
                        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-green-200" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Password Baru</label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-green-200" />
                    </div>
                    <button type="submit" className="w-full py-2 text-white bg-green-600 rounded hover:bg-green-700 font-semibold">
                        Buat Akun
                    </button>
                </form>
                <p className="mt-4 text-sm text-center text-gray-600">
                    Sudah punya akun? <Link to="/login" className="text-blue-600 hover:underline">Login di sini</Link>
                </p>
            </div>
        </div>
    );
}

export default Register;