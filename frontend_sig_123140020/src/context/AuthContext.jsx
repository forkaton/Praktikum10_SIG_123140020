import { createContext, useState, useEffect, useContext } from 'react';
import api from '../config/api';

// 1. Context HANYA dipakai di internal file ini, tidak di-export (Solusi Error 1)
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    // 2. Baca token sekali di awal
    const initialToken = localStorage.getItem('token') || null;
    
    // 3. Tentukan state langsung di sini, TANPA perlu menunggu useEffect (Solusi Error 2)
    const [token, setToken] = useState(initialToken);
    const [user, setUser] = useState(initialToken ? { isAuthenticated: true } : null);

    // 4. useEffect HANYA bertugas menyuntikkan token ke Axios, bukan mengubah state React
    useEffect(() => {
        if (token) {
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } else {
            delete api.defaults.headers.common['Authorization'];
        }
    }, [token]);

    const login = (newToken) => {
        localStorage.setItem('token', newToken);
        setToken(newToken);
        setUser({ isAuthenticated: true }); // State user diubah di sini saat aksi terjadi
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null); // State user dikosongkan di sini
    };

    return (
        <AuthContext.Provider value={{ token, user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
    return useContext(AuthContext);
};