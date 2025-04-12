import React from 'react';
import { Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

const GuestLayout = () => {
    
    return (
        <div className="flex h-dvh flex-col justify-center items-center px-6 py-12 lg:px-8 bg-gray-100">
            <div className='w-full max-w-2xl bg-white py-12 backdrop-blur-lg border border-slate-200 rounded-md'>
                <div className='w-full flex flex-col justify-center items-center'>
                    <Outlet />
                </div>
            </div>
            <ToastContainer />
        </div>
    );
};

export default GuestLayout;
