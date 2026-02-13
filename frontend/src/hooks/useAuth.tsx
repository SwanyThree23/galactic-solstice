import React, { createContext, useContext, useState, useEffect } from 'react';
import { userApi } from '../services/api';

interface User {
    id: string;
    username: string;
    avatar?: string;
    isCreator?: boolean;
    email?: string;
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

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(() => {
        try {
            const stored = localStorage.getItem('yliv_user');
            return stored ? JSON.parse(stored) : null;
        } catch { return null; }
    });
    const [token, setToken] = useState<string | null>(localStorage.getItem('yliv_token'));
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Rehydrate user from token on mount
    useEffect(() => {
        if (token && !user) {
            // Try to decode the JWT payload to get basic user info
            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                if (payload.id) {
                    setUser({ id: payload.id, username: payload.username || 'User', isCreator: payload.isCreator });
                }
            } catch {
                // Token is malformed, clear it
                setToken(null);
                localStorage.removeItem('yliv_token');
            }
        }
    }, []);

    const login = async (email: string, password: string) => {
        setLoading(true);
        setError(null);
        try {
            const res = await userApi.login(email, password);
            const { token: newToken, user: userData } = res.data;
            setToken(newToken);
            setUser(userData);
            localStorage.setItem('yliv_token', newToken);
            localStorage.setItem('yliv_user', JSON.stringify(userData));
        } catch (err: any) {
            const message = err.response?.data?.error || err.response?.data?.message || 'Login failed';
            setError(message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const register = async (username: string, email: string, password: string) => {
        setLoading(true);
        setError(null);
        try {
            const res = await userApi.register(username, email, password);
            setUser(res.data);
        } catch (err: any) {
            const message = err.response?.data?.error || err.response?.data?.message || 'Registration failed';
            setError(message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('yliv_token');
        localStorage.removeItem('yliv_user');
    };

    return (
        <AuthContext.Provider value={{ user, token, isAuthenticated: !!token, login, register, logout, loading, error }}>
            {children}
        </AuthContext.Provider>
    );
};
