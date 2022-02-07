import api from './api';

const usersUrl = 'https://jsonplaceholder.typicode.com/users';

export const getUsers = () => api.get(usersUrl);
