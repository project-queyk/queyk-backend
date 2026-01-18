import { Server as HTTPServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';

let io: SocketIOServer;

export const initializeSocket = (server: HTTPServer) => {
  io = new SocketIOServer(server, {
    cors: {
      origin:
        process.env.NODE_ENV === 'production'
          ? [process.env.FRONTEND_APP_URL!]
          : [
              process.env.FRONTEND_APP_URL!,
              process.env.LOCALHOST_APP_URL ?? '',
            ],
      credentials: true,
    },
  });

  io.on('connection', (socket) => {
    socket.on('disconnect', () => {});
  });

  return io;
};

export const getIO = () => {
  return io || null;
};
