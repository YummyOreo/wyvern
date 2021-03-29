<h1 align="center">About this Chat App</h1>
<p align="center"><a href="https://github.com/OreoDivision/chat-app-oreo#about">About</a> ⦿ <a href="https://github.com/OreoDivision/chat-app-oreo#how-to-help">How To Help</a> ⦿ <a href="https://github.com/OreoDivision/chat-app-oreo#install-node">How to run the app</a> ⦿ <a href="https://github.com/OreoDivision/chat-app-oreo#how-it-works">How it works</a> <br> <a href="https://github.com/OreoDivision/chat-app-oreo#developers">Developers</a> ⦿ <a href="https://www.taskade.com/d/AjDQGcMqEVdw6EgX?share=view&view=YoqcbUwQAhDyyZ7d">"Trello" List</a> ⦿ <a href="https://github.com/OreoDivision/chat-app-oreo/issues">Issues</a> ⦿ <a href="https://github.com/OreoDivision/chat-app-oreo/wiki">Wiki</a></p>

## About
This Chat App is ment to not have you sign in, so that means it does not collect your data, or any data about anything! There will be private rooms, and public rooms. Public rooms are shown on the main page. Private rooms need a link.

#### [Discord](https://discord.gg/9kvTg7Pk5W)

### List of features:
> **Disclaimer:** Not all of these are in the repo or in the app right now, but we do plan to add all of them.

- [x] No Login
	* this means we will never ask you to login to use our chat app!
- [x] No chat messages/names loging
	* We will never log anything.
	* **Disclaimer:** In the repo there may be loging to console, this will be removed once it goes public. This is only for testing!
- [x] Public rooms
	* This will show you a list of open rooms to go and chat!
- [x] Private rooms
	* This will have your room not be on a public list, to join a private room, you need a direct link to the room.
- [x] Time when the message was sent and by who
	* This shows what time it was sent at, and by who!
- [ ] Room Deletion
	* This will add a delete button for owners.
- [ ] And MORE!

* To see my full checklist go [here](https://www.taskade.com/d/AjDQGcMqEVdw6EgX?share=view&view=YoqcbUwQAhDyyZ7d).

### List of features that ***might*** be implemented:
- [ ] Room Perms
	* Levels of perms to users.
- [x] Room Kicks
	* Kick a user from the room.
- [ ] Owner Crown
	* Adds a crown to the owner in chat, and in the member list.
- [ ] API for the chat
	* A api for devs that want to make bots.

## How To Help
### You can help by:
* Forking the repo
	* If you fork the repo and add/fix code, feel free to DM me on Discord, my tag is OreoDivision#0001.
	* You will also be added to [Foreked Devs](https://github.com/OreoDivision/chat-app-oreo#foreked-devs) list if it is accepted! 

* Make Changes to the UI/Graphic Designe Changes
	* If you do want to make UI/Graphic Designe Changes DM me on Discord. My tag is OreoDivision#0001. And we can talk about what you think should change about the UI/Graphic Designe Changes.
	* You will also be added to [Foreked Devs](https://github.com/OreoDivision/chat-app-oreo#foreked-devs) list if it is accepted! 
* Making bug reports
	* If you see a bug, report it to [here](https://github.com/OreoDivision/chat-app-oreo/issues), or [fork it](https://github.com/OreoDivision/chat-app-oreo/issues)!

## How to run the chat app:
> **Disclaimer:** Not everything works, __feel free__ **to fork** this and work on it, *tell me if you do, and I might add your fixes/additions to the repo!* for more info go [here](https://github.com/OreoDivision/chat-app-oreo#how-to-help). You can also report bugs/issues [here](https://github.com/OreoDivision/chat-app-oreo/issues).

### Install Node
To install Node.js go to there [website](https://nodejs.org/en/).
Next, in the command line, type `npm i`. This should install every node modual needed.

### Run Website
Then, to run the server, type `npm run devStart`. This starts the `server.js` file.

### Local Host Website
The local Host website that this runs on is [http://localhost:3000](http://localhost:3000).

## How it works:
> **Disclaimer:** Does *not* explain __everything!__ Look in the code to **get exactly how it works.**
### What modules does it uses
This uses [`soket.io`](https://socket.io/), [`ejs`](https://ejs.co/), and [`express`](https://expressjs.com/). (excluding [`HTTPS`](https://nodejs.org/api/https.html)).
### How does it send messages?
We use [`soket.io`](https://socket.io/), so to send messages we use `soket.to(room).brodcast.emit()`. This sends a "emit" to everyone in the room, other than the user sending the messag.e 
### What is a .ejs files?
`.ejs` files are the same as `.html` files, but they are a little different, you can use JS by using `<% [js] %>` and it will act like a JS file! Example: 
```js
<% Object.keys(rooms).forEach(room => { console.log(rooms); if (rooms[room].public == 'on') {return;}%>
		<div><%= room; %></div>
		<a href="/<%= room %>" class="waves-effect waves-light btn">Join</a>
		<% }) %>
```
Seen in [`./views/index.ejs`](https://github.com/OreoDivision/chat-app-oreo/blob/main/views/index.ejs).

## Developers
All developers that have worked on the app will be listed here.

> **Disclaimer:** This does not list ALL, this lists most, and it will not update automatically. If you did fork and got your fork implemented into the main repo and you dont see your name [here](https://github.com/OreoDivision/chat-app-oreo#foreked-devs) Dm me on Discord @ OreoDivision#0001.

### Direct Devs:
This lists everyone that worked on the main repo.
* OreoDivision
	* Head Dev.
* Polar Ice
	* Graphic Designer.

### Foreked Devs
This lists everyone that has had there fork implemented into the main repo.