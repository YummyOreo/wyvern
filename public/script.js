const socket = io('http://localhost:3000')
const messageContaner = document.getElementById('message-contaner');
const back = document.getElementById('back');
const nameChange = document.getElementById('name');
const roomContaner = document.getElementById('room-contaner');
const userContaner = document.getElementById('user-contaner');
const messageForm = document.getElementById('send-message-form')
const messageInput = document.getElementById('message-input')
const settings = document.getElementById('settings')
//start
if (messageForm != null) {
	let name = prompt('What is your name?')
	socket.emit('check-name', name, roomName)
	socket.on('sendback-name', status => {
		if (status == false) {
			name = prompt('Name Taken, Whats your new name?')
			socket.emit('check-name', name, roomName)
			return
		}
		var d = new Date();
		hours = d.getHours();
		minutes = d.getMinutes();
		appendMessage(name, ' Joined', "join", hours, minutes)
		socket.emit('new-user', roomName, name);

	})

	nameChange.addEventListener('click', function() {
		name = prompt('What is your new name?')
		if (name == '') return;
		socket.emit('name-chage', roomName, name)
	})

	messageForm.addEventListener('submit', e => {
		console.log(name)
		e.preventDefault()
		let message = messageInput.value
		var d = new Date();
		hours = d.getHours();
		minutes = d.getMinutes();
		appendMessage(`${name}`, `${message}`, "you", hours, minutes);
		socket.emit('send-chat-message', roomName, message)
		messageInput.value = '';
	});

	back.addEventListener('click', e => {
		console.log('clicked')
		socket.emit('leave')
	});
	if (settings != null){
		settings.addEventListener('click', e => {
			console.log('clicked')
			window.location.href = `/${roomName}` +'/settings'
		});
	}

}

socket.on('user-changed-name', () => {
	userContaner.innerText = ''
	var headerList = document.createElement("p");
	var text = document.createTextNode('Members In ' + roomName);
	headerList.appendChild(text);
	userContaner.appendChild(headerList);
})

socket.on('redirect', function(destination) {
    window.location.href = destination;
});

socket.on('room-created', (room, private) => {
	if (private == true){
		return
	}
	const roomElemet = document.createElement('div')
	roomElemet.innerText = room
	const roomLink = document.createElement('a')
	roomLink.href = `/${room}`
	roomLink.innerText = 'join'
	roomLink.className = "waves-effect waves-light btn"
	roomContaner.append(roomElemet)
	roomContaner.append(roomLink)
})

socket.on(`kicked`, () => {
	socket.emit('leave')
})

socket.on('kick-success', message => {
	var d = new Date();
	hours = d.getHours();
	minutes = d.getMinutes();
	appendMessage(`System`, `${message}`, "system", hours, minutes);
})

socket.on('userList', data => {
	for(id in data) {
		console.log(id)
	}
});

socket.on('chat-message', data => {
	var d = new Date();
	hours = d.getHours();
	minutes = d.getMinutes();
	appendMessage(data.name, `${data.message}`, "message", hours, minutes);
});

socket.on('user-joined', UserName => {
	if (UserName == name) return;
	userContaner.innerText = ''

	var headerList = document.createElement("p");
	var text = document.createTextNode('Members In ' + roomName);
	headerList.appendChild(text);
	userContaner.appendChild(headerList);
	var d = new Date();
	hours = d.getHours();
	minutes = d.getMinutes();
	appendMessage(UserName, `joined!`, "join", hours, minutes);
});

socket.on('user-leave', UserName => {
	if (UserName == name) return;
	const deleteElement = document.getElementById(UserName);
	deleteElement.remove();
	var d = new Date();
	hours = d.getHours();
	minutes = d.getMinutes();
	appendMessage(UserName, `left.`, 'left', hours, minutes);
});

socket.on('user-list', UserName => {
	const listElement = document.createElement('p');
	listElement.innerText = UserName;
	listElement.id = UserName
	userContaner.append(listElement)
});


function appendMessage(name, message, type, hours, minute) {
	const messageElement = document.createElement('div');
	const messageName = document.createElement('div');
	const br = document.createElement('br');
	messageElement.innerText = message;
	minute = minute.toString();
	console.log(minute.length)
	if (minute.length == 1){
		minute = '0' + minute;
	}
	messageName.innerText = `${name} | ${hours}:${minute}`;
	if (type == 'system'){
		messageElement.className = 'deep-purple'
		messageName.className = 'deep-purple'
	}
	messageContaner.append(messageName)
	messageContaner.append(messageElement)
	messageContaner.append(br)
}