const apiRequest = (url, method, data = null) => {
    return new Promise((resolve, reject) => {
        axios({ url, method, data, withCredentials: true })
            .then((response) => resolve(response.data))
            .catch((error) => reject(error.response));
    });
};

const Requests = ({
    csrfCookie: () => apiRequest('/sanctum/csrf-cookie', 'get'),

    login: (payload) => apiRequest('/api/login', 'post', payload),
    register: (payload) => apiRequest('/api/register', 'post', payload),
    logout: () => apiRequest('/api/logout', 'post'),
    getCurrent: () => apiRequest('/api/user', 'get'),

    getCategories: () => apiRequest('/api/categories', 'get'),
    createCategory: (payload) => apiRequest('/api/categories', 'post', payload),
    updateCategory: (payload) => apiRequest(`/api/categories/${payload.id}`, 'put', payload),
    deleteCategory: (payload) => apiRequest(`/api/categories/${payload.id}`, 'delete'),

    createTask: (payload) => apiRequest('/api/tasks', 'post', payload),
    updateTask: (payload) => apiRequest(`/api/tasks/${payload.id}`, 'put', payload),
    deleteTask: (payload) => apiRequest(`/api/tasks/${payload.id}`, 'delete'),
    reorderTasks: (payload) => apiRequest(`/api/tasks/${payload.task.id}/reorder`, 'patch', payload),
});

export default Requests;
