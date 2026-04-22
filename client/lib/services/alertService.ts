import api from '../api';

const getAll = async (params?: object) => {
  const res = await api.get('/alerts', { params });
  return res.data;
};

const acknowledge = async (id: string) => {
  const res = await api.patch(`/alerts/${id}/acknowledge`);
  return res.data;
};

const remove = async (id: string) => {
  const res = await api.delete(`/alerts/${id}`);
  return res.data;
};

export default { getAll, acknowledge, remove };