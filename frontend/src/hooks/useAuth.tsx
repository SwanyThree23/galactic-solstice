import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

interface User {
    id: string;
    username: string;
    avatar?: string;
    isCreator?: boolean;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (username: string, email: string, password: string) => Promise<void>;
    logout: () => void;
    loading: boolean;
    error: string | null;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    token: null,
    isAuthenticated: false,
    login: async () => { },
    register: async () => { },
    logout: () => { },
    loading: false,
    error: null,
});

export const useAuth = () => useContext(AuthContext);

const API_BASE = '/api/users';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(localStorage.getItem('yliv_token'));
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
    }, [token]);

    const login = async (email: string, password: string) => {
        setLoading(true);
        setError(null);
        try {
            const res = await axios.post(`${API_BASE}/login`, { email, password });
            setToken(res.data.token);
            setUser(res.data.user);
            localStorage.setItem('yliv_token', res.data.token);
            axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
        } catch (err: any) {
            setError(err.response?.data?.error || 'Login failed');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const register = async (username: string, email: string, password: string) => {
        setLoading(true);
        setError(null);
        try {
            const res = await axios.post(`${API_BASE}/register`, { username, email, password });
            setUser(res.data);
        } catch (err: any) {
            setError(err.response?.data?.error || 'Registration failed');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('yliv_token');
        delete axios.defaults.headers.common['Authorization'];
    };

    return (
        <AuthContext.Provider value={{ user, token, isAuthenticated: !!token, login, register, logout, loading, error }}>
            {children}
        </AuthContext.Provider>
    );
};
