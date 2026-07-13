import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const getSocket = (): Socket | null => {
  if (typeof window === 'undefined') return null;
  
  const token = localStorage.getItem('token');
  if (!token) return null;

  // If socket exists but is disconnected, recreate it
  if (socket && socket.disconnected) {
    socket.removeAllListeners();
    socket = null;
  }
  
  if (!socket) {
    socket = io(`${process.env.NEXT_PUBLIC_API_URL}`, {
      auth: {
        token
      }
    });

    socket.on('connect_error', (err) => {
      console.error('Socket connection error:', err.message);
    });
  }
  
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
