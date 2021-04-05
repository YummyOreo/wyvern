//gets all needed global vars setup
const socket = io('http://localhost:3000')
const messageContaner = document.getElementById('message-contaner')!;
const back = document.getElementById('back')!;
const nameChange = document.getElementById('name')!;
const userContaner = document.getElementById('user-contaner')!;
const messageForm = document.getElementById('send-message-form')!;
const messageInput = document.getElementById('message-input')! as HTMLInputElement;
const sendButton = document.getElementById('send-message')! as HTMLButtonElement;
const shareButton = document.getElementById('share')! as HTMLButtonElement;
let settings = document.getElementById('settings');
let name;
let userList = [];

//start
//not needed if statment

	
//if they are the owner
if (settings != null){
	console.log('owner')
	socket.emit('new-owner', id)
	socket.on("owner-sendback", results => {
		if (results == false && owner == true){
			window.location.href = `/${id}`
		}
	})
}

//gets there name
name = prompt('What is your name?')
socket.emit('check-name', name, id)
socket.on('sendback-name', status => {
	if (status == false) {
		name = prompt('Name Taken, Whats your new name?')
		socket.emit('check-name', name, id)
		return
	}
	var d = new Date();
	let hours = d.getHours();
	let minutes = d.getMinutes();
	appendMessage(name, ' Joined', "join", hours, minutes)
	socket.emit('new-user', id, name);

})

//when they want to change there name
nameChange.addEventListener('click', function() {
	let nameNew = prompt('What is your new name?')
	if (nameNew == '' || nameNew == null) return;
	socket.emit('check-name', nameNew, id)
	socket.on('sendback-name', status => {
		if (status == false) {
			nameNew = prompt('Name Taken, What is your new name?')
			if (nameNew == '' || nameNew == null) return;
			socket.emit('check-name', nameNew, id)
	}
	name = nameNew;
	socket.emit('name-chage', id, nameNew)
})
})

//When they send a message
messageForm.addEventListener('submit', e => {
	console.log(name)
	e.preventDefault()
	let message = messageInput.value
	var d = new Date();
	let hours = d.getHours();
	let minutes = d.getMinutes();
	socket.emit('send-chat-message', id, message)
	messageInput.value = '';
});

//when the clikc to go back to home
back.addEventListener('click', e => {
	console.log('clicked')
	socket.emit('leave')
});

//settings
if (settings != null){
	settings.addEventListener('click', function() {
		window.location.href = `/${id}/settings`
	})
}


/* 
this will not be covered due to the complexity of it.
it will be covered later
*/

socket.on('changed-slowmode', (newValue) => {
	document.getElementById('slowmode-show').innerText = `Slowmode: ${newValue}`;
})

socket.on('user-changed-name', () => {
	userList = []
	userContaner.innerText = ''
	var headerList = document.createElement("p");
	var text = document.createTextNode('Members In ' + roomName);
	headerList.appendChild(text);
	userContaner.appendChild(headerList);
})

socket.on('redirect', function(destination) {
    window.location.href = destination;
});

socket.on(`kicked`, () => {
	socket.emit('leave')
})

socket.on(`mute`, (ownerName, status) => {
	if (status == true){
		var d = new Date();
		let hours = d.getHours();
		let minutes = d.getMinutes();
		messageInput.disabled = true;
		messageInput.placeholder = 'Muted';
		sendButton.disabled = true;
		appendMessage(`System`, `${ownerName} has muted you!`, "system", hours, minutes);
	} else {
		var d = new Date();
		let hours = d.getHours();
		let minutes = d.getMinutes();
		messageInput.disabled = false;
		messageInput.placeholder = 'Message';
		sendButton.disabled = false;
		appendMessage(`System`, `${ownerName} has unmuted you!`, "system", hours, minutes);
	}
})

socket.on('system', message => {
	var d = new Date();
	let hours = d.getHours();
	let minutes = d.getMinutes();
	appendMessage(`System`, `${message}`, "system", hours, minutes);
})

socket.on('dm', ({user, message}) => {
	var d = new Date();
	let hours = d.getHours();
	let minutes = d.getMinutes();
	appendMessage(`${user}`, `${message}`, "dm", hours, minutes);
})

socket.on('chat-message', ({name, message}) => {
	let type = 'filler'
	var d = new Date();
	let hours = d.getHours();
	let minutes = d.getMinutes();
	if (message.includes(`@${name}`) || message.includes(`@everyone`) || message.includes(`@here`)){
		type = 'mention';
	}
	appendMessage(name, `${message}`, type, hours, minutes);
});

socket.on('user-joined', UserName => {
	userList = []
	if (UserName == name) return;
	userContaner.innerText = ''

	var headerList = document.createElement("p");
	var text = document.createTextNode('Members In ' + roomName);
	headerList.appendChild(text);
	userContaner.appendChild(headerList);
	var d = new Date();
	let hours = d.getHours();
	let minutes = d.getMinutes();
	appendMessage(UserName, `joined!`, "join", hours, minutes);
});

socket.on('user-leave', UserName => {
	if (UserName == name) return;
	const deleteElement = document.getElementById(UserName);
	deleteElement.remove();
	var d = new Date();
	let hours = d.getHours();
	let minutes = d.getMinutes();
	appendMessage(UserName, `left.`, 'left', hours, minutes);
});

socket.on('user-list', UserName => {
	userList.push(UserName)
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
	} else if (type == 'dm'){
		messageElement.className = 'red'
		messageName.className = 'red'
	} else if (type == 'mention'){
		messageElement.className = 'yellow'
		messageName.className = 'yellow'
	}
	messageContaner.append(messageName)
	messageContaner.append(messageElement)
	messageContaner.append(br)
	messageContaner.scrollTop = messageContaner.scrollHeight;
}