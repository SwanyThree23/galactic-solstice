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
    setUser: (user: User | null) => void;
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
    setUser: () => { },
    loading: false,
    error: null,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(() => {
        try {
            const stored = localStorage.getItem('seewhy_user');
            return stored ? JSON.parse(stored) : null;
        } catch { return null; }
    });
    const [token, setToken] = useState<string | null>(localStorage.getItem('seewhy_token'));
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Rehydrate user from token on mount and fetch latest profile
    useEffect(() => {
        const fetchMe = async () => {
            if (token) {
                try {
                    const res = await userApi.getMe();
                    setUser(res.data);
                    localStorage.setItem('seewhy_user', JSON.stringify(res.data));
                } catch (err) {
                    console.error('Failed to rehydrate session', err);
                    // If 401/403, the api interceptor will handle redirect
                }
            }
        };
        fetchMe();
    }, [token]);

    const login = async (email: string, password: string) => {
        setLoading(true);
        setError(null);
        try {
            const res = await userApi.login(email, password);
            const { token: newToken, user: userData } = res.data;
            setToken(newToken);
            setUser(userData);
            localStorage.setItem('seewhy_token', newToken);
            localStorage.setItem('seewhy_user', JSON.stringify(userData));
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
        localStorage.removeItem('seewhy_token');
        localStorage.removeItem('seewhy_user');
    };

    return (
        <AuthContext.Provider value={{
            user,
            token,
            isAuthenticated: !!token,
            login,
            register,
            logout,
            setUser,
            loading,
            error
        }}>
            {children}
        </AuthContext.Provider>
    );
};
