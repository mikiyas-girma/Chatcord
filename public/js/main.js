const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users')

// get username and room from url

const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true
});

console.log(username, room)

const socket = io();

// join chat room
socket.emit('joinRoom', { username, room});

// get room and users
socket.on('roomUsers', ({ room, users}) => {
  outputRoomName(room);
  outputUsers(users);
});

// Message from server
socket.on('message', message => {
  console.log(message);
  outputMessage(message);

  chatMessages.scrollTop = chatMessages.scrollHeight;
});

// message submit
chatForm.addEventListener('submit', e => {
  e.preventDefault();

  const msg = e.target.elements.msg.value;

  // Emit message to server
  socket.emit('chatMessage', msg);

  // clear input field for messages
  e.target.elements.msg.value = '';
  e.target.elements.msg.focus();

});


// output message to DOM
function outputMessage(message) {
  const div = document.createElement('div');
  div.classList.add('message');
  div.innerHTML = ` <p class="meta">${message.username}<span> ${message.time } </span></p>
                    <p class="text"> ${message.text}</p>`

  document.querySelector('.chat-messages').appendChild(div);
}

// add room name to the dom

function outputRoomName(room) {
  roomName.innerText = room;
}

// add user to userList

function outputUsers(users) {
  userList.innerHTML = `
    ${users.map(user => `<li>${user.username}</li>`).join('')}
  `;
}