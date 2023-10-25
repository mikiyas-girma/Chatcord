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
  console.log('new WS connection...');
})

const PORT = 5000 || process.env.PORT;

app.listen(PORT, (req, res) => {
  console.log('server running on localhost at port 5000')
});
