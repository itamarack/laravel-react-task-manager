import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Pages/Login';
import Register from './Pages/Register';
import GuestLayout from './Layouts/GuestLayout';
import AuthLayout from './Layouts/AuthLayout';
import { AuthProvider } from './Context/AuthContext';

const Application = () => {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route element={<GuestLayout />}>
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                    </Route>

                    <Route element={<AuthLayout />}>
                        <Route path="/" element={<>DASHBOARD</>} />
                    </Route>
                </Routes>
            </Router>
        </AuthProvider>
    );
};

export default Application;
