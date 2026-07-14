import http from 'http';
import app from './app';
import { config } from './config/env';
import { initSockets } from './sockets';

const server = http.createServer(app);

// Initialize Socket.io
initSockets(server);

server.listen(config.port, '127.0.0.1', () => {
  console.log(`Server is running on 127.0.0.1:${config.port}`);
});
