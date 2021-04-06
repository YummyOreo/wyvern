const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

const { slowmodeExport, deleteExport } = require('./exports/settings.js');
const { checkNameExport } = require('./exports/checks.js');
const { newOwnerExport, newUserExport, userDisconnectExport, userLeaveExport, userNameChangeExport, checkNameExportCommand } = require('./exports/user.js');

app.set('views', './views')
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))

const rooms = {}
const help = 'Commands \n !kick <user_name> (kicks the user, owner only) \n !mute/unmute <user> (mutes and unmutes a user, owner only) \n !slowmode <new value> (changed the slowmode, owner only) \n !help (Shows this message) \n !dm -n <user> -m <message> (dms a user) \n !dm-toggle (toggle your dms) \n !name <new name> (changes your name)'

function regenorate(): any {
	let min = Math.ceil(1);
  	let max = Math.floor(100000);
	let idReturn = Math.floor(Math.random() * (max - min) + min);
	if(rooms[idReturn] != null){
		idReturn = regenorate()
	}
	return idReturn;
}

app.get('/', (req, res) => {
	res.render('index', { rooms: rooms })
})

app.get('/home', (req, res) => {
	res.render('index', { rooms: rooms })
})

app.post('/room', (req, res) => {
	console.log(req.body.private + '/room')
	let id = regenorate()
	rooms[id] = { users: {}, public: req.body.private, owner: null, slowmode: 1, dm: [], muted: [], name: req.body.room}
	res.redirect(id + '/owner')
	io.emit('room-created', req.body.room, id)
})

app.get('/:room', (req, res) => {
	if (rooms[req.params.room] == null) {
		return res.redirect('/')
	}

	res.render('room', { id: req.params.room, owner: false, roomName: rooms[req.params.room].name })
})

app.get('/:room/settings', (req, res) => {
	if (rooms[req.params.room] == null) {
		return res.redirect('/')
	}
	console.log(req.params.room)
	res.render('settings', { roomName: rooms[req.params.room].name, rooms: rooms, id: req.params.room })
})

app.get('/:room/owner', (req, res) => {
	if (rooms[req.params.room] == null) {
		return res.redirect('/')
	}
	console.log(req.params.room)
	res.render('room', { id: req.params.room, owner: true, roomName: rooms[req.params.room].name })
})

app.get('/home/rooms', (req, res) => {
	res.render('rooms', {rooms : rooms})
})

server.listen(3000)

io.on('connection', socket => {
	let slowmode = 0

	socket.on('slowmode-change', (room, slowmodeValue) => {
		slowmodeExport(rooms, room, slowmodeValue, socket)
	})

	socket.on('delete-room', room => {
		deleteExport(rooms, room, socket)
	})

	socket.on("check-name", (name, room) => {
		checkNameExport(name, room, rooms, socket)
	})

	socket.on('new-owner', room => {
		console.log(room)
		newOwnerExport(rooms, room, socket)
	})
	socket.on('new-user', (room, name) => {
		newUserExport(socket, rooms, room, name)
	})
	socket.on('send-chat-message', (room, message) => {
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
			} else if (command === 'dm'){
				// gets the name of the user they want to dm
				let dmName = args.slice(0).join(" ");
				dmName = dmName.replace("-n ", "");
				dmName = dmName.substr(0, dmName.indexOf(' -m '));
				//gets the message
				let messageDM = message.split(' -m ').pop();
			//	console.log(messageDM)
			//	messageDM = messageDM[0].substr(args.indexOf(' (') + 1);
			//	messageDM = messageDM[0].replace("(", "");
			//	console.log(messageDM)
			//	console.log(dmName)
				//gets the users socket.id (all server side, never sends back to the user)
				for (user in rooms[room].users) {
					if (rooms[room].users[user] == dmName) {
						// checks if their dms are closed 
						if (rooms[room].dm.includes(user) && rooms[room].owner != socket.id){
							// sends back that their dms are closed
							socket.emit('system', `${dmName} has their dms turned off.`)
							return;
						}
						// sends back the mesage to both users
						socket.to(user).emit('dm', {user: rooms[room].users[socket.id], message: messageDM})
						socket.emit('dm', {user: rooms[room].users[socket.id], message: messageDM})
						return;
					}
				}
				socket.emit('system', `${dmName} is not in this room.`)
				return;
			} else if (command == 'dm-toggle'){
				// if their dms are off
				if (rooms[room].dm.includes(socket.id)){
					// turn it on
					var index = rooms[room].dm.indexOf(socket.id);
					if (index > -1) {
						rooms[room].dm.splice(index, 1);
					}
					socket.emit('system', `Successfully enabled Dms`)
				} else {
					/* 
					if there on
					turn it off or remove them from the list 
					*/
					rooms[room].dm.push(socket.id);
					socket.emit('system', `Successfully disabled Dms`)
				}
				return;
			} else if (command === 'mute'){
				// checks if their not the owner
				if (socket.id != rooms[room].owner) {
					// sends back that their not the owner
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
				socket.emit('system', help)
				return;
			} else if (command === 'slowmode'){
				console.log('slowmode')
				if (socket.id != rooms[room].owner) {
					socket.emit('system', `You do not have accese to commands`);
					return;
				}
				console.log('slowmode2')
				const slowmodeValue = args.slice(0).join(" ");
				console.log(slowmodeValue)
				rooms[room].slowmode = slowmodeValue;
				console.log(rooms[room])
				socket.to(room).emit('changed-slowmode', slowmodeValue)
				socket.emit('changed-slowmode', slowmodeValue)
				socket.emit('system', `Slowmode has been changed to ${slowmodeValue}`);
				return;
			} else if (command === 'name'){
				let newName = args.slice(0).join(" ");
				let result = checkNameExportCommand(newName, room, rooms, socket)
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
				if (rooms[room].public == undefined){
					rooms[room].public = "on"
					socket.emit('system', `The privacy has been changed to private.`);
					return;
				} else {
					rooms[room].public = undefined
					socket.emit('system', `The privacy has been changed to public.`);
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
		slowmode = rooms[room].slowmode
		setTimeout(() => { slowmode = 0; }, rooms[room].slowmode * 1000);		
	})
	socket.on('disconnect', () => {
		userDisconnectExport(socket, rooms)
	})
	socket.on('leave', () => {
		userLeaveExport(socket, rooms)
	})
	socket.on('name-chage', (room, name) => {
		userNameChangeExport(rooms, name, socket, room)
	})
	socket.on('privacy-change', (room, value) => {
		rooms[room].public = value;
	})
})