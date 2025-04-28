import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useAuthContext } from './AuthContext';
import Requests from '../request';

const TaskContext = createContext({});
export const useTaskContext = () => useContext(TaskContext);

const initialState = {
    tasks: null,
    loading: true,
    errors: {}
};

const reducer = (state, action) => {
    switch (action.type) {
        case 'SET_TASKS':
            return { ...state, tasks: action.payload };
        case 'SET_LOADING':
            return { ...state, loading: action.payload };
        default:
            return state;
    }
};

export const TaskProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const { state: authState } = useAuthContext();

    const actions = ({
        setTasks: (payload) => dispatch({ type: 'SET_TASKS', payload }),
        setLoading: (payload) => dispatch({ type: 'SET_LOADING', payload })
    });

    useEffect(() => {
        if (authState.loading) return;

        Requests.csrfCookie().then(() => {
            Requests.getCategories().then((response) => {
                actions.setTasks(response.data);
            })
            .catch(console.error)
            .finally(() => actions.setLoading(false));
        }).catch(console.error);

    }, [authState]);

    return (
        <TaskContext.Provider value={{ state, dispatch, actions }}>
            {children}
        </TaskContext.Provider>
    );
};
