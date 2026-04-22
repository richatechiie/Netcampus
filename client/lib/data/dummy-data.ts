export const deviceData = [
  { id: 'DEV-001', name: 'Core Router 1', type: 'Router', status: 'online', uptime: '99.9%', cpu: 45, memory: 62, location: 'Building A', ip: '192.168.1.1' },
  { id: 'DEV-002', name: 'Core Router 2', type: 'Router', status: 'online', uptime: '99.8%', cpu: 42, memory: 58, location: 'Building B', ip: '192.168.1.2' },
  { id: 'DEV-003', name: 'Switch 1', type: 'Switch', status: 'online', uptime: '100%', cpu: 28, memory: 35, location: 'Building A', ip: '192.168.1.10' },
  { id: 'DEV-004', name: 'Switch 2', type: 'Switch', status: 'online', uptime: '99.9%', cpu: 31, memory: 38, location: 'Building B', ip: '192.168.1.11' },
  { id: 'DEV-005', name: 'Firewall 1', type: 'Firewall', status: 'online', uptime: '99.95%', cpu: 52, memory: 71, location: 'Building A', ip: '192.168.1.20' },
  { id: 'DEV-006', name: 'AP-101', type: 'Access Point', status: 'offline', uptime: '85.2%', cpu: 0, memory: 0, location: 'Building C', ip: '192.168.1.50' },
  { id: 'DEV-007', name: 'AP-102', type: 'Access Point', status: 'online', uptime: '99.7%', cpu: 35, memory: 45, location: 'Building A', ip: '192.168.1.51' },
  { id: 'DEV-008', name: 'AP-103', type: 'Access Point', status: 'online', uptime: '99.8%', cpu: 38, memory: 48, location: 'Building B', ip: '192.168.1.52' },
]

export const alertData = [
  { id: 'ALT-001', device: 'Core Router 1', type: 'High CPU', severity: 'critical', time: '2 mins ago', status: 'unresolved' },
  { id: 'ALT-002', device: 'Firewall 1', type: 'Memory Warning', severity: 'warning', time: '15 mins ago', status: 'unresolved' },
  { id: 'ALT-003', device: 'AP-101', type: 'Device Offline', severity: 'critical', time: '1 hour ago', status: 'unresolved' },
  { id: 'ALT-004', device: 'Switch 2', type: 'Port Error', severity: 'warning', time: '3 hours ago', status: 'acknowledged' },
  { id: 'ALT-005', device: 'Core Router 2', type: 'Temperature High', severity: 'warning', time: '5 hours ago', status: 'resolved' },
]

export const ticketData = [
  { id: 'TKT-001', title: 'AP-101 Offline Investigation', priority: 'high', status: 'open', assigned: 'John Smith', created: '1 hour ago' },
  { id: 'TKT-002', title: 'Firewall Update Planning', priority: 'medium', status: 'in-progress', assigned: 'Sarah Johnson', created: '3 hours ago' },
  { id: 'TKT-003', title: 'Network Performance Tuning', priority: 'medium', status: 'open', assigned: 'Michael Chen', created: '6 hours ago' },
  { id: 'TKT-004', title: 'Security Audit - Q1', priority: 'high', status: 'in-progress', assigned: 'Emma Davis', created: '1 day ago' },
  { id: 'TKT-005', title: 'VLAN Configuration Review', priority: 'low', status: 'closed', assigned: 'John Smith', created: '2 days ago' },
]

export const userData = [
  { id: 'USR-001', name: 'Admin User', email: 'admin@netcampus.local', role: 'Administrator', status: 'active', lastLogin: '2 hours ago' },
  { id: 'USR-002', name: 'John Smith', email: 'john.smith@netcampus.local', role: 'Network Engineer', status: 'active', lastLogin: '30 mins ago' },
  { id: 'USR-003', name: 'Sarah Johnson', email: 'sarah.johnson@netcampus.local', role: 'Network Engineer', status: 'active', lastLogin: '1 hour ago' },
  { id: 'USR-004', name: 'Michael Chen', email: 'michael.chen@netcampus.local', role: 'Technician', status: 'active', lastLogin: '4 hours ago' },
  { id: 'USR-005', name: 'Emma Davis', email: 'emma.davis@netcampus.local', role: 'Security Officer', status: 'active', lastLogin: '45 mins ago' },
  { id: 'USR-006', name: 'Robert Wilson', email: 'robert.wilson@netcampus.local', role: 'Technician', status: 'inactive', lastLogin: '3 days ago' },
]

export const dashboardStats = [
  { label: 'Total Devices', value: '8', change: '+2', trend: 'up' },
  { label: 'Online Devices', value: '7', change: '-1', trend: 'down' },
  { label: 'Active Alerts', value: '3', change: '+2', trend: 'down' },
  { label: 'Open Tickets', value: '3', change: '+1', trend: 'down' },
]

export const chartData = [
  { time: '00:00', devices: 8, alerts: 2, traffic: 45 },
  { time: '02:00', devices: 8, alerts: 1, traffic: 52 },
  { time: '04:00', devices: 8, alerts: 3, traffic: 48 },
  { time: '06:00', devices: 8, alerts: 2, traffic: 61 },
  { time: '08:00', devices: 8, alerts: 4, traffic: 55 },
  { time: '10:00', devices: 8, alerts: 2, traffic: 67 },
  { time: '12:00', devices: 8, alerts: 1, traffic: 72 },
  { time: '14:00', devices: 8, alerts: 3, traffic: 68 },
  { time: '16:00', devices: 8, alerts: 2, traffic: 75 },
  { time: '18:00', devices: 8, alerts: 5, traffic: 79 },
  { time: '20:00', devices: 7, alerts: 3, traffic: 71 },
  { time: '22:00', devices: 7, alerts: 2, traffic: 58 },
]

export const deviceTypeData = [
  { name: 'Router', value: 2 },
  { name: 'Switch', value: 2 },
  { name: 'Firewall', value: 1 },
  { name: 'Access Point', value: 3 },
]

export const topologyData = {
  nodes: [
    { id: '1', label: 'Internet', type: 'external' },
    { id: '2', label: 'Core Router 1', type: 'router', status: 'online' },
    { id: '3', label: 'Core Router 2', type: 'router', status: 'online' },
    { id: '4', label: 'Firewall 1', type: 'firewall', status: 'online' },
    { id: '5', label: 'Switch 1', type: 'switch', status: 'online' },
    { id: '6', label: 'Switch 2', type: 'switch', status: 'online' },
    { id: '7', label: 'AP-101', type: 'ap', status: 'offline' },
    { id: '8', label: 'AP-102', type: 'ap', status: 'online' },
    { id: '9', label: 'AP-103', type: 'ap', status: 'online' },
  ],
  edges: [
    { from: '1', to: '2' },
    { from: '1', to: '3' },
    { from: '2', to: '4' },
    { from: '3', to: '4' },
    { from: '4', to: '5' },
    { from: '4', to: '6' },
    { from: '5', to: '7' },
    { from: '5', to: '8' },
    { from: '6', to: '9' },
  ],
}

export const uptimeData = [
  { device: 'Core Router 1', month: 'Jan', uptime: 99.9 },
  { device: 'Core Router 1', month: 'Feb', uptime: 99.8 },
  { device: 'Core Router 1', month: 'Mar', uptime: 99.95 },
  { device: 'Core Router 2', month: 'Jan', uptime: 99.7 },
  { device: 'Core Router 2', month: 'Feb', uptime: 99.8 },
  { device: 'Core Router 2', month: 'Mar', uptime: 99.85 },
  { device: 'Firewall 1', month: 'Jan', uptime: 99.95 },
  { device: 'Firewall 1', month: 'Feb', uptime: 99.92 },
  { device: 'Firewall 1', month: 'Mar', uptime: 99.93 },
]
