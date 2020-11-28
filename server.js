const express = require('express');
const path = require('path');
const socket = require('socket.io');



const app = express();

const messages = [];
const users = [];

const server = app.listen(8000, () => {
  console.log('Server is running on Port:', 8000)
});

const io = socket(server);

io.on('connection', (socket) => {
  console.log('New client! Its id – ' + socket.id);
  
  socket.on('join', (login, socket) => {
    users.push({
      id: socket.id,
      name: login.name,
    });
  socket.broadcast.emit('message', login.name + 'has joined the conversation')
  })
  

  socket.on('message', () => { 
  console.log('Oh, I\'ve got something from ' + socket.id) });
  console.log('I\'ve added a listener on message event \n');
  
  socket.on('disconnect', () => {
    console.log('Oh, socket' + socket.id +'has left the conversation')
    users = users.filter(user => user.id !== socket.id);
    offUser = users.find(user => user.id === socket.id);
    console.log(offUser, users);
    socket.broadcast.emit('removeUser', offUser.name + 'has just left the conversation')
  })

});

app.use(express.static(path.join(__dirname, '/client')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/client/index.html'));
  });


 