//func for when there is a slowmode change
exports.slowmodeExport = (rooms, room, slowmodeValue, socket) => {
	rooms[room].slowmode = slowmodeValue;
	socket.to(room).emit('changed-slowmode', slowmodeValue)
}
//func for when a room is deleted
exports.deleteExport = (rooms, room, socket) => {
	for(id in rooms[room].users){
			socket.to(id).emit('redirect', '/')
		}
	delete rooms[room];
}