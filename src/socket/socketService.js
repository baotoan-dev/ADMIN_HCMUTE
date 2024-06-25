import io from 'socket.io-client';

const SOCKET_URL = 'http://localhost:3000';

export const socket = io(SOCKET_URL, {
  transports: ['websocket'],
  reconnectionAttempts: 3,
  timeout: 10000,
});

socket.on('connect', () => {
  console.log('Connected to server');
});

socket.on('connect_error', (err) => {
  console.error('Connection error:', err);
});

socket.on('disconnect', (reason) => {
  console.log('Disconnected:', reason);
});

export const subscribeToNotification = (cb) => {
  socket.on('server-send-notification', (notification) => {
    console.log('Notification received:', notification);
    cb(notification);
  });
};

export const subscribeToError = (cb) => {
  socket.on('server-send-error-message', (error) => {
    console.error('Error received:', error);
    cb(error);
  });
};

export default socket;
