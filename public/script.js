const socket = io('http://localhost:3000')
const messageContaner = document.getElementById('message-contaner');
const back = document.getElementById('back');
const roomContaner = document.getElementById('room-contaner');
const userContaner = document.getElementById('user-contaner');
const messageForm = document.getElementById('send-message-form')
const messageInput = document.getElementById('message-input')
const nameInput = document.getElementById('name-input')

if (messageForm != null) {
	const name = prompt('What is your name?')
	appendMessage('You Joined')
	socket.emit('new-user', roomName, name);

	messageForm.addEventListener('submit', e => {
		e.preventDefault()
		let message = messageInput.value
		if (nameInput != null){
			let userName = nameInput.value
			if (userName != '' && userName != name){
				console.log('yay')
				socket.emit('name-chage', userName)
			}
		}
		appendMessage(`You: ${message}`);
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
	appendMessage(`${data.name}: ${data.message}`);
});

socket.on('user-joined', UserName => {
	if (UserName == name) return;
	userContaner.innerText = ''

	var headerList = document.createElement("p");
	var text = document.createTextNode('Members In ' + roomName);
	headerList.appendChild(text);
	userContaner.appendChild(headerList);

	appendMessage(`${UserName} joined!`);
});

socket.on('user-leave', UserName => {
	if (UserName == name) return;
	const deleteElement = document.getElementById(UserName);
	deleteElement.remove();
	messageContaner.append(deleteElement)
	appendMessage(`${UserName} left.`);
});

socket.on('user-list', UserName => {
	const listElement = document.createElement('p');
	listElement.innerText = UserName;
	listElement.id = UserName
	userContaner.append(listElement)
});


function appendMessage(message) {
	const messageElement = document.createElement('p');
	messageElement.innerText = message;
	messageContaner.append(messageElement)
}