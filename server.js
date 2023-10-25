const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app)
const io = socketio(server);

// set static files
app.use(express.static(path.join(__dirname, 'public')));

// run when client connects
io.on('connection', socket => {
  
  // Welcome current user
  socket.emit('message', 'Welcome to chatcord');

  //broadcast when user connects 
  socket.broadcast.emit('message', 'A user has joined the chat ');

  // runs when client disconnects
  socket.on('disconnect', () => {
    io.emit('message', 'A user has left the chat');
  });
});

const PORT = 5000 || process.env.PORT;

server.listen(PORT, (req, res) => {
  console.log('server running on localhost at port 5000')
});
