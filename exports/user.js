//adds the func to get a users rooms
function getUserRooms(soket, rooms) {
    return Object.entries(rooms).reduce((names, [name, room]) => {
        if (room.users[soket.id] != null)
            names.push(name);
        return names;
    }, []);
}
//func for when there is a new owner
exports.newOwnerExport = (rooms, room, socket) => {
    let sendBack = false;
    if (rooms[room].owner == null) {
        sendBack = true;
        rooms[room].owner = socket.id;
    }
    socket.emit('owner-sendback', sendBack);
};
//func for when there is a new user in a room
exports.newUserExport = (socket, rooms, room, name) => {
    let user;
    if (name == null)
        name = 'Guest';
    if (name == rooms[room].users[socket.id])
        return;
    socket.join(room);
    rooms[room].users[socket.id] = name;
    socket.to(room).broadcast.emit('user-joined', name);
    socket.emit('changed-slowmode', rooms[room].slowmode);
    for (user in rooms[room].users) {
        socket.to(room).emit("user-list", rooms[room].users[user]);
        socket.emit("user-list", rooms[room].users[user]);
    }
};
//func for when there is a Disconnect
exports.userDisconnectExport = (socket, rooms) => {
    getUserRooms(socket, rooms).forEach(room => {
        let name = rooms[room].users[socket.id];
        if (name == null)
            name = 'Guest';
        socket.to(room).broadcast.emit('user-leave', name);
        if (socket.id == rooms[room].owner)
            rooms[room].owner = null;
        delete rooms[room].users[socket.id];
    });
};
//func for when there is a leave different to a disconnect 
exports.userLeaveExport = (socket, rooms) => {
    getUserRooms(socket, rooms).forEach(room => {
        let name = rooms[room].users[socket.id];
        if (name == null)
            name = 'Guest';
        socket.to(room).broadcast.emit('user-leave', name);
        if (socket.id == rooms[room].owner)
            rooms[room].owner = null;
        delete rooms[room].users[socket.id];
        socket.emit('redirect', '/');
    });
};
//func for when there is a name change
exports.userNameChangeExport = (rooms, name, socket, room) => {
    let user;
    rooms[room].users[socket.id] = name;
    socket.to(room).emit("user-changed-name");
    socket.emit("user-changed-name");
    for (user in rooms[room].users) {
        socket.to(room).emit("user-list", rooms[room].users[user]);
        socket.emit("user-list", rooms[room].users[user]);
    }
};
