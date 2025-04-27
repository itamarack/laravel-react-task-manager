import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { toast } from 'react-toastify';
import { useAppData } from '../Context/AppDataContext';
import CreateCategory from "../Components/CreateCategory";
import CreateTasks from "../Components/CreateTasks";
import Requests from "../request";
import Helpers from "../helpers"

const TaskManager = () => {
	const { categoryTasks } = useAppData();
	const [taskState, setTaskState] = useState(categoryTasks);
	const [isOpenCategory, onOpenCategory] = useState(false);
	const [isOpenTask, onOpenTask] = useState(false);
	const [selected, setSelected] = useState({});
	const [errors, setErrors] = useState({});

    const onDragEnd = async (payload) => {
        if (!payload.destination) return;

        const response = Helpers.computeTaskStateOnDrag(payload, taskState);

        setTaskState(response.newState);

        const { removed, container } = response;

        await Requests.reorderTasks({
            surround_tasks: Helpers.getSurroundingTasks(container.tasks, removed),
            task: { ...removed, category_id: container.id },
        });
    }

	const onCreateCategory = (payload) => {
		setErrors(() => { })

		Requests.createCategory(payload).then((response) => {
			setTaskState(() => ([...taskState, response.data]));
			toast.success(response.message);
			onOpenCategory(() => false);
			setErrors(() => { })
		}).catch((response) => {
			setErrors(response.data.errors)
			toast.error(response.data.message)
		});
	}

	const onUpdateCategory = async (payload) => {
		setErrors(() => { })

		Requests.updateCategory({ ...selected, ...payload }).then((response) => {
			const idx = taskState.findIndex((item) => item.id === selected.id);
			const updatedTaskState = [...taskState];
			updatedTaskState[idx] = { ...updatedTaskState[idx], ...response.data };
			setTaskState(() => updatedTaskState);
			toast.success(response.message);
			onOpenCategory(() => false);
			setErrors(() => { })
		}).catch((response) => {
			setErrors(response.data.errors)
			toast.error(response.data.message)
		});
	}

	const onDeleteCategory = async (payload) => {
		setErrors(() => { })
		const isConfirmed = window.confirm("Are you sure you want to delete this category?");

		if (!isConfirmed) return;

		Requests.deleteCategory(payload).then((response) => {
			const updatedTaskState = taskState.filter((t) => t.id !== payload.id);
			setTaskState(() => updatedTaskState);
			toast.success(response.message);
			setErrors(() => { })
		}).catch((response) => {
			setErrors(response.data.errors)
			toast.error(response.data.message)
		});
	}

	const onCreateTask = async (payload) => {
		setErrors(() => { });

		Requests.createTask(payload).then((response) => {
			const newTask = response.data;
			const updatedTaskState = taskState.map((category) => {
				if (category.id === newTask.category.id) {
					return { ...category, tasks: [...category.tasks, newTask] };
				}
				return category;
			});

			setTaskState(updatedTaskState);
			toast.success(response.message);
			onOpenTask(false);
			setErrors({});
		}).catch((response) => {
			setErrors(response.data.errors);
			toast.error(response.data.message);
		});
	};

	const onUpdateTask = async (payload) => {
        console.log(payload);
		setErrors(() => { })

		Requests.updateTask({ ...selected, ...payload }).then((response) => {
			const updatedTaskState = taskState.map((iCategory) => {
				const nCategory = response.data.category;

				if (iCategory.id !== nCategory.id) return iCategory;

				const nTasks = iCategory.tasks.map((task) => {
					return task.id === response.data.id ? response.data : task;
				});

				return { ...iCategory, tasks: nTasks };
			});

			setTaskState(() => [...updatedTaskState])
			toast.success(response.message);
			onOpenTask(() => false);
			setErrors(() => { })
		}).catch((response) => {
			setErrors(response.data.errors)
			toast.error(response.data.message)
		});
	}

    const onReorderTask = async (task, taskBefore, taskAfter) => {

    }

	const onDeleteTask = async (task) => {
		const isConfirmed = window.confirm("Are you sure you want to delete this task?");

		if (!isConfirmed) return;

		Requests.deleteTask(task).then((response) => {
			const updatedTaskState = taskState.map((category) => {
				if (category.id !== response.data.category.id) {
					return category;
				}

				const nTasks = category.tasks.filter((t) => t.id !== task.id);

				return { ...category, tasks: nTasks };
			});

			setTaskState(() => updatedTaskState);
			toast.success(response.message);
			setErrors(() => { })
		}).catch((response) => {
			setErrors(response.data.errors)
			toast.error(response.data.message)
		});
	}

	const onToggleTaskStatus = async (payload) => {
		payload.status = payload.status === 'pending' ? 'completed' : 'pending';
		await onUpdateTask(payload);
	}

	return (
		<div className="flex flex-col h-screen w-full overflow-x-hidden">
			<header className="bg-white shadow-sm">
				<div className="mx-auto max-w-7xl px-4 py-6 flex justify-between items-center">
					<h1 className="text-3xl font-bold tracking-tight text-gray-900">Dashboard</h1>
					<div className="flex justify-start items-center gap-6">
						<div onClick={() => { setSelected({}); onOpenCategory(true) }} className="flex justify-start items-center gap-2 cursor-pointer border border-gray-800 text-gray-900 rounded-xl px-6 py-2">
							<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
								<path strokeLinecap="round" strokeLinejoin="round" d="M12 10.5v6m3-3H9m4.06-7.19-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z" />
							</svg>
							<p className="text-sm font-semibold tracking-wide font-sans">New Category</p>
						</div>
						{(taskState && taskState.length) ? (
							<div onClick={() => { setSelected({}); onOpenTask(true) }} className="flex justify-start items-center gap-2 cursor-pointer bg-gray-800 text-white rounded-xl px-6 py-2">
								<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
									<path strokeLinecap="round" strokeLinejoin="round" d="M6.75 2.994v2.25m10.5-2.25v2.25m-14.252 13.5V7.491a2.25 2.25 0 0 1 2.25-2.25h13.5a2.25 2.25 0 0 1 2.25 2.25v11.251m-18 0a2.25 2.25 0 0 0 2.25 2.25h13.5a2.25 2.25 0 0 0 2.25-2.25m-18 0v-7.5a2.25 2.25 0 0 1 2.25-2.25h13.5a2.25 2.25 0 0 1 2.25 2.25v7.5m-6.75-6h2.25m-9 2.25h4.5m.002-2.25h.005v.006H12v-.006Zm-.001 4.5h.006v.006h-.006v-.005Zm-2.25.001h.005v.006H9.75v-.006Zm-2.25 0h.005v.005h-.006v-.005Zm6.75-2.247h.005v.005h-.005v-.005Zm0 2.247h.006v.006h-.006v-.006Zm2.25-2.248h.006V15H16.5v-.005Z" />
								</svg>
								<p className="text-sm font-semibold tracking-wide font-sans">New Task</p>
							</div>
						) : null}
					</div>
				</div>
			</header>

			<CreateCategory
				category={selected}
				isOpen={isOpenCategory}
				errors={errors}
				onSubmit={selected.id ? onUpdateCategory : onCreateCategory}
				onClose={() => { onOpenCategory(false); setSelected({}) }}
			/>

			<CreateTasks
				task={selected}
				categories={taskState}
				isOpen={isOpenTask}
				errors={errors}
				onSubmit={selected.id ? onUpdateTask : onCreateTask}
				onClose={() => { onOpenTask(false); setSelected({}) }}
			/>

			{(taskState && taskState.length) ? (
				<div className="flex relative w-screen overflow-y-auto">
					<div className="flex justify-start items-start gap-4 m-8">
						<DragDropContext onDragEnd={onDragEnd}>
							{taskState.map((category, index) => (
								<Droppable key={category.title + index} droppableId={`${index}`}>
									{(provided, snapshot) => (
										<div
											ref={provided.innerRef}
											style={{
												background: snapshot.isDraggingOver ? '#dbeafe' : '#f1f5f9',
												padding: 8,
												width: 350,
												display: 'flex',
												flexDirection: 'column',
											}}
											{...provided.droppableProps}
										>
											<div className="flex flex-col max-w-xl border-b border-gray-500 mb-6 pb-4">
												<div className="flex justify-between items-center">
													<div className="flex gap-2 items-center justify-start">
														<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
															<path strokeLinecap="round" strokeLinejoin="round" d="M12 10.5v6m3-3H9m4.06-7.19-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z" />
														</svg>
														<span className="text-base tracking-wide text-slate-900 font-semibold">{category.title}</span>
													</div>
													<div className="flex justify-start items-center gap-0">
														<div onClick={() => { setSelected(category); onOpenCategory(true) }} className="flex justify-start items-center gap-1 cursor-pointer text-slate-900 hover:bg-slate-800 hover:text-white rounded-full p-1.5">
															<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-4">
																<path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
															</svg>
														</div>
														<div onClick={() => onDeleteCategory(category)} className="flex justify-start items-center gap-1 cursor-pointer text-slate-900 hover:bg-slate-800 hover:text-white rounded-full p-1.5">
															<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-4">
																<path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
															</svg>
														</div>
													</div>
												</div>
												<div className="w-80">
													<p className="text-sm truncate overflow-hidden text-ellipsis font-light text-gray-900 tracking-wide">
														{category.description}
													</p>
												</div>
											</div>
											{category.tasks.map((item, index) => (
												<Draggable
													key={item.name}
													draggableId={`${item.id}`}
													index={index}
												>
													{(provided, snapshot) => (
														<div
															ref={provided.innerRef}
															{...provided.draggableProps}
															{...provided.dragHandleProps}
															style={{
																userSelect: "none",
																padding: 16,
																margin: '0 0 16px 0',
																background: snapshot.isDragging ? "lightgreen" : (item.status == 'completed' ? 'lightpink' : 'white'),

																...provided.draggableProps.style
															}}
														>
															<div className="flex flex-col justify-start items-start gap-6">
																<div className="flex flex-col justify-start items-start gap-2">
																	<p className="text-base font-semibold tracking-wide font-sans">{item.name}</p>
																	<p className="text-sm font-light tracking-wide font-sans">{item.description}</p>
																</div>
																<div className="flex justify-between items-center w-full">
																	<div className="flex justify-center items-center gap-2">
																		<div className="bg-slate-800 rounded-xl px-3 py-1">
																			<p className="text-xs text-white font-medium font-sans capitalize tracking-wide">{item.status}</p>
																		</div>
																		<div className="bg-slate-100 rounded-xl px-3 py-1 w-fit">
																			<p className="text-xs text-slate-800 font-medium font-sans capitalize tracking-wide">{item.priority}</p>
																		</div>
																	</div>
																	<div className="flex justify-start items-center gap-0">
																		<div onClick={() => onToggleTaskStatus(item)} className="flex justify-start items-center gap-1 cursor-pointer text-slate-900 hover:bg-slate-800 hover:text-white rounded-full p-1.5">
																			<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-4">
																				<path strokeLinecap="round" strokeLinejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" />
																			</svg>
																		</div>
																		<div onClick={() => { setSelected(item); onOpenTask(true) }} className="flex justify-start items-center gap-1 cursor-pointer text-slate-900 hover:bg-slate-800 hover:text-white rounded-full p-1.5">
																			<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-4">
																				<path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
																			</svg>
																		</div>
																		<div onClick={() => onDeleteTask(item)} className="flex justify-start items-center gap-1 cursor-pointer text-slate-900 hover:bg-slate-800 hover:text-white rounded-full p-1.5">
																			<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-4">
																				<path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
																			</svg>
																		</div>
																	</div>
																</div>
															</div >
														</div >
													)}
												</Draggable >
											))}
											{provided.placeholder}
										</div >
									)}
								</Droppable >
							))}
						</DragDropContext >
					</div >
				</div >
			) : (
				<div className="flex flex-col justify-center items-center p-12 gap-8">
					<h1 className="text-2xl text-center font-bold tracking-wide text-gray-900">You do not have any projects yet.</h1>
					<div onClick={() => onOpenCategory(true)} className="flex justify-start items-center gap-2 cursor-pointer bg-gray-800 text-white rounded-xl px-6 py-2">
						<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
							<path strokeLinecap="round" strokeLinejoin="round" d="M12 10.5v6m3-3H9m4.06-7.19-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z" />
						</svg>
						<p className="text-sm font-semibold tracking-wide font-sans">New Category</p>
					</div>
				</div>
			)}
		</div >
	);
};

export default TaskManager;
