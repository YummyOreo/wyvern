const socket = io('http://localhost:3000');
const publicSwitch = document.getElementById('public-switch');
const back = document.getElementById('back');
const savedPublic = document.getElementById('saved-public');
const savedSlowmode = document.getElementById('saved-slowmode');
const deleteRoom = document.getElementById('delete');
const slowmode = document.getElementById('slowmode');
const bannedNamesForm = document.getElementById('banned-names-form');
const bannedNamesInput = document.getElementById('banned-names-input');
const allBannedNames = document.getElementById('all-banned-names');
// when the user wants to go back to the room
back.addEventListener('click', () => {
    window.location.href = `/${id}/owner`;
});
// when the user wants to delete the room
deleteRoom.addEventListener('click', () => {
    let deleteTest = prompt('Retype the name of the room (' + roomName + ')');
    if (deleteTest != roomName) {
        window.alert("Incorrect");
        return;
    }
    socket.emit('delete-room', id);
    window.location.href = '/';
});
// when the user wants to change the slowmode
slowmode.addEventListener('submit', e => {
    e.preventDefault();
    let inputValue = document.getElementById('slowmode-Value').value;
    socket.emit('slowmode-change', id, inputValue);
    savedSlowmode.innerText = "Saved";
});
// when the user wants to switch from public to private
publicSwitch.addEventListener('submit', e => {
    e.preventDefault();
    let inputValue = document.getElementById('private').value;
    socket.emit('privacy-change', id, inputValue);
    savedPublic.innerText = "Saved";
});
bannedNamesForm.addEventListener('submit', e => {
    e.preventDefault();
    socket.emit('add-ban-name', bannedNamesInput.value, id);
    bannedNamesInput.value = '';
    document.getElementById('saved-ban').innerText = 'Saved';
});
allBannedNames.addEventListener('click', () => {
    socket.emit('get-banned-name', id);
    socket.on('get-banned-name-return', (names) => {
        let i;
        let namesList = ' ';
        for (i in names) {
            namesList += names[i] + ', ';
        }
        window.alert(`All banned names are: ${namesList}`);
        return;
    });
});
