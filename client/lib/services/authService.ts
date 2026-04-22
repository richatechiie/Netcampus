import api from '../api';

const register = async (data: {
  name: string;
  email: string;
  password: string;
  role: string;
}) => {
  const res = await api.post('/auth/register', data);
  return res.data;
};

const login = async (data: { email: string; password: string }) => {
  const res = await api.post('/auth/login', data);
  return res.data;
};

const getMe = async () => {
  const res = await api.get('/auth/me');
  return res.data;
};

export default { register, login, getMe };