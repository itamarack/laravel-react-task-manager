import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './Context/AuthContext';
import { AppDataProvider } from './Context/TaskContext.jsx';
import AuthLayout from './Layouts/AuthLayout';
import GuestLayout from './Layouts/GuestLayout';
import TaskManager from './Pages/TaskManager';
import Login from './Pages/Login';
import Register from './Pages/Register';

const Application = () => {
    return (
        <AuthProvider>
            <AppDataProvider>
                <Router>
                    <Routes>
                        <Route element={<GuestLayout />}>
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                        </Route>

                        <Route element={<AuthLayout />}>
                            <Route path="/" element={<TaskManager />} />
                        </Route>
                    </Routes>
                </Router>
            </AppDataProvider>
        </AuthProvider>
    );
};

export default Application;
