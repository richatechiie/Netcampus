import api from '../api';

const getAll = async () => {
  const res = await api.get('/devices');
  return res.data;
};

const create = async (data: {
  name: string;
  ipAddress: string;
  macAddress?: string;
  type: string;
  location: string;
  zone?: string;
}) => {
  const res = await api.post('/devices', data);
  return res.data;
};

const update = async (id: string, data: object) => {
  const res = await api.patch(`/devices/${id}`, data);
  return res.data;
};

const remove = async (id: string) => {
  const res = await api.delete(`/devices/${id}`);
  return res.data;
};

export default { getAll, create, update, remove };