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
	console.log(req.body.private + '/room')
	rooms[req.body.room] = { users: {}, public: req.body.private, owner: false }
	res.redirect(req.body.room + '/owner')
	io.emit('room-created', req.body.room)
})

app.get('/:room', (req, res) => {
	if (rooms[req.params.room] == null) {
		return res.render('error')
	}

	res.render('room', { roomName: req.params.room, owner: false })
})

app.get('/:room/settings', (req, res) => {
	if (rooms[req.params.room] == null) {
		return res.render('error')
	}
	console.log(req.params.room)
	res.render('settings', { roomName: req.params.room, rooms: rooms })
})

app.get('/:room/owner', (req, res) => {
	if (rooms[req.params.room] == null) {
		return res.render('error')
	}
	console.log(req.params.room)
	res.render('room', { roomName: req.params.room, owner: true })
})

server.listen(3000)

io.on('connection', socket => {
	socket.on("check-name", (name, room) => {
		for (id in rooms[room].users){
			if (rooms[room].users[id] == name && id != socket.id) return socket.emit('sendback-name', false);
		} 
		socket.emit('sendback-name', true)
	})
	socket.on('new-owner', room => {
		sendBack = false;
		if (rooms[room].owner == null){
			sendBack = true;
			rooms[room].owner = socket.id;
		}
		socket.emit('owner-sendback', sendBack);
	})
	socket.on('new-user', (room, name) => {
		if (name == null) name = 'Guest'
		socket.join(room)
		rooms[room].users[socket.id] = name;
		console.log(rooms[room].users)
		socket.to(room).broadcast.emit('user-joined', name)
		for (user in rooms[room].users){
			socket.to(room).emit("user-list", rooms[room].users[user])
			socket.emit("user-list", rooms[room].users[user])
		}
	})
	socket.on('send-chat-message', (room, message) => {
		name = rooms[room].users[socket.id]
		if (name == null) name = 'Guest'
		if (socket.id == rooms[room].owner) {
			if (message.startsWith('!')){
				const [command, ...args] = message
				.trim()
				.substring('!'.length)
				.split(/\s+/);
				if (command === "kick"){
					let kickName = args.slice(0).join(" ");
					console.log(kickName)
					for (user in rooms[room].users) {
						if (rooms[room].users[user] == kickName) {
							socket.to(user).emit('kicked', name)
							socket.emit('kick-success', `${kickName} has been kicked!`)
							return;
						}
					}
					socket.emit('kick-success', `${kickName} is not in this room.`)
					return;
				}
			}
		}
		socket.to(room).broadcast.emit('chat-message', { message: message, name: name });
	})
	socket.on('disconnect', () => {
		getUserRooms(socket).forEach(room => {
			name = rooms[room].users[socket.id]
			if (name == null) name = 'Guest'
			socket.to(room).broadcast.emit('user-leave', name)
			if (socket.id == rooms[room].owner) rooms[room].owner = null;
			delete rooms[room].users[socket.id]
		})
	})
	socket.on('leave', () => {
		getUserRooms(socket).forEach(room => {
			name = rooms[room].users[socket.id]
			if (name == null) name = 'Guest'
			socket.to(room).broadcast.emit('user-leave', name)
			if (socket.id == rooms[room].owner) rooms[room].owner = null;
			delete rooms[room].users[socket.id]
			socket.emit('redirect', '/');

		})
	})
	socket.on('name-chage', (room, name) => {
		rooms[room].users[socket.id] = name;
		socket.to(room).emit("user-changed-name")
		socket.emit("user-changed-name")
		for (user in rooms[room].users){
			socket.to(room).emit("user-list", rooms[room].users[user])
			socket.emit("user-list", rooms[room].users[user])
		}
	})
	socket.on('privacy-change', (room, value) => {
		rooms[room].public = value;
	})
})

function getUserRooms(soket) {
	return Object.entries(rooms).reduce((names, [name, room]) => {
		if (room.users[soket.id] != null) names.push(name)
			return names;
	}, [])
}