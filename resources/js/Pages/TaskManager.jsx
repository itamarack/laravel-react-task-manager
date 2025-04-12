import React, { useState, useCallback, useEffect } from "react";
import { Container, Draggable } from "react-smooth-dnd";
import { useForm } from "react-hook-form";
import { useAuth } from '../Context/AuthContext';

const TaskManager = () => {
	const { register, handleSubmit, reset } = useForm();
	const [isOpenCategory, setIsOpenCategory] = useState(false);
	const [isOpenTask, setIsOpenTask] = useState(false);
	const [scene, setScene] = useState({});
	const { user, categoryTasks, setAuthToken, setUser, setIsAuthenticated } = useAuth();
	const [taskProjects, setTaskProjects] = useState(categoryTasks);
	const [activeCategory, setActiveCategory] = useState({});
	const [activeTask, setActiveTask] = useState({});

	useEffect(() => {
		setTaskProjects(() => categoryTasks)
	}, [categoryTasks])

	const onLogout = async () => {
		axios.post('/api/logout').then(({ data }) => {
			setUser(() => null);
			setIsAuthenticated(() => false);
			setAuthToken(() => null);
			localStorage.removeItem('authToken');
		}).catch((error) => console.log(error))
	}
	
	const applyDrag = (arr, dragResult) => {
	  	const { removedIndex, addedIndex, payload } = dragResult;
	  	if (removedIndex === null && addedIndex === null) return arr;
	
		const result = [...arr];
		let itemToAdd = payload;
		
		if (removedIndex !== null) {
			itemToAdd = result.splice(removedIndex, 1)[0];
		}
		
		if (addedIndex !== null) {
			result.splice(addedIndex, 0, itemToAdd);
		}
		
		return result;
	};

	const buildSceneFromProjects = useCallback((projects) => {
		const statusColors = {
			pending: 'linear-gradient(90deg, #0294d1 0%, #66c4d4 100%)',
			in_progress: 'linear-gradient(90deg, #fc7b7b 33%, #ff9c7a 100%)',
			completed: 'linear-gradient(90deg, #2fbfa7 0%, #57d68b 100%)'
		};

		return ({
			type: "container",
			props: { orientation: "horizontal" },
			children: projects.map((project) => ({
				id: `column${project.id}`,
				column_id: project.id,
				type: "container",
				name: project.title,
				data: project,
				props: {
					orientation: "vertical",
					className: "bg-white p-4 rounded-lg flex w-full flex-col justify-start gap-4 shadow"
				},
				children: project.tasks.map((task) => ({
					type: "draggable",
					id: `task-${task.name}-${task.id}`,
					column: project, 
					data: task,
					props: {
						className: "card",
						style: { backgroundImage: statusColors[task.status] }
					},
				}))
			}))
		});
	}, []);
	  
	useEffect(() => {
		setScene(() => buildSceneFromProjects(taskProjects));
	}, [taskProjects, buildSceneFromProjects])	
	
	const getCardPayload = useCallback((columnId, index) => {
		return scene.children.find(col => col.id === columnId).children[index];
	}, [scene]);

	const onColumnDrop = useCallback(dropResult => {
		const newScene = { ...scene };
		newScene.children = applyDrag(newScene.children, dropResult);
		setScene(newScene);
	}, [scene]);
	
	const onCardDrop = useCallback(async (column, dropResult) => {
	if (dropResult.removedIndex !== null || dropResult.addedIndex !== null) {
		const newScene = { ...scene };
		const columnIndex = newScene.children.findIndex(col => col.id === column.id);
		const newColumn = { ...newScene.children[columnIndex] };

		newColumn.children = applyDrag(newColumn.children, dropResult);
		newScene.children.splice(columnIndex, 1, newColumn);

		if (dropResult && dropResult.addedIndex !== null) {
			const updatingTask = {
				name: dropResult.payload.data.name,
				priority: dropResult.payload.data.priority,
				status: dropResult.payload.data.status,
				category_id: column.column_id
			}

			const taskId = dropResult.payload.data.id;
			const response = await axios.put(`/api/tasks/${taskId}`, updatingTask);
		}

		setScene(newScene);
	}
	}, [scene]);

	const onSubmitTask = (formData) => {
		!!activeTask.id ? onUpdateTask(formData, activeTask) : onCreateTask(formData)
	}

	const onUpdateTask = async(formData, task) => {
		await axios.put(`/api/tasks/${task.id}`, formData).then(({ data }) => {
			setTaskProjects((taskProjects) => {
				return taskProjects.map((project) => {
					if (project.id === data.data.category.id) {
						const updatedTasks = project.tasks.filter((task) => task.id !== data.data.id);
						updatedTasks.unshift(data.data);

						return { ...project, tasks: updatedTasks };
					}

					return project;
				});
			});

			setIsOpenTask(() => false);
			setActiveTask(() => {});

		}).catch((error) => console.log(error));
	}

	const onCreateTask = async(formData) => {
		await axios.post('/api/tasks', formData).then(({ data }) => {
			setTaskProjects((prevState) => {
				const project = prevState.find(project => project.id === data.data.category.id);
				project.tasks.push(data.data);
			
				return [...prevState];
			});

			setIsOpenTask(() => false);
			setActiveTask(() => {});

		}).catch((error) => console.log(error));
	}

	const onDeleteTask = async (task) => {
		const isConfirmed = window.confirm("Are you sure you want to delete this task?");
  
  		if (!isConfirmed) return;

		await axios.delete(`/api/tasks/${task.id}`).then(({ data }) => {
			setTaskProjects((prevState) => {
				return prevState.map((project) => {
					if (project.id === data.data.category.id) {
						const updatedTasks = project.tasks.filter((t) => t.id !== task.id);
						return { ...project, tasks: updatedTasks };
					}
					return project;
				});
			});

		}).catch((error) => console.log(error));
	}

	const onSubmitCategory = (formData) => {
		!!activeCategory.id
			? onUpdateCategory(formData, activeCategory)
			: onCreateCategory(formData)
	}

	const onCreateCategory = async (formData) => {
		await axios.post('/api/categories/', formData).then(({ data }) => {
			setTaskProjects((projects) => ([...projects, data.data]))
			setIsOpenCategory(() => false);
			setActiveCategory(() => {});
			reset();

		}).catch((error) => console.log(error));
	}

	const onUpdateCategory = async (formData, category) => {
		await axios.put(`/api/categories/${category.id}`, formData).then(({ data }) => {
			const categoryIndex = projects.findIndex((project) => project.id === category.id);
			const updatedProjects = [...projects];
        	updatedProjects[categoryIndex] = { ...updatedProjects[categoryIndex], ...data.data };

        	setTaskProjects(() => updatedProjects);
			setIsOpenCategory(() => false)

		}).catch((error) => console.log(error));
	}

	const onDeleteCategory = async (category) => {
		const isConfirmed = window.confirm("Are you sure you want to delete this category?");
  
  		if (!isConfirmed) return;

		await axios.delete(`/api/categories/${category.id}`).then(() => {
			const updatedProjects = projects.filter((t) => t.id !== category.id);
			setTaskProjects(() => updatedProjects)

		}).catch((error) => console.log(error));
	}

	const onDragEnter = (column) => {
		console.log("drag enter:", column)
	}

    return (
		<div className="flex flex-col h-screen w-full overflow-x-hidden">

			<header className="bg-white shadow-sm">
				<div className="mx-auto max-w-7xl px-4 py-6 flex justify-between items-center">
					<h1 className="text-3xl font-bold tracking-tight text-gray-900">Dashboard</h1>
					<div className="flex justify-start items-center gap-6">
						<div onClick={() => setIsOpenCategory(true)} className="flex justify-start items-center gap-2 cursor-pointer border border-gray-800 text-gray-900 rounded-xl px-6 py-2">
							<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
								<path strokeLinecap="round" strokeLinejoin="round" d="M12 10.5v6m3-3H9m4.06-7.19-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z" />
							</svg>
							<p className="text-sm font-semibold tracking-wide font-sans">New Category</p>
						</div>
						{(categoryTasks && categoryTasks.length) ? (
							<div onClick={() => setIsOpenTask(true)} className="flex justify-start items-center gap-2 cursor-pointer bg-gray-800 text-white rounded-xl px-6 py-2">
								<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
									<path strokeLinecap="round" strokeLinejoin="round" d="M6.75 2.994v2.25m10.5-2.25v2.25m-14.252 13.5V7.491a2.25 2.25 0 0 1 2.25-2.25h13.5a2.25 2.25 0 0 1 2.25 2.25v11.251m-18 0a2.25 2.25 0 0 0 2.25 2.25h13.5a2.25 2.25 0 0 0 2.25-2.25m-18 0v-7.5a2.25 2.25 0 0 1 2.25-2.25h13.5a2.25 2.25 0 0 1 2.25 2.25v7.5m-6.75-6h2.25m-9 2.25h4.5m.002-2.25h.005v.006H12v-.006Zm-.001 4.5h.006v.006h-.006v-.005Zm-2.25.001h.005v.006H9.75v-.006Zm-2.25 0h.005v.005h-.006v-.005Zm6.75-2.247h.005v.005h-.005v-.005Zm0 2.247h.006v.006h-.006v-.006Zm2.25-2.248h.006V15H16.5v-.005Z" />
								</svg>
								<p className="text-sm font-semibold tracking-wide font-sans">New Task</p>
							</div>
						) : null}
					</div>
				</div>
			</header>

			{isOpenCategory && (
				<div className="relative z-10" role="dialog" aria-modal="true" aria-labelledby="modal-title">
					<div className="fixed inset-0 bg-gray-500/75 transition-opacity" aria-hidden="true"></div>

					<div className="fixed inset-0 z-10 w-screen overflow-y-auto">
						<div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center">
							<div className="relative transform overflow-hidden p-8 rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
								<h2 className="text-center text-2xl/9 font-bold tracking-tight text-gray-900">Category</h2>
								<form onSubmit={handleSubmit(onSubmitCategory)} className="flex flex-col justify-center items-center gap-8 w-full">
									<div className='flex flex-col justify-center items-center w-full gap-4'>
										<div className="flex flex-col w-full items-start gap-2 justify-between">
											<label htmlFor="title" className="block text-sm/6 font-medium text-gray-900">Name</label>
											<input defaultValue={activeCategory.title} {...register("title", { required: true })} name="title" id="title" required className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 sm:text-sm/6" />
										</div>
										<div className="flex flex-col w-full items-start gap-2 justify-between">
											<label htmlFor="description" className="block text-sm/6 font-medium text-gray-900">Description</label>
											<textarea defaultValue={activeCategory.description} {...register("description", { required: false })} name="description" id="description" className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 sm:text-sm/6" />
										</div>
									</div>
									<div className="flex w-full justify-center items-center gap-8">
										<button type="submit" className="cursor-pointer flex w-full justify-center rounded-md bg-gray-800 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-gray-900">Create</button>
										<button onClick={() => setIsOpenCategory(false)} className="cursor-pointer flex w-full justify-center rounded-md border border-gray-800  px-3 py-1.5 text-sm/6 font-semibold text-gray-900 shadow-xs hover:bg-gray-100">Cancel</button>
									</div>
								</form>
							</div>
						</div>
					</div>
				</div>
			)}

			{isOpenTask && (
				<div className="relative z-10" role="dialog" aria-modal="true" aria-labelledby="modal-title">
					<div className="fixed inset-0 bg-gray-500/75 transition-opacity" aria-hidden="true"></div>

					<div className="fixed inset-0 z-10 w-screen overflow-y-auto">
						<div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center">
							<div className="relative transform overflow-hidden p-8 rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
								<h2 className="text-center text-2xl/9 font-bold tracking-tight text-gray-900">Task</h2>
								<form onSubmit={handleSubmit(onSubmitTask)} className="flex flex-col justify-center items-center gap-8 w-full">
									<div className='flex flex-col justify-center items-center w-full gap-4'>
										<div className="flex flex-col w-full items-start gap-2 justify-between">
											<label htmlFor="name" className="block text-sm/6 font-medium text-gray-900">Name</label>
											<input defaultValue={activeTask.name} {...register("name", { required: true })} name="name" id="name" autoComplete="name" required className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 sm:text-sm/6" />
										</div>
										<div className="flex flex-col w-full items-start gap-2 justify-between">
											<label htmlFor="description" className="block text-sm/6 font-medium text-gray-900">Description</label>
											<textarea defaultValue={activeTask.description} {...register("description", { required: true })} name="description" id="description" className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 sm:text-sm/6" />
										</div>
										<div className="flex flex-col w-full items-start gap-2 justify-between">
											<label htmlFor="priority" className="block text-sm/6 font-medium text-gray-900">Priority</label>
											<select defaultValue={activeTask.priority} {...register("priority", { required: true })} name="priority" id="priority" className="block h-9 w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 sm:text-sm/6">
												<option value="low">Low</option>
												<option value="medium">medium</option>
												<option value="high">High</option>
											</select>
										</div>
										<div className="flex flex-col w-full items-start gap-2 justify-between">
											<label htmlFor="status" className="block text-sm/6 font-medium text-gray-900">Status</label>
											<select defaultValue={activeTask.status} {...register("status", { required: true })} name="status" id="status" className="block w-full h-9 rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 sm:text-sm/6">
												<option value="pending">Pending</option>
												<option value="in_progress">In Progress</option>
												<option value="completed">Completed</option>
											</select>
										</div>

										<div className="flex flex-col w-full items-start gap-2 justify-between">
											<label htmlFor="category_id" className="block text-sm/6 font-medium text-gray-900">Category</label>
											<select defaultValue={activeTask.category_id} {...register("category_id", { required: true })} name="category_id" id="category_id" className="block w-full h-9 rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 sm:text-sm/6">
												{projects.map((project) => (<option key={project.title} value={project.id}>{project.title}</option>))}
											</select>
										</div>
									</div>
									<div className="flex w-full justify-center items-center gap-8">
										<button type="submit" className="cursor-pointer flex w-full justify-center rounded-md bg-gray-800 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-gray-900">Create</button>
										<button onClick={() => { reset(); setActiveTask({}); setIsOpenTask(false)}} className="cursor-pointer flex w-full justify-center rounded-md border border-gray-800  px-3 py-1.5 text-sm/6 font-semibold text-gray-900 shadow-xs hover:bg-gray-100">Cancel</button>
									</div>
								</form>
							</div>
						</div>
					</div>
				</div>
			)}

			{(categoryTasks && categoryTasks.length) ? (
				<div className="bg-slate-50 w-screen overflow-y-auto">
				<Container
					orientation="horizontal"
					onDrop={onColumnDrop}
					dragHandleSelector=".column-drag-handle"
					dropPlaceholder={{
						animationDuration: 150,
						showOnTop: true,
						className: "cards-drop-preview"
					}}
				>
					<div className="flex gap-8 px-8 py-8 overflow-x-auto w-max">
						{scene.children && scene.children.map(column => (
							<Draggable key={column.id}>
								<div className={column.props.className}>
									<div className="flex flex-col max-w-xl">
										<div className="flex justify-between items-center">
											<div className="flex gap-2 items-center justify-start cursor-move">
												<span className="font-bold text-2xl mb-1">&#x2630;</span>
												<span className="text-xl tracking-wide text-slate-900 font-semibold">{column.name}</span>
											</div>
											<div className="flex justify-start items-center gap-0">
												<div onClick={() => { setActiveCategory(() => column.data); setIsOpenCategory(() => true); }}  className="flex justify-start items-center gap-1 cursor-pointer hover:bg-gray-800 hover:text-white rounded-full p-2">
													<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
														<path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
													</svg>
												</div>
												<div onClick={() => onDeleteCategory(column.data)} className="flex justify-start items-center gap-1 cursor-pointer hover:bg-gray-800 hover:text-white rounded-full p-2">
													<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
														<path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
													</svg>
												</div>
											</div>
										</div>
										<div className="w-96">
											<p className="truncate overflow-hidden text-ellipsis font-light text-gray-900 tracking-wide">{column.data.description}</p>
										</div>
									</div>
									<Container
										{...column.props}
										groupName="col"
										onDragStart={e => console.log("drag started", e)}
										onDragEnd={e => console.log("drag end", e)}
										onDrop={e => onCardDrop(column, e)}
										getChildPayload={index => getCardPayload(column.id, index)}
										dragClass="card-ghost"
										dropClass="card-ghost-drop"
										onDragEnter={() => onDragEnter(column)}
										onDragLeave={() => console.log("drag leave:", column.id)}
										onDropReady={p => console.log("Drop ready: ", p)}
										dropPlaceholder={{
											animationDuration: 150,
											showOnTop: true,
											className: "drop-preview"
										}}
										dropPlaceholderAnimationDuration={200}
										style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
									>
										{column.children.map((card) => (
											<Draggable key={card.id} className="rounded-xl shadow cursor-move w-96">
												<div {...card.props} className="flex flex-col justify-start items-start gap-3 shadow-md rounded-xl p-4">
													<p className="text-xl font-semibold tracking-wide font-sans">{card.data.name}</p>
													<p className="text-base font-light tracking-wide font-sans">{card.data.description}</p>
													<div className="flex justify-start items-center gap-0 mt-5">
														<div onClick={() => { setActiveTask(() => card.data); setIsOpenTask(() => true); }} className="flex justify-start items-center gap-1 cursor-pointer hover:bg-gray-800 hover:text-white rounded-xl px-3 py-1">
															<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
																<path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
															</svg>
															<p className="text-sm font-semibold tracking-wide font-sans">Edit</p>
														</div>
														<div onClick={() => onDeleteTask(card.data)} className="flex justify-start items-center gap-1 cursor-pointer hover:bg-gray-800 hover:text-white rounded-xl px-3 py-1">
															<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
																<path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
															</svg>
															<p className="text-sm font-semibold tracking-wide font-sans">Delete</p>
														</div>
													</div>
												</div>
											</Draggable>
										))}
									</Container>
								</div>
							</Draggable>
						))}
					</div>
				</Container>
			</div>
			) : (
				<div className="flex flex-col justify-center items-center p-12 gap-8">
					<h1 className="text-2xl text-center font-bold tracking-wide text-gray-900">You do not have any projects yet.</h1>
					<div onClick={() => setIsOpenCategory(true)} className="flex justify-start items-center gap-2 cursor-pointer bg-gray-800 text-white rounded-xl px-6 py-2">
						<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
							<path strokeLinecap="round" strokeLinejoin="round" d="M12 10.5v6m3-3H9m4.06-7.19-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z" />
						</svg>
						<p className="text-sm font-semibold tracking-wide font-sans">New Category</p>
					</div>
				</div>
			)}
        </div>
	);
};

export default TaskManager;
