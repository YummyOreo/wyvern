<div align="center">
	<img align="center" src="https://github.com/OreoDivision/wyvern/blob/main/assets/icons/logo/icon.png" width="300" height="300" style="border-radius: 25%;">
</div>

<h1 align="center">About Wyvern</h1>
<p align="center"><a href="https://github.com/OreoDivision/wyvern#about">About</a> ⦿ <a href="https://github.com/OreoDivision/wyvern#how-to-help">How To Help</a> ⦿ <a href="https://github.com/OreoDivision/wyvern#how-to-run-wyvern">How to run Wyvern</a> ⦿ <a href="https://github.com/OreoDivision/wyvern#how-it-works">How it works</a> <br> <a href="https://github.com/OreoDivision/wyvern#developers">Developers</a> ⦿ <a href="https://www.taskade.com/d/AjDQGcMqEVdw6EgX?share=view&view=dtP5qeBzR9kZ46ea">"Trello" List</a> ⦿ <a href="https://github.com/OreoDivision/wyvern/issues">Issues</a> ⦿ <a href="https://github.com/OreoDivision/wyvern/wiki">Wiki</a></p>

# ⚠️ This Repo HAS BEEN ACHIEVED ⚠️

## About

Wyvern is a chat app ment to not have you sign in, so that means it does not collect your data, or any data about anything! There will be private rooms, and public rooms. Public rooms are shown on the main page. Private rooms need a link.

## [Discord](https://discord.com/invite/9kvTg7Pk5W)  
This is where you can talk about code questions, the app, or anything. You can get intuch with me to contribute to the app or get help on something.

### List of features:
> **Disclaimer:** Not all of these are in the repo or in the app right now, but we do plan to add all of them.

- [x] No Login
	* this means we will never ask you to login to use Wyvern!
- [x] No chat messages/names loging
	* We will never log anything.
	* **Disclaimer:** In the repo there may be loging to console, this will be removed once it goes public. This is only for testing!
- [x] Public rooms
	* This will show you a list of open rooms to go and chat!
- [x] Private rooms
	* This will have your room not be on a public list, to join a private room, you need a direct link to the room.
- [x] Time when the message was sent and by who
	* This shows what time it was sent at, and by who!
- [x] Room Deletion
	* This will add a delete button for owners.
- [ ] And MORE!

* To see my full checklist go [here](https://www.taskade.com/d/AjDQGcMqEVdw6EgX?share=view&view=dtP5qeBzR9kZ46ea).

### List of features that ***might*** be implemented:
- [ ] Room Perms
	* Levels of perms to users.
- [x] Room Kicks
	* Kick a user from the room.
- [x] Owner/Owner Crown
	* Adds a crown to the owner in chat, and in the member list.
- [ ] API for the chat
	* A api for devs that want to make bots.

## How To Help
### You can help by:
* Forking the repo
	* If you fork the repo and add/fix code, feel free to DM me on Discord and make a pull request!, my tag is OreoDivision#0001.
	* You will also be added to [Foreked Devs](https://github.com/OreoDivision/wyvern#foreked-devs) list if it is accepted! 

* Make Changes to the UI/Graphic Designe Changes
	* If you do want to make UI/Graphic Designe Changes DM me on Discord. My tag is OreoDivision#0001. And we can talk about what you think should change about the UI/Graphic Designe Changes.
	* You will also be added to [Foreked Devs](https://github.com/OreoDivision/wyvern#foreked-devs) list if it is accepted! 
* Making bug reports
	* If you see a bug, report it to [here](https://github.com/OreoDivision/wyvern/issues), or [fork it](https://github.com/OreoDivision/wyvern#how-to-help)!

## How to run wyvern:
> **Disclaimer:** Not everything works, __feel free__ **to fork** this and work on it, *tell me if you do, and I might add your fixes/additions to the repo!* for more info go [here](https://github.com/OreoDivision/wyvern#how-to-help). You can also report bugs/issues [here](https://github.com/OreoDivision/wyvern/issues).

### Install Node
To install Node.js go to there [website](https://nodejs.org/en/).

### Clone the repo:
> You can also download the files
```console
$ git clone https://github.com/OreoDivision/wyvern
$ cd wyvern
```

### Way One:
> .EXE

### Run the exe:
You can run run.exe to have it run the commands and open the website for you! See [`./py`](https://github.com/OreoDivision/wyvern/tree/main/py) for more info!

### Way two (recommended):
> Command prompt

### Install Everything
```console
$ npm i
$ tsc
```
> This installes all dependencies, converts `ts` files to `js` files. ***Its fine to get errors, they are FINE.***

### Run the website
```console
$ npm run devStart
```
> Starts the `server.js` file.

### Local Host Website
The local Host website that this runs on is [http://localhost:3000](http://localhost:3000).

## How it works:
> **Disclaimer:** Does *not* explain __everything!__ Look in the code to **get exactly how it works.**
### What modules does it uses
This uses [`soket.io`](https://socket.io/), [`ejs`](https://ejs.co/), [`ts`](https://www.typescriptlang.org/), and [`express`](https://expressjs.com/). (excluding [`HTTPS`](https://nodejs.org/api/https.html)).
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
Seen in [`./views/rooms.ejs`](https://github.com/OreoDivision/wyvern/blob/main/views/rooms.ejs).

## Developers
All developers that have worked on the app will be listed here.

> **Disclaimer:** This does not list ALL, this lists most, and it will not update automatically. If you did fork and got your fork implemented into the main repo and you dont see your name [here](https://github.com/OreoDivision/wyvern#foreked-devs) Dm me on Discord @ OreoDivision#0001.

### Direct Devs:
This lists everyone that worked on the main repo.
* OreoDivision
	* Head Dev.

### Foreked Devs
This lists everyone that has had there fork implemented into the main repo.
