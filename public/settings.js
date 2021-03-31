const socket = io('http://localhost:3000')
const settingsForm = document.getElementById('settings');
const back = document.getElementById('back')

back.addEventListener('click', () => {
	window.location.href = `/${roomName}/owner`;
});

settingsForm.addEventListener('submit', e => {
	e.preventDefault()
	socket.emit('privacy-change', roomName, document.getElementById('private').value)
})