const express = require('express');
const app = express();
const http = require('http');
const path = require('path');
const socketio = require('socket.io');
const server = http.createServer(app);
const io = socketio(server);
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.get('/', (req, res) => {
    res.render('index');
});
io.on('connection', (socket) => {
    socket.on('send-location', (data) => {
        console.log(`Received location from user ${socket.id}: ${data.latitude}, ${data.longitude}`);
        io.emit('receive-location', { id: socket.id, latitude: data.latitude, longitude: data.longitude });
    });
    console.log('User connected');
    socket.on('disconnect', () => {
        io.emit('user-disconnected', socket.id)
    });
});
server.listen(8000, () => {
    console.log("Server running on http://localhost:8000");
});
