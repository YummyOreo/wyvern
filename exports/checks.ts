//a check for if the name has been taken
exports.checkNameExport = (name, room, rooms, socket) => {
	let id;
	for (id in rooms[room].users){
		if (rooms[room].users[id] == name && id != socket.id) return socket.emit('sendback-name', false);
	} 
	socket.emit('sendback-name', true)
}

exports.checkNameExportServer = (name, room, rooms, socket) => {
	let id;
	for (id in rooms[room].users){
		if (rooms[room].users[id] == name && id != socket.id) return false;
	} 
	return true;
}