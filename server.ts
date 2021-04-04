const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

const { slowmodeExport, deleteExport } = require('./exports/settings.js');
const { messgaeSendExport } = require('./exports/message.js');
const { checkNameExport } = require('./exports/checks.js');
const { newOwnerExport, newUserExport, userDisconnectExport, userLeaveExport, userNameChangeExport } = require('./exports/user.js');

app.set('views', './views')
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({ exteneded: true }))

const rooms = {}

function regenorate(): any {
	let min = Math.ceil(1);
  	let max = Math.floor(100000);
	let idReturn = Math.floor(Math.random() * (max - min) + min);
	let roomID
	if(rooms[roomID] != null){
		idReturn = regenorate()
	}
	return idReturn;
}

app.get('/', (req, res) => {
	res.render('index', { rooms: rooms })
})

app.get('/home', (req, res) => {
	res.render('index', { rooms: rooms })
})

app.post('/room', (req, res) => {
	console.log(req.body.private + '/room')
	let id = regenorate()
	rooms[id] = { users: {}, public: req.body.private, owner: null, slowmode: 1, dm: [], muted: [], name: req.body.room}
	res.redirect(id + '/owner')
	io.emit('room-created', req.body.room, id)
})

app.get('/:room', (req, res) => {
	if (rooms[req.params.room] == null) {
		return res.redirect('/')
	}

	res.render('room', { id: req.params.room, owner: false, roomName: rooms[req.params.room].name })
})

app.get('/:room/settings', (req, res) => {
	if (rooms[req.params.room] == null) {
		return res.redirect('/')
	}
	console.log(req.params.room)
	res.render('settings', { roomName: rooms[req.params.room].name, rooms: rooms, id: req.params.room })
})

app.get('/:room/owner', (req, res) => {
	if (rooms[req.params.room] == null) {
		return res.redirect('/')
	}
	console.log(req.params.room)
	res.render('room', { id: req.params.room, owner: true, roomName: rooms[req.params.room].name })
})

app.get('/home/rooms', (req, res) => {
	res.render('rooms', {rooms : rooms})
})

server.listen(3000)

io.on('connection', socket => {
	let slowmode = 0

	socket.on('slowmode-change', (room, slowmodeValue) => {
		slowmodeExport(rooms, room, slowmodeValue, socket)
	})

	socket.on('delete-room', room => {
		deleteExport(rooms, room, socket)
	})

	socket.on("check-name", (name, room) => {
		checkNameExport(name, room, rooms, socket)
	})

	socket.on('new-owner', room => {
		console.log(room)
		newOwnerExport(rooms, room, socket)
	})
	socket.on('new-user', (room, name) => {
		newUserExport(socket, rooms, room, name)
	})
	socket.on('send-chat-message', (room, message) => {
		slowmode = messgaeSendExport(slowmode, rooms, socket, message, room)
		slowmode = rooms[room].slowmode
		setTimeout(() => { slowmode = 0; }, rooms[room].slowmode * 1000);
	})
	socket.on('disconnect', () => {
		userDisconnectExport(socket, rooms)
	})
	socket.on('leave', () => {
		userLeaveExport(socket, rooms)
	})
	socket.on('name-chage', (room, name) => {
		userNameChangeExport(rooms, name, socket, room)
	})
	socket.on('privacy-change', (room, value) => {
		rooms[room].public = value;
	})
})