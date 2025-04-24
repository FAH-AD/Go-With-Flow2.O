import io from 'socket.io-client';

const socket = io('http://localhost:5000'); // or whatever your backend URL is

export default socket;