import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Pages/Login';
import Register from './Pages/Register';
import GuestLayout from './Layouts/GuestLayout';

const Application = () => {
    return (
        <>
            <Router>
                <Routes>
                    <Route element={<GuestLayout />}>
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                    </Route>
                </Routes>
            </Router>
        </>
    );
};

export default Application;
