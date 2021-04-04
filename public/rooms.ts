//gets the home button
const homeButton = document.getElementById('home')!;

//redirects to the homebutton link when clicked
homeButton.addEventListener('click', () => {
	window.location.href = '/home';
})

