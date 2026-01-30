import api from '@/app/lib/axios';

export const getUsers = () => api.get('/users').then(res => res.data);

export const createUser = (payload: {
  email: string;
  password: string;
  role_id: string;
}) => api.post('/add_users', payload).then(res => res.data);

export const getUserById = (id: string) =>
  api.get(`/users/${id}`).then(res => res.data);

export const updateUser = (id: string, payload: any) =>
  api.patch(`/update_users/${id}`, payload).then(res => res.data);

export const deleteUser = (id: string) =>
  api.delete(`/users/${id}`).then(res => res.data);
