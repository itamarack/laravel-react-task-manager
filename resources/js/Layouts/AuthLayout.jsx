import React from 'react';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';
import { ToastContainer } from 'react-toastify';

const AuthLayout = () => {
    const { isAuthenticated, isLoading, user } = useAuth();
    const navigate = useNavigate()
    console.log(user)

    const onLogout = async () => {
        axios.post('/api/logout').then((response) => {
            setUser(() => null);
			setIsAuthenticated(() => false);
			setAuthToken(() => null);
			localStorage.removeItem('authToken');
            axios.defaults.headers.common['Authorization'] = null;
            navigate('/login')
        }).catch((response) => {});
	}
    
    if (isLoading) return <div className="text-center p-4">🌀 Loading...</div>;

    if (!isAuthenticated) return <Navigate to="/login" />;

    return (
        <div className="flex flex-col h-screen w-full">
            <nav className="bg-gray-800 px-12 py-4 flex h-16 items-center justify-between">
                <h1 className="shrink-0 text-white font-bold text-2xl">Task Manager</h1>
                <div className="flex justify-start items-center gap-8">
                    <div className="flex flex-col justify-center items-start gap-0">
                        <p className="text-sm font-bold tracking-wide text-white">{user.name}</p>
                        <p className="text-white tracking-wide font-light text-xs">{user.email}</p>
                    </div>
                    <button onClick={onLogout} className="bg-white text-black font-medium rounded-sm text-base px-6 py-1 cursor-pointer">
                        Logout
                    </button>
                </div>
            </nav>
            <Outlet />
            <ToastContainer />
        </div>
    )
};

export default AuthLayout;
