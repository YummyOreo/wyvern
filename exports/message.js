exports.messgaeSendExport = (slowmode, rooms, socket, message, room) => {
	//checks if the user has sent a message after slowmode
	if (slowmode == rooms[room].slowmode){
		if (socket.id == rooms[room].owner){

		}else {
			socket.emit('kick-success', `You can send a message every ${rooms[room].slowmode} second`)
			return;
		}
	}
	//sets the name var
	name = rooms[room].users[socket.id]
	//if its Null make it not
	if (name == null) name = 'Guest'
	//if owner, they can accese commands
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
	//sends the message
	socket.to(room).emit('chat-message', { message: message, name: name });
	socket.emit('chat-message', { message: message, name: name });
	//sets the slowmode
	slowmode = rooms[room].slowmode
	setTimeout(() => { slowmode = 0; }, rooms[room].slowmode * 1000);
}