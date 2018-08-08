var SocketManager = function(socket, game)
{
	var getColor = function(datas)
	{
		game.color = datas.color;
		getUpdate(datas);
	}
	var getUpdate = function(datas)
	{
		game.pawns = datas.pawns;
		console.log(datas.pawns);
	}
	socket.on("game:initialize", getColor);
	socket.on("game:sendUpdate", getUpdate);
}