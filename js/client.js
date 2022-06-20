const socket = io('http://localhost:8000');

// Get DOM elements in respective Js variables
const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp');
const messageContainer = document.querySelector(".container");

// Audio that will play on receiving messages
var audio = new Audio('assets/ting.mp3');

// Function which will append event info to the container
const append = (message, position)=>{
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);

    messageContainer.append(messageElement);
    if(position =='left'){ 
        audio.play();
    }
}

// Function which will append event info to the container in the center
const appendCenter = (message, position)=>{
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageElement.classList.add('join');
    messageContainer.append(messageElement);
    if(position =='left'){ 
        audio.play();
    }
}


// Ask new user for his/her name and let the server know
let name = 't';
if (/Mobi|Android/i.test(navigator.userAgent)) {
    let input = document.getElementById('name');
    input.classList.remove('hide');
    let nameBtn = document.getElementById('nameBtn');
    nameBtn.classList.remove('hide');
}else{
    name = prompt("Enter your username to join");
    socket.emit('new-user-joined', name);
}

// Adding a event listener on button to remove it after getting name
let nameBtn = document.getElementById('nameBtn');
nameBtn.addEventListener('click', remove);

function remove(){
    let input = document.getElementById('name');
    input.classList.add('hide');
    nameBtn.classList.add('hide');
    name = document.getElementById('name').value;
    socket.emit('new-user-joined', name);
}

// If a new user joins, receive his/her name from the server
socket.on('user-joined', name =>{
    appendCenter(`${name} joined the chat`, 'right');
})

// If server sends a message, receive it
socket.on('receive', data =>{
    append(`${data.name}: ${data.message}`, 'left');
})

// If a user leaves the chat, append the info to the container
socket.on('left', name =>{
    appendCenter(`${name} left the chat`, 'right');
})

// If the form gets submitted, send server the message
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = messageInput.value;
    append(`You: ${message}`, 'right');
    socket.emit('send', message);
    messageInput.value = '';
})