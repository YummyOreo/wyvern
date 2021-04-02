const socket = io('http://localhost:3000')
const publicSwitch = document.getElementById('public-switch');
const back = document.getElementById('back')
const saved = document.getElementById('saved')
const deleteRoom = document.getElementById('delete')

back.addEventListener('click', () => {
	window.location.href = `/${roomName}/owner`;
});

deleteRoom.addEventListener('click', () => {
	let deleteTest = prompt('Retype the name of the room (' + roomName + ')');
	if (deleteTest != roomName){
		window.alert("Incorrect")
		return;
	}
	socket.emit('delete-room', roomName)
	window.location.href = '/';
})

publicSwitch.addEventListener('submit', e => {
	e.preventDefault()
	socket.emit('privacy-change', roomName, document.getElementById('private').value)
	saved.innerText = "Saved"
})