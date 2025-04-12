import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [authToken, setAuthToken] = useState(null);
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(() => true)
        setAuthToken(() => localStorage.getItem('authToken'));

        if (authToken) {
            const headers = { Authorization: `Bearer ${authToken}` };
            axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;

            axios.get('/api/user', { headers }).then(({ data }) => {
                setUser(() => data)
                setIsAuthenticated(() => !!authToken);                
            }).catch((error) => console.log(error))

            axios.get('/api/categories', { headers }).then(({ data }) => {
                setProjects(() => data.data);
            }).catch((error) => console.log(error))
        }

    }, [isAuthenticated, authToken]);

    return (
        <AuthContext.Provider value={{
            isAuthenticated,
            setIsAuthenticated,
            user,
            setUser,
            authToken,
            setAuthToken,
            isLoading,
            setIsLoading
        }}>
            {children}
        </AuthContext.Provider>
    );
};
