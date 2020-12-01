const express = require('express');
const path = require('path');
const socket = require('socket.io');



const app = express();

const messages = [];
let users = [];

const server = app.listen(8000, () => {
  console.log('Server is running on Port:', 8000)
});

const io = socket(server);

io.on('connection', (socket) => {
  console.log('New client! Its id – ' + socket.id);
  
  socket.on('login', (payload) => {
    users.push({
      id: socket.id,
      name: payload.name,
    });
  socket.broadcast.emit('newUser', payload.name)
  })
  

  socket.on('message', (payload ) => { 
  console.log('Oh, I\'ve got something from ' + socket.id) 
  socket.broadcast.emit ('message', {
    author: payload.author,
    content: payload.content
  })  
  });
  console.log('I\'ve added a listener on message event \n');
  
  socket.on('disconnect', () => {
    console.log('Oh, socket' + socket.id + 'has left the conversation', users)
    offUser = users.find(user => user.id === socket.id);

    if(offUser) {
      users = users.filter(user => user.id !== socket.id);
      console.log(offUser, users);
      socket.broadcast.emit('removeUser', offUser.name + 'has just left the conversation')
    }
  });

});

app.use(express.static(path.join(__dirname, '/client')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/client/index.html'));
  });


 