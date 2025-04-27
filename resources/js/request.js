const apiClient = (url, method, data = null) => {
    return new Promise((resolve, reject) => {
        axios({ url, method, data, withCredentials: true, withXSRFToken: true })
            .then((response) => resolve(response.data))
            .catch((error) => reject(error.response));
    });
};

const Requests = ({
    csrfCookie: () => apiClient('/sanctum/csrf-cookie', 'get'),

    login: (payload) => apiClient('/api/login', 'post', payload),
    register: (payload) => apiClient('/api/register', 'post', payload),
    logout: () => apiClient('/api/logout', 'post'),
    getCurrent: () => apiClient('/api/user', 'get'),

    getCategories: () => apiClient('/api/categories', 'get'),
    createCategory: (payload) => apiClient('/api/categories', 'post', payload),
    updateCategory: (payload) => apiClient(`/api/categories/${payload.id}`, 'put', payload),
    deleteCategory: (payload) => apiClient(`/api/categories/${payload.id}`, 'delete'),

    createTask: (payload) => apiClient('/api/tasks', 'post', payload),
    updateTask: (payload) => apiClient(`/api/tasks/${payload.id}`, 'put', payload),
    deleteTask: (payload) => apiClient(`/api/tasks/${payload.id}`, 'delete'),
    reorderTasks: (payload) => apiClient(`/api/tasks/${payload.task.id}/reorder`, 'patch', payload),
});

export default Requests;
