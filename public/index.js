const socket = io('http://localhost:3000')
const roomContaner = document.getElementById('room-contaner');

socket.on('room-created', (room, private) => {
	if (private == true){
		return
	}
	const roomElemet = document.createElement('div')
	roomElemet.innerText = room
	const roomLink = document.createElement('a')
	roomLink.href = `/${room}`
	roomLink.innerText = 'join'
	roomLink.className = "waves-effect waves-light btn"
	roomLink.style.backgroundColor = "#538548"; 
	roomContaner.append(roomElemet)
	roomContaner.append(roomLink)
})
