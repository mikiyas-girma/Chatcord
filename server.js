const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const formatMessages = require('./utils/messages');
const { userJoin, getCurrentUser, userLeave, getRoomUsers } = require('./utils/users');

const app = express();
const server = http.createServer(app)
const io = socketio(server);

// set static files
app.use(express.static(path.join(__dirname, 'public')));

const botName = 'chatCord bot'

// run when client connects
io.on('connection', (socket) => {

  socket.on('joinRoom', ({username, room}) => {

      // Welcome current user
      const user = userJoin(socket.id, username, room);
    
      socket.join(user.room);

  socket.emit('message', formatMessages(botName, 'Welcome to chatcord'));

  //broadcast when user connects 
  socket.broadcast
        .to(user.room)
        .emit(
        'message',
        formatMessages(botName, `${user.username} has joined the chat `));
  });

  
  // listen for chat messages
  socket.on('chatMessage', (msg) => {
    const user = getCurrentUser(socket.id)
    io.to(user.room).emit('message', formatMessages(user.username, msg));
  });
  // runs when client disconnects
  socket.on('disconnect', () => {
    const user = userLeave(socket.id);

    if(user) {
      io.to(user.room).emit(
        'message',
         formatMessages(botName, ` ${user.username} has left the chat`));

    // send users and room info
    io.to(user.room).emit("roomUsers", {
      room: user.room, 
      users: getRoomUsers(user.room)
    });
    }
  });

  });



const PORT = 5000 || process.env.PORT;

server.listen(PORT, (req, res) => {
  console.log('server running on localhost at port 5000')
});
