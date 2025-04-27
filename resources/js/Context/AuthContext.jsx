import React, { createContext, useContext, useState, useEffect } from 'react';
import Requests from '../request';
import {toast} from "react-toastify";

const AuthContext = createContext();

export const useAuthContext = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [authToken, setAuthToken] = useState(null);
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(() => true)
        setAuthToken(() => localStorage.getItem('authToken'));

        if (!authToken) return setIsLoading(() => false);

        axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;

        Requests.getCurrent().then((response) => {
            setUser(() => response);
            setIsAuthenticated(() => !!authToken);
        })
            .catch((error) => console.log(error))
            .finally(() => setIsLoading(false));

    }, [isAuthenticated, authToken]);

    const onLogout = async () => {
        Requests.logout().then((response) => {
            setUser(() => null);
            setIsAuthenticated(() => false);
            setAuthToken(() => null);
            localStorage.removeItem('authToken');
            axios.defaults.headers.common['Authorization'] = null;
            toast.success(response.message);
        }).catch((response) => {
            toast.error(response.data.message)
        });
    }

    return (
        <AuthContext.Provider value={{
            isAuthenticated,
            setIsAuthenticated,
            user,
            setUser,
            authToken,
            setAuthToken,
            isLoading,
            setIsLoading,
            onLogout
        }}>
            {children}
        </AuthContext.Provider>
    );
};
