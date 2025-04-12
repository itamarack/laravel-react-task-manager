import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';

const AuthLayout = () => {
    const { authToken, isLoading, user } = useAuth();
    console.log(user)
    
    if (isLoading) return <div className="text-center p-4">🌀 Loading...</div>;

    if (!authToken) return <Navigate to="/login" />;

    return (
        <div className="flex flex-col h-screen w-full">
            <nav className="bg-gray-800 px-12 py-4 flex h-16 items-center justify-between">
                <h1 className="shrink-0 text-white font-bold text-2xl">Task Manager</h1>
                <div className="flex justify-start items-center gap-8">
                    <div className="flex flex-col justify-center items-start gap-0">
                        <p className="text-sm font-bold tracking-wide text-white">{user.name}</p>
                        <p className="text-white tracking-wide font-light text-xs">{user.email}</p>
                    </div>
                    <button onClick={{}} className="bg-white text-black font-medium rounded-sm text-base px-6 py-1 cursor-pointer">
                        Logout
                    </button>
                </div>
            </nav>
            <Outlet />
        </div>
    )
};

export default AuthLayout;
