const loginForm = document.getElementById('welcome-form');
const messagesSection = document.getElementById('messages-section');
const messagesList = document.getElementById('messages-list');
const addMessageForm = document.getElementById('add-messages-form');
const userNameInput = document.getElementById('username');
const messageContentInput = document.getElementById('message-content');
messageContentInput.autocomplete = 'off';


const socket = io();
socket.on('message', ({ author, content }) => addMessage(author, content))

let userName;

const login = (event) => {
    event.preventDefault();
    if (userNameInput.value.length > 0) {
        userName = userNameInput.value;
        loginForm.classList.remove('show');
        messagesSection.classList.add('show');
    } else {
        alert('Please type your name')
    }
}

const sendMessage = (event) => {
    event.preventDefault();
    if(messageContentInput.value.length > 0) {
      addMessage(userName, messageContentInput.value);
      socket.emit('message', { author: userName, content: messageContent })
      messageContentInput.value = '';
    } else {
      alert('please type your message')
    }
  };

function addMessage(author, content) {
    const message = document.createElement('li');
    message.classList.add('message');
    message.classList.add('message--received');
    if(author === userName) message.classList.add('message--self');
    message.innerHTML = `
      <h3 class="message__author">${userName === author ? 'You' : author }</h3>
      <div class="message__content">
        ${content}
      </div>
    `;
    messagesList.appendChild(message);
  }

loginForm.addEventListener('submit', function (event) {
    login(event);
});

addMessageForm.addEventListener('submit', function (event) {
    sendMessage(event);
});