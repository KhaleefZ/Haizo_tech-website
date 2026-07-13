import { Server as SocketIOServer } from 'socket.io';
import { Server as HttpServer } from 'http';
import { verifyToken } from '../utils/jwt.utils';
import { config } from '../config/env';

let io: SocketIOServer;

export const initSockets = (server: HttpServer) => {
  io = new SocketIOServer(server, {
    cors: {
      origin: config.corsOrigins,
      methods: ['GET', 'POST']
    }
  });

  // Authentication Middleware for Sockets
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error('Authentication error: Token missing'));
    }

    const payload = verifyToken(token);
    if (!payload) {
      return next(new Error('Authentication error: Invalid token'));
    }

    // Attach user payload to socket
    (socket as any).user = payload;
    next();
  });

  io.on('connection', (socket) => {
    const user = (socket as any).user;
    console.log(`User connected: ${user.userId} (${user.role})`);

    // Auto-join a role-based room so we can target specific roles
    socket.join(`role_${user.role}`);
    // Also join a personal room for user-specific events
    socket.join(`user_${user.userId}`);

    socket.on('joinProject', (projectId: string) => {
      socket.join(`project_${projectId}`);
      console.log(`Socket joined room: project_${projectId}`);
    });

    socket.on('leaveProject', (projectId: string) => {
      socket.leave(`project_${projectId}`);
      console.log(`Socket left room: project_${projectId}`);
    });

    socket.on('disconnect', () => {
      console.log('User disconnected');
    });
  });
};

export const getIo = (): SocketIOServer => {
  if (!io) {
    throw new Error('Socket.io not initialized!');
  }
  return io;
};
