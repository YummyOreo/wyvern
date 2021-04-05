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
//dm command
exports.dmCommand = (args, message, user, rooms, room, socket) => {
	let dmName = args.slice(0).join(" ");
	dmName = dmName.replace("-n ", "");
	dmName = dmName.substr(0, dmName.indexOf(' -m '));
	let messageDM = message.split(' -m ').pop();
	console.log(messageDM)
//	messageDM = messageDM[0].substr(args.indexOf(' (') + 1);
//	messageDM = messageDM[0].replace("(", "");
	console.log(messageDM)
	console.log(dmName)
	for (user in rooms[room].users) {
		if (rooms[room].users[user] == dmName) {
			if (rooms[room].dm.includes(user) && rooms[room].owner != socket.id){
				socket.emit('system', `${dmName} has their dms turned off.`)
				return;
			}
			socket.to(user).emit('dm', {user: rooms[room].users[socket.id], message: messageDM})
			socket.emit('dm', {user: rooms[room].users[socket.id], message: messageDM})
			return;
		}
	}
	socket.emit('system', `${dmName} is not in this room.`)
	return;
}

exports.dmToggle = (rooms, room, socket) => {
	if (rooms[room].dm.includes(socket.id)){
		var index = rooms[room].dm.indexOf(socket.id);
		if (index > -1) {
			rooms[room].dm.splice(index, 1);
		}
		socket.emit('system', `Successfully enabled Dms`)
	}else {
		rooms[room].dm.push(socket.id);
		socket.emit('system', `Successfully disabled Dms`)
	}
	return;
}

exports.muteCommand = (socket, rooms, room, args, user, name) => {
	if (socket.id != rooms[room].owner) {
		socket.emit('system', `You do not have accese to commands`);
		return;
	}
	let muteName = args.slice(0).join(" ");
	console.log(muteName)
	for (user in rooms[room].users) {
		if (rooms[room].users[user] == muteName) {
			socket.to(user).emit('mute', name, true)
			socket.emit('system', `${muteName} has been muted!`)
			return;
		}
	}
	socket.emit('system', `${muteName} is not in this room.`)
	return;
}

exports.unmuteCommand = (socket, rooms, room, args, user, name) => {
	if (socket.id != rooms[room].owner) {
		socket.emit('system', `You do not have accese to commands`);
		return;
	}
	let muteName = args.slice(0).join(" ");
	console.log(muteName)
	for (user in rooms[room].users) {
		if (rooms[room].users[user] == muteName) {
			socket.to(user).emit('mute', name, false)
			socket.emit('system', `${muteName} has been unmuted!`)
			return;
		}
	}
	socket.emit('system', `${muteName} is not in this room.`)
	return;
}

exports.slowmodeCommand = (socket, rooms, room) => {
	if (socket.id != rooms[room].owner) {
		socket.emit('system', `You do not have accese to commands`);
		return;
	}
}