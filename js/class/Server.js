const express = require("express");
const SocketManager = require("./SocketManager.js")
const Game = require("./Game.js");

var Server = function(port)
{
	const DIR = __dirname + "/../views/";
	let app = express();
	let game = new Game();
	let server;
	let socketManager;

	var start = function() {
		console.log("Server listen on port: " + port + ".");
		app.use(express.static("views"));
		app.get("/", function(req, res)
		{
			res.sendFile(path.resolve(DIR + "index.html"));
		});
	}
	server = app.listen(port, start);
	socketManager = new SocketManager(server, game);
}
module.exports = Server;