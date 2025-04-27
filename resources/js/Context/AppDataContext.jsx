import React, { createContext, useContext, useEffect, useState } from 'react';
import {useAuthContext} from './AuthContext';
import Requests from '../request';

const AppDataContext = createContext();
export const useAppData = () => useContext(AppDataContext);

export const AppDataProvider = ({ children }) => {
    const [categoryTasks, setCategoryTasks] = useState([]);
    const [isDataLoading, setIsDataLoading] = useState(false);

    const { isAuthenticated, isLoading: isAuthLoading } = useAuthContext();

    useEffect(() => {
        setIsDataLoading(true);

        if (isAuthLoading) return;

        if (!isAuthenticated) {
            setIsDataLoading(false);
            return;
        };

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
