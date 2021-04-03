exports.checkNameExport = (name, room, rooms, socket) => {
	for (id in rooms[room].users){
		if (rooms[room].users[id] == name && id != socket.id) return socket.emit('sendback-name', false);
	} 
	socket.emit('sendback-name', true)
}