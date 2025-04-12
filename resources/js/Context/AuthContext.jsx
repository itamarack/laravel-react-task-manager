import React, { createContext, useContext, useState, useEffect } from 'react';
import Requests from '../request';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [authToken, setAuthToken] = useState(null);
    const [user, setUser] = useState(null);
    const [categoryTasks, setCategoryTasks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(() => true)
        setAuthToken(() => localStorage.getItem('authToken'));

        if (!authToken) {
            setIsLoading(() => false);
            return;
        }

        axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
        const requests = [Requests.getCurrent(),Requests.getCategories()];

        Promise.allSettled(requests).then(([profile, categories]) => {
            setUser(() => profile.value);
            setIsAuthenticated(() => !!authToken);
            setCategoryTasks(() => categories.value.data);
        })
        .catch((error) => console.log(error))
        .finally(() => setIsLoading(false));

    }, [isAuthenticated, authToken]);

    return (
        <AuthContext.Provider value={{
            isAuthenticated,
            setIsAuthenticated,
            user,
            setUser,
            authToken,
            setAuthToken,
            categoryTasks,
            isLoading,
            setIsLoading
        }}>
            {children}
        </AuthContext.Provider>
    );
};
