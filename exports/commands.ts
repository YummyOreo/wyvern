//comming soon
//kick command
exports.kickCommand = (rooms, room, args, socket, user) => {
	//checks if owner
	if (socket.id != rooms[room].owner) {
		socket.emit('system', `You do not have accese to commands`);
		return;
	}
	//gets the name
	let kickName = args.slice(0).join(" ");
	console.log(kickName)
	//gets the id
	for (user in rooms[room].users) {
		if (rooms[room].users[user] == kickName) {
			//sends them that there kicked
			socket.to(user).emit('kicked')
			socket.emit('system', `${kickName} has been kicked!`)
			return;
		}
	}
	//says there not in the room if it cant get the user
	socket.emit('system', `${kickName} is not in this room. Try copying and pasting as its case sensitive.`)
	return;
}