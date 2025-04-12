import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import Requests from '../request';

const AppDataContext = createContext();
export const useAppData = () => useContext(AppDataContext);

export const AppDataProvider = ({ children }) => {
    const [categoryTasks, setCategoryTasks] = useState([]);
    const [isDataLoading, setIsDataLoading] = useState(true);

    const { isAuthenticated, isLoading: isAuthLoading } = useAuth();

    useEffect(() => {
        if (isAuthLoading || !isAuthenticated) return;

        Requests.getCategories().then((response) => {
                setCategoryTasks(response.data)
            })
            .catch(console.error)
            .finally(() => setIsDataLoading(false));
    }, [isAuthenticated, isAuthLoading]);

    return (
        <AppDataContext.Provider value={{ categoryTasks, setCategoryTasks, isDataLoading }}>
            {children}
        </AppDataContext.Provider>
    );
};
