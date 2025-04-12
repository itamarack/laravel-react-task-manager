const apiRequest = (url, method, data = null) => {
    return new Promise((resolve, reject) => {
        axios({ url, method, data })
            .then((response) => resolve(response.data))
            .catch((error) => reject(error.response));
    });
};

const Requests = ({
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
});

export default Requests;