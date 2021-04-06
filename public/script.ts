//gets all needed global vars setup
const socket = io('http://localhost:3000')
const messageContaner = document.getElementById('message-contaner')!;
const back = document.getElementById('back')!;
const nameChange = document.getElementById('name')!;
const userContaner = document.getElementById('user-contaner')!;
const messageForm = document.getElementById('send-message-form')!;
const messageInput = document.getElementById('message-input')! as HTMLInputElement;
const sendButton = document.getElementById('send-message')! as HTMLButtonElement;
const shareButton = document.getElementById('share')! as HTMLButtonElement;
let settings = document.getElementById('settings');
let name;
let userList = [];

function autocomplete(inp, arr) {
  /*the autocomplete function takes two arguments,
  the text field element and an array of possible autocompleted values:*/
  var currentFocus;
  /*execute a function when someone writes in the text field:*/
  inp.addEventListener("input", function(e) {
      var a, b, i, val = this.value;
      /*close any already open lists of autocompleted values*/
      closeAllLists();
      if (!val) { return false;}
      currentFocus = -1;
      /*create a DIV element that will contain the items (values):*/
      a = document.createElement("DIV");
      a.setAttribute("id", this.id + "autocomplete-list");
      a.setAttribute("class", "autocomplete-items");
      /*append the DIV element as a child of the autocomplete container:*/
      this.parentNode.appendChild(a);
      /*for each item in the array...*/
      for (i = 0; i < arr.length; i++) {
        /*check if the item starts with the same letters as the text field value:*/
        if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
          /*create a DIV element for each matching element:*/
          b = document.createElement("DIV");
          /*make the matching letters bold:*/
          b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
          b.innerHTML += arr[i].substr(val.length);
          /*insert a input field that will hold the current array item's value:*/
          b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
          /*execute a function when someone clicks on the item value (DIV element):*/
              b.addEventListener("click", function(e) {
              /*insert the value for the autocomplete text field:*/
              inp.value = this.getElementsByTagName("input")[0].value;
              /*close the list of autocompleted values,
              (or any other open lists of autocompleted values:*/
              closeAllLists();
          });
          a.appendChild(b);
        }
      }
  });
  /*execute a function presses a key on the keyboard:*/
  inp.addEventListener("keydown", function(e) {
      var x = document.getElementById(this.id + "autocomplete-list");
      if (x) x = x.getElementsByTagName("div");
      if (e.keyCode == 40) {
        /*If the arrow DOWN key is pressed,
        increase the currentFocus variable:*/
        currentFocus++;
        /*and and make the current item more visible:*/
        addActive(x);
      } else if (e.keyCode == 38) { //up
        /*If the arrow UP key is pressed,
        decrease the currentFocus variable:*/
        currentFocus--;
        /*and and make the current item more visible:*/
        addActive(x);
      } else if (e.keyCode == 13) {
        /*If the ENTER key is pressed, prevent the form from being submitted,*/
        e.preventDefault();
        if (currentFocus > -1) {
          /*and simulate a click on the "active" item:*/
          if (x) x[currentFocus].click();
        }
      }
  });
  function addActive(x) {
    /*a function to classify an item as "active":*/
    if (!x) return false;
    /*start by removing the "active" class on all items:*/
    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = (x.length - 1);
    /*add class "autocomplete-active":*/
    x[currentFocus].classList.add("autocomplete-active");
  }
  function removeActive(x) {
    /*a function to remove the "active" class from all autocomplete items:*/
    for (var i = 0; i < x.length; i++) {
      x[i].classList.remove("autocomplete-active");
    }
  }
  function closeAllLists(elmnt?) {
    /*close all autocomplete lists in the document,
    except the one passed as an argument:*/
    var x = document.getElementsByClassName("autocomplete-items");
    for (var i = 0; i < x.length; i++) {
      if (elmnt != x[i] && elmnt != inp) {
      x[i].parentNode.removeChild(x[i]);
    }
  }
}
/*execute a function when someone clicks in the document:*/
document.addEventListener("click", function (e) {
    closeAllLists(e.target);
});
}


//start
//not needed if statment

	
//if they are the owner
if (settings != null){
	console.log('owner')
	socket.emit('new-owner', id)
	socket.on("owner-sendback", results => {
		if (results == false && owner == true){
			window.location.href = `/${id}`
		}
	})
}

//gets there name
name = prompt('What is your name?')
socket.emit('check-name', name, id)
socket.on('sendback-name', status => {
	if (status == false) {
		name = prompt('Name Taken, Whats your new name?')
		socket.emit('check-name', name, id)
		return
	}
	var d = new Date();
	let hours = d.getHours();
	let minutes = d.getMinutes();
	appendMessage(name, ' Joined', "join", hours, minutes)
	socket.emit('new-user', id, name);

})

//when they want to change there name
nameChange.addEventListener('click', function() {
	let nameNew = prompt('What is your new name?')
	if (nameNew == '' || nameNew == null) return;
	socket.emit('check-name', nameNew, id)
	socket.on('sendback-name', status => {
		if (status == false) {
			nameNew = prompt('Name Taken, What is your new name?')
			if (nameNew == '' || nameNew == null) return;
			socket.emit('check-name', nameNew, id)
	}
	name = nameNew;
	socket.emit('name-chage', id, nameNew)
})
})

messageInput.onchange = function(){
	if (messageInput.value.endsWith('@')){

	}
}

//When they send a message
messageForm.addEventListener('submit', e => {
	console.log(name)
	e.preventDefault()
	let message = messageInput.value
	var d = new Date();
	let hours = d.getHours();
	let minutes = d.getMinutes();
	socket.emit('send-chat-message', id, message)
	messageInput.value = '';
});

//when the clikc to go back to home
back.addEventListener('click', e => {
	console.log('clicked')
	socket.emit('leave')
});

//settings
if (settings != null){
	settings.addEventListener('click', function() {
		window.location.href = `/${id}/settings`
	})
}


/* 
this will not be covered due to the complexity of it.
it will be covered later
*/

socket.on('changed-slowmode', (newValue) => {
	document.getElementById('slowmode-show').innerText = `Slowmode: ${newValue}`;
})

socket.on('user-changed-name', () => {
	userList = []
	userContaner.innerText = ''
	var headerList = document.createElement("p");
	var text = document.createTextNode('Members In ' + roomName);
	headerList.appendChild(text);
	userContaner.appendChild(headerList);
})

socket.on('redirect', function(destination) {
    window.location.href = destination;
});

socket.on(`kicked`, () => {
	socket.emit('leave')
})

socket.on(`mute`, (ownerName, status) => {
	if (status == true){
		var d = new Date();
		let hours = d.getHours();
		let minutes = d.getMinutes();
		messageInput.disabled = true;
		messageInput.placeholder = 'Muted';
		sendButton.disabled = true;
		appendMessage(`System`, `${ownerName} has muted you!`, "system", hours, minutes);
	} else {
		var d = new Date();
		let hours = d.getHours();
		let minutes = d.getMinutes();
		messageInput.disabled = false;
		messageInput.placeholder = 'Message';
		sendButton.disabled = false;
		appendMessage(`System`, `${ownerName} has unmuted you!`, "system", hours, minutes);
	}
})

socket.on('system', message => {
	var d = new Date();
	let hours = d.getHours();
	let minutes = d.getMinutes();
	appendMessage(`System`, `${message}`, "system", hours, minutes);
})

socket.on('dm', ({user, message}) => {
	var d = new Date();
	let hours = d.getHours();
	let minutes = d.getMinutes();
	appendMessage(`${user}`, `${message}`, "dm", hours, minutes);
})

socket.on('chat-message', ({name, message}) => {
	let type = 'filler'
	var d = new Date();
	let hours = d.getHours();
	let minutes = d.getMinutes();
	if (message.includes(`@${name}`) || message.includes(`@everyone`) || message.includes(`@here`)){
		type = 'mention';
	}
	appendMessage(name, `${message}`, type, hours, minutes);
});

socket.on('user-joined', UserName => {
	userList = []
	if (UserName == name) return;
	userContaner.innerText = ''

	var headerList = document.createElement("p");
	var text = document.createTextNode('Members In ' + roomName);
	headerList.appendChild(text);
	userContaner.appendChild(headerList);
	var d = new Date();
	let hours = d.getHours();
	let minutes = d.getMinutes();
	appendMessage(UserName, `joined!`, "join", hours, minutes);
});

socket.on('user-leave', UserName => {
	if (UserName == name) return;
	const deleteElement = document.getElementById(UserName);
	deleteElement.remove();
	var d = new Date();
	let hours = d.getHours();
	let minutes = d.getMinutes();
	appendMessage(UserName, `left.`, 'left', hours, minutes);
});

socket.on('user-list', UserName => {
	userList.push(UserName)
	const listElement = document.createElement('p');
	listElement.innerText = UserName;
	listElement.id = UserName
	userContaner.append(listElement)
});


function appendMessage(name, message, type, hours, minute) {
	const messageElement = document.createElement('div');
	const messageName = document.createElement('div');
	const br = document.createElement('br');
	messageElement.innerText = message;
	minute = minute.toString();
	console.log(minute.length)
	if (minute.length == 1){
		minute = '0' + minute;
	}
	messageName.innerText = `${name} | ${hours}:${minute}`;
	if (type == 'system'){
		messageElement.className = 'deep-purple'
		messageName.className = 'deep-purple'
	} else if (type == 'dm'){
		messageElement.className = 'red'
		messageName.className = 'red'
	} else if (type == 'mention'){
		messageElement.className = 'yellow'
		messageName.className = 'yellow'
	}
	messageContaner.append(messageName)
	messageContaner.append(messageElement)
	messageContaner.append(br)
	messageContaner.scrollTop = messageContaner.scrollHeight;
}