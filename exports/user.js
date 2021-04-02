function getUserRooms(soket, rooms) {
	return Object.entries(rooms).reduce((names, [name, room]) => {
		if (room.users[soket.id] != null) names.push(name)
			return names;
	}, [])
}

exports.newOwnerExport = (rooms, room, socket) => {
	sendBack = false;
	if (rooms[room].owner == null){
		sendBack = true;
		rooms[room].owner = socket.id;
	}
	socket.emit('owner-sendback', sendBack);
}

exports.newUserExport = (socket, rooms, room, name) => {
	if (name == null) name = 'Guest';
		socket.join(room)
		rooms[room].users[socket.id] = name;
		console.log(rooms[room].users)
		socket.to(room).broadcast.emit('user-joined', name)
		socket.emit('changed-slowmode', rooms[room].slowmode)
		for (user in rooms[room].users){
			socket.to(room).emit("user-list", rooms[room].users[user])
			socket.emit("user-list", rooms[room].users[user])
	}
}

exports.userDisconnectExport = (socket, rooms) => {
	getUserRooms(socket, rooms).forEach(room => {
		name = rooms[room].users[socket.id]
		if (name == null) name = 'Guest'
		socket.to(room).broadcast.emit('user-leave', name)
		if (socket.id == rooms[room].owner) rooms[room].owner = null;
		delete rooms[room].users[socket.id]
	})
}

exports.userLeaveExport = (socket, rooms) => {
	getUserRooms(socket, rooms).forEach(room => {
		name = rooms[room].users[socket.id]
		if (name == null) name = 'Guest'
		socket.to(room).broadcast.emit('user-leave', name)
		if (socket.id == rooms[room].owner) rooms[room].owner = null;
		delete rooms[room].users[socket.id]
		socket.emit('redirect', '/');

	})
}

exports.userNameChangeExport = (rooms, name, socket, room) => {
	rooms[room].users[socket.id] = name;
	socket.to(room).emit("user-changed-name")
	socket.emit("user-changed-name")
	for (user in rooms[room].users){
		socket.to(room).emit("user-list", rooms[room].users[user])
		socket.emit("user-list", rooms[room].users[user])
	}
}