import api from '../api';

const getSummary = async () => {
  const res = await api.get('/analytics/summary');
  return res.data;
};

const getAlertsByDay = async () => {
  const res = await api.get('/analytics/alerts-by-day');
  return res.data;
};

const getTicketStats = async () => {
  const res = await api.get('/analytics/ticket-stats');
  return res.data;
};

const getDeviceUptime = async () => {
  const res = await api.get('/analytics/device-uptime');
  return res.data;
};

export default { getSummary, getAlertsByDay, getTicketStats, getDeviceUptime };