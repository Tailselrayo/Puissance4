const socketio = require("socket.io");

var SocketManager = function(server, game)
{
	let io;
	
	io = socketio(server);
	io.on("connection", function(socket)
	{
		console.log("User " + socket.id + " is connected to the server.");
		game.addPlayer(socket);
		socket.on("disconnect", function()
		{
			onDisconnect(socket);
		});
		socket.on("game:sendPos", function(datas)
		{
			game.addPawn(socket, Math.floor(datas.x));
		});
	});

	var onDisconnect = function(socket)
	{
		game.removePlayer(socket);
		console.log("User " + socket.id + " has leaved the server.");
	}
}
module.exports = SocketManager;