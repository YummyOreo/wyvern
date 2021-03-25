const socket = io('http://localhost:3000')
const messageContaner = document.getElementById('message-contaner');
const back = document.getElementById('back');
const nameChange = document.getElementById('name');
const roomContaner = document.getElementById('room-contaner');
const userContaner = document.getElementById('user-contaner');
const messageForm = document.getElementById('send-message-form')
const messageInput = document.getElementById('message-input')

if (messageForm != null) {
	let name = prompt('What is your name?')
	appendMessage('You Joined', "join")
	socket.emit('new-user', roomName, name);

	nameChange.addEventListener('click', function() {
		name = prompt('What is your new name?')
		socket.emit('name-chage', roomName, name)
	})

	messageForm.addEventListener('submit', e => {
		console.log(name)
		e.preventDefault()
		let message = messageInput.value
		appendMessage(`You: ${message}`, "you");
		socket.emit('send-chat-message', roomName, message)
		messageInput.value = '';
	});

	back.addEventListener('click', e => {
		console.log('clicked')
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

socket.on('userList', data => {
	for(id in data) {
		console.log(id)
	}
});

socket.on('chat-message', data => {
	appendMessage(`${data.name}: ${data.message}`, "message");
});

socket.on('user-joined', UserName => {
	if (UserName == name) return;
	userContaner.innerText = ''

	var headerList = document.createElement("p");
	var text = document.createTextNode('Members In ' + roomName);
	headerList.appendChild(text);
	userContaner.appendChild(headerList);

	appendMessage(`${UserName} joined!`, "join");
});

socket.on('user-leave', UserName => {
	if (UserName == name) return;
	const deleteElement = document.getElementById(UserName);
	deleteElement.remove();
	messageContaner.append(deleteElement)
	appendMessage(`${UserName} left.`, 'left');
});

socket.on('user-list', UserName => {
	const listElement = document.createElement('p');
	listElement.innerText = UserName;
	listElement.id = UserName
	userContaner.append(listElement)
});


function appendMessage(message, type) {
	const messageElement = document.createElement('div');
	messageElement.innerText = message;
	if (type == 'left'){
		messageElement.className = ""
	} else if (type == 'join'){
		messageElement.className = ""
	} else if (type == 'message'){
		messageElement.className = "white"
	} else if (type == 'you'){
		messageElement.className = "grey lighten-2"
	}
	messageContaner.append(messageElement)
}