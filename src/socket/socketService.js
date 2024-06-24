import io from 'socket.io-client';

const SOCKET_URL = 'http://localhost:3000';

export const socket = io(SOCKET_URL);

export const subscribeToNotification = (cb) => {
    socket.on('server-send-notification', (notification) => {
        cb(notification);
    });
}

export const sendNotification = (notification) => {
    socket.emit('send-notification', notification);
}

export const subscribeToError = (cb) => {
    socket.on('server-send-error', (error) => {
        cb(error);
    });
}

export default socket;