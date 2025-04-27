import React, { createContext, useContext, useEffect, useState } from 'react';
import {useAuthContext} from './AuthContext';
import Requests from '../request';

const TaskContext = createContext();
export const useTaskContext = () => useContext(TaskContext);

export const AppDataProvider = ({ children }) => {
    const [categoryTasks, setCategoryTasks] = useState([]);
    const [isTaskLoading, setIsTaskLoading] = useState(true);

    const { isAuthLoading, user } = useAuthContext();

    useEffect(() => {
        if (isAuthLoading) return;

        Requests.csrfCookie().then(() => {
            Requests.getCategories().then((response) => {
                setCategoryTasks(response.data)
            })
            .catch(console.error)
            .finally(() => setIsTaskLoading(false));
        }).catch(console.error);

    }, [isAuthLoading, user]);

    return (
        <TaskContext.Provider value={{ categoryTasks, setCategoryTasks, isTaskLoading }}>
            {children}
        </TaskContext.Provider>
    );
};
