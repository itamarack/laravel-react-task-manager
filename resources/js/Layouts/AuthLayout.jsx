import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import {toast, ToastContainer} from 'react-toastify';
import { useAuthContext } from '../Context/AuthContext';
import { useTaskContext } from '../Context/TaskContext.jsx';
import Requests from "../request.js";

const AuthLayout = () => {
    const { state: authState, actions: authActions } = useAuthContext();
    const { isTaskLoading, state: taskState } = useTaskContext();

    const onLogout = async () => {
        await Requests.logout().then((response) => {
            authActions.setCurrentUser(null);
            toast.success(response.message);
        }).catch((response) => {
            toast.error(response.data.message)
        });
    }

    if (authState.loading || taskState.loading) {
        return <div className="text-center p-4">🌀 Loading...</div>;
    }

    if (!authState.user) {
        return <Navigate to="/login" />;
    }

    return (
        <div className="flex flex-col h-screen w-full">
            <nav className="bg-gray-800 px-12 py-4 flex h-16 items-center justify-between">
                <h1 className="shrink-0 text-white font-bold text-2xl">Task Manager</h1>
                <div className="flex justify-start items-center gap-8">
                    <div className="flex flex-col justify-center items-start gap-0">
                        <p className="text-sm font-bold tracking-wide text-white">{authState.user.name}</p>
                        <p className="text-white tracking-wide font-light text-xs">{authState.user.email}</p>
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
