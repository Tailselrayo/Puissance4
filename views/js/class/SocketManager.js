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
		game.text = "       ";
		game.posPawn.x = datas.newX;
		game.posPawn.y = datas.newY;
		game.clock.restart();
	}
	var manageEnd = function(datas)
	{
		console.log(datas.color);
		game.text = datas.color +  " Wins";
	}
	socket.on("game:initialize", getColor);
	socket.on("game:sendUpdate", getUpdate);
	socket.on("game:end", manageEnd);
}