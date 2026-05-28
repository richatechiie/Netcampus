const { Server } = require('socket.io');

let io;

const connectedUsers = new Map();

const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: [
        process.env.CLIENT_URL,
        'http://localhost:3000',
        'http://localhost:5173',
      ],
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  io.on('connection', (socket) => {
    console.log(`Client connected: ${socket.id}`);

    // Store user info when they identify themselves
    socket.on('identify', (userData) => {
      connectedUsers.set(socket.id, {
        name: userData.name,
        role: userData.role,
        socketId: socket.id,
      });
      console.log(`User identified: ${userData.name} (${userData.role})`);

      // Broadcast updated online users list
      io.emit('online_users', Array.from(connectedUsers.values()));
    });

    socket.on('join_room', (room) => {
      socket.join(room);
      console.log(`Socket ${socket.id} joined room: ${room}`);
    });

    socket.on('disconnect', () => {
      const user = connectedUsers.get(socket.id);
      if (user) {
        console.log(`User disconnected: ${user.name}`);
        connectedUsers.delete(socket.id);
        io.emit('online_users', Array.from(connectedUsers.values()));
      }
      console.log(`Client disconnected: ${socket.id}`);
    });
  });

  return io;
};

const getIO = () => {
  if (!io) throw new Error('Socket.io not initialized');
  return io;
};

module.exports = { initSocket, getIO };