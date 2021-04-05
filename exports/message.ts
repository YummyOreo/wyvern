exports.messgaeSendExport = (slowmode, rooms, socket, message, room) => {
	//checks if the user has sent a message after slowmode
	let user;
	if (slowmode == rooms[room].slowmode){
		if (socket.id == rooms[room].owner){

		}else {
			socket.emit('system', `You can send a message every ${rooms[room].slowmode} second`)
			return;
		}
	}
	//sets the name var
	let name = rooms[room].users[socket.id]
	//if its Null make it not
	if (name == null) name = 'Guest'
	//if owner, they can accese commands
	
	if (message.startsWith('!')){
		const [command, ...args] = message
		.trim()
		.substring('!'.length)
		.split(/\s+/);
		if (command === "kick"){
			if (socket.id != rooms[room].owner) {
				socket.emit('system', `You do not have accese to commands`);
				return;
			}
			let kickName = args.slice(0).join(" ");
			console.log(kickName)
			for (user in rooms[room].users) {
				if (rooms[room].users[user] == kickName) {
					socket.to(user).emit('kicked')
					socket.emit('system', `${kickName} has been kicked!`)
					return;
				}
			}
			socket.emit('system', `${kickName} is not in this room.`)
			return;
		} else if (command === 'dm'){
			let dmName = args.slice(0).join(" ");
			dmName = dmName.replace("-n ", "");
			dmName = dmName.substr(0, dmName.indexOf(' -m '));
			let messageDM = message.split(' -m ').pop();
			console.log(messageDM)
//			messageDM = messageDM[0].substr(args.indexOf(' (') + 1);
//			messageDM = messageDM[0].replace("(", "");
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
		} else if (command == 'dm-toggle'){
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
		} else if (command === 'mute'){
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
		} else if (command === 'unmute'){
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
		} else if (command === 'help'){
			socket.emit('system', `Commands \n !kick <user_name> (kicks the user, owner only) \n !mute/unmute <user> (mutes and unmutes a user, owner only) \n !help (Shows this message) \n !dm -n <user> -m <message> (dms a user) \n !dm-toggle (toggle your dms)`)
			return;
		} else if (command === 'slowmode'){
			if (socket.id != rooms[room].owner) {
				socket.emit('system', `You do not have accese to commands`);
				return;
			}
		} else if (command === 'name'){

		} else if (command === 'privacy-toggle'){
			if (socket.id != rooms[room].owner) {
				socket.emit('system', `You do not have accese to commands`);
				return;
			}
		} else if (command == 'change-name'){
			if (socket.id != rooms[room].owner) {
				socket.emit('system', `You do not have accese to commands`);
				return;
			}
		}
	}
	//sends the message
	socket.to(room).emit('chat-message', { message: message, name: name });
	socket.emit('chat-message', { message: message, name: name });
	//sets the slowmode
	return slowmode
}
/* 

Template for owner only commands:
else if (command === 'COMMAND NAME'){
	if (socket.id != rooms[room].owner) {
		socket.emit('system', `You do not have accese to commands`);
		return;
	}
	let COMMANDNAME + Name = args.slice(0).join(" ");
	console.log(COMMANDNAME + Name)
	for (user in rooms[room].users) {
		if (rooms[room].users[user] == COMMANDNAME + Name) {
			socket.to(user).emit('EMIT MESSAGE')
			socket.emit('system', `${COMMANDNAME + Name} has been muted!`)
			return;
		}
	}
	socket.emit('system', `${COMMANDNAME + Name} is not in this room.`)
	return;
}

*/