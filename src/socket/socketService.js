import io from 'socket.io-client';

const SOCKET_URL = 'http://localhost:8888';

const socket = io(SOCKET_URL, {
  transports: ['websocket'], // Explicitly specifying WebSocket transport
  reconnectionAttempts: 3,
  timeout: 10000,
  extraHeaders: {
    Authorization: `Bearer ${localStorage.getItem('access-token')}`
  }
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
  console.log('Subscribing to notifications');
  socket.on('server-send-notification', (notification) => {
    console.log('Notification received:', notification);
    cb(notification);
  });
};

export const subscribeToError = (cb) => {
  console.log('Subscribing to error messages');
  socket.on('server-send-error-message', (error) => {
    console.error('Error received:', error);
    cb(error);
  });
};

export default socket;
