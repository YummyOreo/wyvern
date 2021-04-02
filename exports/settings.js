exports.slowmodeExport = (rooms, room, slowmodeValue, socket) => {
	rooms[room].slowmode = slowmodeValue;
	socket.to(room).emit('changed-slowmode', slowmodeValue)
}

exports.deleteExport = (rooms, room, socket) => {
	for(id in rooms[room].users){
			socket.to(id).emit('redirect', '/')
		}
	delete rooms[room];
}