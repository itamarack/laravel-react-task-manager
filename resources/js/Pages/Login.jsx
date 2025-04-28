import React from 'react';
import { useForm } from "react-hook-form";
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import {useAuthContext} from '../Context/AuthContext';
import Requests from '../request';

const Login = () => {
    const { actions: authActions } = useAuthContext();
    const navigate = useNavigate();
    const { register, handleSubmit } = useForm();

    const onSubmit = async (payload) => {
         Requests.csrfCookie().then(() => {
             Requests.login(payload).then((response) => {
                 authActions.setCurrentUser(response.data.user);
                toast.success(response.message);
            }).catch((response) => {
                toast.error(response.data.message)
            });
        }).catch((error) => console.log(error));
    }

    return (
        <div className='w-full flex flex-col justify-center items-center'>
            <h2 className="mt-10 text-2xl/9 font-bold tracking-tight text-gray-900">Sign in to your account</h2>
            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col justify-center items-center gap-8 w-full">
                    <div className='flex flex-col justify-center items-center w-full gap-4'>
                        <div className="flex flex-col w-full items-start gap-2 justify-between">
                            <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900">Email address</label>
                            <input defaultValue="user@example.com" {...register("email", { required: true })} type="email" name="email" id="email" autoComplete="email" required className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" />
                        </div>
                        <div className="flex flex-col w-full items-start gap-2 justify-between">
                            <label htmlFor="password" className="block text-sm/6 font-medium text-gray-900">Password</label>
                            <input defaultValue="password" {...register("password", { required: true })} type="password" name="password" id="password" autoComplete="current-password" required className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" />
                        </div>
                    </div>

                    <div className='w-full flex flex-col justify-start items-start gap-3'>
                        <button type="submit" className="flex w-full justify-center rounded-md bg-gray-800 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-gray-900 cursor-pointer">Sign in</button>
                        <p className="text-center text-sm font-bold tracking-tight text-gray-900">
                            Don't have an account? <a onClick={() => navigate('/register')} className="text-indigo-600 hover:underline cursor-pointer">Register new account</a>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
