import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Discovery from './pages/Discovery';
import Studio from './pages/Studio';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Register from './pages/Register';
import Watch from './pages/Watch';
import EmbedPage from './pages/EmbedPage';
import { SocketProvider } from './hooks/useSocket';
import { AuthProvider } from './hooks/useAuth';
import { ToastProvider } from './hooks/useToast';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

const App: React.FC = () => {
    return (
        <AuthProvider>
            <ToastProvider>
                <SocketProvider>
                    <Router>
                        <div className="bg-[#050505] min-h-screen">
                            <Navbar />
                            <main className="md:pl-20 pb-16 md:pb-0">
                                <Routes>
                                    <Route path="/" element={<Home />} />
                                    <Route path="/discover" element={<Discovery />} />
                                    <Route path="/studio" element={<ProtectedRoute><Studio /></ProtectedRoute>} />
                                    <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                                    <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                                    <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
                                    <Route path="/login" element={<Login />} />
                                    <Route path="/register" element={<Register />} />
                                    <Route path="/watch/:id" element={<Watch />} />
                                    <Route path="/embed/:id" element={<EmbedPage />} />
                                </Routes>
                            </main>
                        </div>
                    </Router>
                </SocketProvider>
            </ToastProvider>
        </AuthProvider>
    );
};

export default App;
