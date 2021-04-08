//a check for if the name has been taken
exports.checkNameExport = (name, room, rooms, socket) => {
    let id;
    //loops though all user in the room
    if (rooms[room].bannedNames.includes(name))
        return socket.emit('sendback-name', false);
    for (id in rooms[room].users) {
        // and cheks if they have the same name
        if (rooms[room].users[id] == name && id != socket.id)
            return socket.emit('sendback-name', false);
    }
    // if no one does, send back its okay
    socket.emit('sendback-name', true);
};
//check if the name has been taken for command
exports.checkNameExportCommand = (name, room, rooms, socket) => {
    let id;
    //loops though all user in the room
    if (rooms[room].bannedNames.includes(name))
        return false;
    for (id in rooms[room].users) {
        // and cheks if they have the same name
        if (rooms[room].users[id] == name && id != socket.id)
            return false;
    }
    // if no one does, send back its okay
    return true;
};
