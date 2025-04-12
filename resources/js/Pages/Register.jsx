import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from "react-hook-form";

const Register = () => {
    const navigate = useNavigate(); 
    const { register, handleSubmit } = useForm();

    const onSubmit = async(payload) => {
        try {
            const response = await axios.post('/api/register', payload);
        
            if (response.status === 201) {
                localStorage.setItem('authToken', response.data.access_token);
                axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
                navigate('/');

            } else {
                console.error('Login failed: No access token received');
                alert('Login failed. Please try again.');
            }

        } catch (error) {
            console.error('Login error:', error.response ? error.response.data : error.message);
            alert('An error occurred. Please check your credentials and try again.');
        }
    }

    return (
        <div className='w-full flex flex-col justify-center items-center'>
            <h2 className="text-center text-2xl/9 font-bold tracking-tight text-gray-900">Register your new account</h2>
            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col justify-center items-center gap-8 w-full">
                    <div className='flex flex-col justify-center items-center w-full gap-4'>
                        <div className="flex flex-col w-full items-start gap-2 justify-between">
                            <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900">Email address</label>
                            <input {...register("email", { required: true })} type="email" name="email" id="email" required className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 sm:text-sm/6" />
                        </div>
                        <div className="flex flex-col w-full items-start gap-2 justify-between">
                            <label htmlFor="name" className="block text-sm/6 font-medium text-gray-900">Your name</label>
                            <input {...register("name", { required: true })} name="name" id="name" required className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 sm:text-sm/6" />
                        </div>
                        <div className="flex flex-col w-full items-start gap-2 justify-between">
                            <label htmlFor="password" className="block text-sm/6 font-medium text-gray-900">Password</label>
                            <input {...register("password", { required: true })} type="password" name="password" id="password" autoComplete="current-password" required className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 sm:text-sm/6" />
                        </div>
                        <div className="flex flex-col w-full items-start gap-2 justify-between">
                            <label htmlFor="password_confirmation" className="block text-sm/6 font-medium text-gray-900">Confirm Password</label>
                            <input {...register("password_confirmation", { required: true })} type="password" name="password_confirmation" id="password_confirmation" autoComplete="current-password" required className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 sm:text-sm/6" />
                        </div>
                    </div>

                    <div className='w-full flex flex-col justify-start items-start gap-3'>
                        <button type="submit" className="flex w-full justify-center rounded-md bg-gray-800 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-gray-900 cursor-pointer">Register</button>
                        <p className="text-center text-sm font-bold tracking-tight text-gray-900">
                            Already have an account? <a onClick={() => navigate('/login')} className="text-indigo-600 hover:underline cursor-pointer">Sign in to account</a>
                        </p>
                    </div>
                </form>
            </div>
    </div>
    );
};

export default Register;
