import React, { createContext, useContext, useState, useEffect } from 'react';
import Requests from '../request';

const AuthContext = createContext();

export const useAuthContext = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthLoading, setIsAuthLoading] = useState(true);

    useEffect( () => {
        Requests.csrfCookie().then(() => {
            Requests.getCurrent().then((response) => {
                setUser(() => response.data);
            }).catch((error) => console.log(error))
        })
        .catch((error) => console.log(error))
        .finally(() => setIsAuthLoading(false));

    }, []);

    return (
        <AuthContext.Provider value={{
            user,
            setUser,
            isAuthLoading,
            setIsAuthLoading,
        }}>
            {children}
        </AuthContext.Provider>
    );
};
