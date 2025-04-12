import React from 'react';
import { useForm } from "react-hook-form";

const CreateTask = ({ categories, task, errors, isOpen, onSubmit, onClose }) => {
    const { register, handleSubmit, reset } = useForm();

    const handleFormSubmit = async (payload) => {
        await onSubmit(payload);
        reset();
    };

    return (
        <>
        {isOpen && (
        // <div className="relative z-10" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        //     <div className="fixed inset-0 bg-gray-500/75 transition-opacity" aria-hidden="true"></div>

        //     <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        //         <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center">
        //             <div className="relative transform overflow-hidden p-8 rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
        //                 <h2 className="text-center text-2xl/9 font-bold tracking-tight text-gray-900">Category</h2>
        //                 <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col justify-center items-center gap-8 w-full">
        //                     <div className='flex flex-col justify-center items-center w-full gap-4'>
        //                         <div className="flex flex-col w-full items-start gap-2 justify-between">
        //                             <label htmlFor="title" className="block text-sm/6 font-medium text-gray-900">Name</label>
        //                             <input defaultValue={category.title} {...register("title", { required: true })} name="title" id="title" required className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 sm:text-sm/6" />
        //                             {errors?.title && (<small className='text-red-500 font-medium tracking-wide'>{errors.title}</small>)}
        //                         </div>
        //                         <div className="flex flex-col w-full items-start gap-2 justify-between">
        //                             <label htmlFor="description" className="block text-sm/6 font-medium text-gray-900">Description</label>
        //                             <textarea defaultValue={category.description} {...register("description", { required: false })} name="description" id="description" className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 sm:text-sm/6" />
        //                             {errors?.description && (<small className='text-red-500 font-medium tracking-wide'>{errors.description}</small>)}
        //                         </div>
        //                     </div>
        //                     <div className="flex w-full justify-center items-center gap-8">
        //                         <button type="submit" className="cursor-pointer flex w-full justify-center rounded-md bg-gray-800 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-gray-900">
        //                             {category.id ? 'Update' : 'Create'}
        //                         </button>
        //                         <button onClick={() => {reset(); onClose(false)}} className="cursor-pointer flex w-full justify-center rounded-md border border-gray-800  px-3 py-1.5 text-sm/6 font-semibold text-gray-900 shadow-xs hover:bg-gray-100">Cancel</button>
        //                     </div>
        //                 </form>
        //             </div>
        //         </div>
        //     </div>
        // </div>
        <div className="relative z-10" role="dialog" aria-modal="true" aria-labelledby="modal-title">
            <div className="fixed inset-0 bg-gray-500/75 transition-opacity" aria-hidden="true"></div>

            <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center">
                    <div className="relative transform overflow-hidden p-8 rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                        <h2 className="text-center text-2xl/9 font-bold tracking-tight text-gray-900">Task</h2>
                        <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col justify-center items-center gap-8 w-full">
                            <div className='flex flex-col justify-center items-center w-full gap-4'>
                                <div className="flex flex-col w-full items-start gap-2 justify-between">
                                    <label htmlFor="name" className="block text-sm/6 font-medium text-gray-900">Name</label>
                                    <input defaultValue={task.name} {...register("name", { required: true })} name="name" id="name" autoComplete="name" required className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 sm:text-sm/6" />
                                    {errors?.name && (<small className='text-red-500 font-medium tracking-wide'>{errors.name}</small>)}
                                </div>
                                <div className="flex flex-col w-full items-start gap-2 justify-between">
                                    <label htmlFor="description" className="block text-sm/6 font-medium text-gray-900">Description</label>
                                    <textarea defaultValue={task.description} {...register("description", { required: true })} name="description" id="description" className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 sm:text-sm/6" />
                                    {errors?.description && (<small className='text-red-500 font-medium tracking-wide'>{errors.description}</small>)}
                                </div>
                                <div className="flex flex-col w-full items-start gap-2 justify-between">
                                    <label htmlFor="priority" className="block text-sm/6 font-medium text-gray-900">Priority</label>
                                    <select defaultValue={task.priority} {...register("priority", { required: true })} name="priority" id="priority" className="block h-9 w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 sm:text-sm/6">
                                        <option value="low">Low</option>
                                        <option value="medium">medium</option>
                                        <option value="high">High</option>
                                    </select>
                                    {errors?.priority && (<small className='text-red-500 font-medium tracking-wide'>{errors.priority}</small>)}
                                </div>
                                <div className="flex flex-col w-full items-start gap-2 justify-between">
                                    <label htmlFor="status" className="block text-sm/6 font-medium text-gray-900">Status</label>
                                    <select defaultValue={task.status} {...register("status", { required: true })} name="status" id="status" className="block w-full h-9 rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 sm:text-sm/6">
                                        <option value="pending">Pending</option>
                                        <option value="in_progress">In Progress</option>
                                        <option value="completed">Completed</option>
                                    </select>
                                </div>

                                {!task.id && (
                                <div className="flex flex-col w-full items-start gap-2 justify-between">
                                    <label htmlFor="category_id" className="block text-sm/6 font-medium text-gray-900">Category</label>
                                    <select defaultValue={task.category_id} {...register("category_id", { required: true })} name="category_id" id="category_id" className="block w-full h-9 rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 sm:text-sm/6">
                                        {categories.map((category) => (<option key={category.title} value={category.id}>{category.title}</option>))}
                                    </select>
                                    {errors?.category_id && (<small className='text-red-500 font-medium tracking-wide'>{errors.category_id}</small>)}
                                </div>
                                )}
                            </div>
                            <div className="flex w-full justify-center items-center gap-8">
                                <button type="submit" className="cursor-pointer flex w-full justify-center rounded-md bg-gray-800 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-gray-900">
                                    {task.id ? 'Update' : 'Create'}
                                </button>
                                <button onClick={() => {reset(); onClose(false)}} className="cursor-pointer flex w-full justify-center rounded-md border border-gray-800  px-3 py-1.5 text-sm/6 font-semibold text-gray-900 shadow-xs hover:bg-gray-100">Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
        )}
        </>
    )
}

export default CreateTask;