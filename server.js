const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

app.set('views', './views')
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({ exteneded: true }))

const rooms = {}

app.get('/', (req, res) => {
	res.render('index', { rooms: rooms })
})

app.post('/room', (req, res) => {
	if (rooms[req.body.room] != null){
		return res.redirect('/')
	}
	rooms[req.body.room] = { users: {}}
	res.redirect(req.body.room)
	io.emit('room-created', req.body.room)
})

app.get('/:room', (req, res) => {
	if (rooms[req.params.room] == null) {
		return res.redirect('/')
	}
	res.render('room', { roomName: req.params.room })
})

server.listen(5500)

io.on('connection', socket => {
	socket.on('new-user', (room, name) => {
		if (name == null) name = 'Guest'
		socket.join(room)
		rooms[room].users[socket.id] = name;
		socket.to(room).broadcast.emit('user-joined', name)
	})
	socket.on('send-chat-message', (room, message) => {
		name = rooms[room].users[socket.id]
		if (name == null) name = 'Guest'
		socket.to(room).broadcast.emit('chat-message', { message: message, name: name });
	})
	socket.on('disconnect', () => {
		getUserRooms(socket).forEach(room => {
			name = rooms[room].users[socket.id]
			if (name == null) name = 'Guest'
			socket.to(room).broadcast.emit('user-leave', name)
			delete rooms[room].users[socket.id]
		})
	})
	socket.on('leave', () => {
		getUserRooms(socket).forEach(room => {
			name = rooms[room].users[socket.id]
			if (name == null) name = 'Guest'
			socket.to(room).broadcast.emit('user-leave', name)
			delete rooms[room].users[socket.id]
			socket.emit('redirect', '/');

		})
	})
})

function getUserRooms(soket) {
	return Object.entries(rooms).reduce((names, [name, room]) => {
		if (room.users[soket.id] != null) names.push(name)
			return names;
	}, [])
}