const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();

const server = http.createServer(app);
server.listen(3001);

const io = new socketIo.Server(server, {
    cors: {
        origin: '*',
    },
});

module.exports = io;