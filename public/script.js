const socket = io('http://localhost:3000')
const messageContaner = document.getElementById('message-contaner');
const back = document.getElementById('back');
const roomContaner = document.getElementById('room-contaner');
const messageForm = document.getElementById('send-message-form')
const messageInput = document.getElementById('message-input')

if (messageForm != null) {
	const name = prompt('What is your name?')
	appendMessage('You Joined')
	socket.emit('new-user', roomName, name);

	messageForm.addEventListener('submit', e => {
		e.preventDefault()
		let message = messageInput.value
		appendMessage(`You: ${message}`);
		socket.emit('send-chat-message', roomName, message)
		messageInput.value = '';
	});

	back.addEventListener('click', e => {
		socket.emit('leave')
	});

}

socket.on('redirect', function(destination) {
    window.location.href = destination;
});

socket.on('room-created', room => {
	const roomElemet = document.createElement('div')
	roomElemet.innerText = room
	const roomLink = document.createElement('a')
	roomLink.href = `/${room}`
	roomLink.innerText = 'join'
	roomLink.className = "waves-effect waves-light btn"
	roomContaner.append(roomElemet)
	roomContaner.append(roomLink)
})

socket.on('chat-message', data => {
	appendMessage(`${data.name}: ${data.message}`);
});

socket.on('user-joined', name => {
	appendMessage(`${name} joined!`);
});

socket.on('user-leave', name => {
	appendMessage(`${name} left.`);
});


function appendMessage(message) {
	const messageElement = document.createElement('div');
	messageElement.innerText = message;
	messageContaner.append(messageElement)

}