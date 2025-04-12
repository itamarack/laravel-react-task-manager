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
});

export default Requests;