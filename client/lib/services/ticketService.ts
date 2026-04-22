import api from '../api';

const getAll = async (params?: object) => {
  const res = await api.get('/tickets', { params });
  return res.data;
};

const create = async (data: {
  title: string;
  description: string;
  category: string;
  priority: string;
}) => {
  const res = await api.post('/tickets', data);
  return res.data;
};

const update = async (id: string, data: object) => {
  const res = await api.patch(`/tickets/${id}`, data);
  return res.data;
};

export default { getAll, create, update };