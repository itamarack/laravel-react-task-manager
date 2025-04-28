import React, { createContext, useContext, useReducer, useEffect } from 'react';
import Requests from '../request';

const AuthContext = createContext({});

export const useAuthContext = () => useContext(AuthContext);

const initialState = {
    user: null,
    loading: true,
    errors: {}
};

const reducer = (state, action) => {
    switch (action.type) {
        case 'SET_USER':
            return { ...state, user: action.payload };
        case 'SET_LOADING':
            return { ...state, loading: action.payload };
        default:
            return state;
    }
};

export const AuthProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    const actions = ({
        setCurrentUser: (payload) => dispatch({ type: 'SET_USER', payload }),
        setLoading: (payload) => dispatch({ type: 'SET_LOADING', payload })
    });

    useEffect( () => {
        Requests.csrfCookie().then(() => {
            Requests.getCurrent().then((response) => {
                actions.setCurrentUser(response.data);
            }).catch((error) => console.log(error))
        })
        .catch((error) => console.log(error))
        .finally(() => actions.setLoading(false));
    }, []);

    return (
        <AuthContext.Provider value={{ state, dispatch, actions }}>
            {children}
        </AuthContext.Provider>
    );
};
