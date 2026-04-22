import api from '../api';

const getAll = async () => {
  const res = await api.get('/users');
  return res.data;
};

const updateRole = async (id: string, role: string) => {
  const res = await api.patch(`/users/${id}`, { role });
  return res.data;
};

const remove = async (id: string) => {
  const res = await api.delete(`/users/${id}`);
  return res.data;
};

export default { getAll, updateRole, remove };