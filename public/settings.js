//sets up all needed global vars
const socket = io('http://localhost:3000')
const publicSwitch = document.getElementById('public-switch');
const back = document.getElementById('back')
const savedPublic = document.getElementById('saved-public')
const savedSlowmode = document.getElementById('saved-slowmode')
const deleteRoom = document.getElementById('delete')
const slowmode = document.getElementById('slowmode')

// when the user wants to go back to the room
back.addEventListener('click', () => {
	window.location.href = `/${roomName}/owner`;
});

// when the user wants to delete the room
deleteRoom.addEventListener('click', () => {
	let deleteTest = prompt('Retype the name of the room (' + roomName + ')');
	if (deleteTest != roomName){
		window.alert("Incorrect")
		return;
	}
	socket.emit('delete-room', roomName)
	window.location.href = '/';
})

// when the user wants to change the slowmode
slowmode.addEventListener('submit', e => {
	e.preventDefault()
	socket.emit('slowmode-change', roomName, document.getElementById('slowmode-Value').value)
	savedSlowmode.innerText = "Saved"
})

// when the user wants to switch from public to private
publicSwitch.addEventListener('submit', e => {
	e.preventDefault()
	socket.emit('privacy-change', roomName, document.getElementById('private').value)
	savedPublic.innerText = "Saved"
})