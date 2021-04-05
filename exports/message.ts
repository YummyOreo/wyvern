const { kickCommand, dmCommand, dmToggle, muteCommand, unmuteCommand, slowmodeCommand } = require('./commands.js')
const { checkNameExportServer } = require('./checks.js')

const help = 'Commands \n !kick <user_name> (kicks the user, owner only) \n !mute/unmute <user> (mutes and unmutes a user, owner only) \n !help (Shows this message) \n !dm -n <user> -m <message> (dms a user) \n !dm-toggle (toggle your dms) \n !name <new name> (changes your name)'

exports.messgaeSendExport = (slowmode, rooms, socket, message, room, checkNameExport) => {
	//checks if the user has sent a message after slowmode
	let user;
	if (slowmode == rooms[room].slowmode){
		if (socket.id == rooms[room].owner){

		} else {
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
			kickCommand(rooms, room, args, socket, user)
			return;
		} else if (command === 'dm'){
			dmCommand(args, message, user, rooms, room, socket)
			return;
		} else if (command == 'dm-toggle'){
			dmToggle(rooms, room, socket)
			return;
		} else if (command === 'mute'){
			muteCommand(socket, rooms, room, args, user, name);
			return;
		} else if (command === 'unmute'){
			unmuteCommand(socket, rooms, room, args, user, name);
			return;
		} else if (command === 'help'){
			socket.emit('system', help)
			return;
		} else if (command === 'slowmode'){
			slowmodeCommand(socket, rooms, room);
			return;
		} else if (command === 'name'){
			let newName = args.slice(0).join(" ");
			let result = checkNameExportServer(newName, room, rooms, socket)
			if (result == false){
				socket.emit('system', `Name has been used, try again`);
				return
			}
			let user;
			console.log(rooms[room].users)
			rooms[room].users[socket.id] = newName;
			console.log(rooms[room].users)
			socket.to(room).emit("user-changed-name")
			socket.emit("user-changed-name")
			for (user in rooms[room].users){
				socket.to(room).emit("user-list", rooms[room].users[user])
				socket.emit("user-list", rooms[room].users[user])
			}
			socket.emit('system', `Name has been changed to ${newName}`);
			return
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