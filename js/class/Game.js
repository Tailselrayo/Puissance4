const COLOR = ["red","green"];
var Game = function()
{
	let players = [];
	let datas = new Array(7);

	for(let i = 0; i < 7; i++)
	{
		datas[i] = new Array(6);
		for(let j = 0; j < 6; j++)
		{
			datas[i][j] = 0;
		}
	}

	this.addPlayer = function(socket)
	{
		socket.color = COLOR[players.length];
		socket.emit("game:initialize", 
		{
			color:socket.color, 
			pawns:datas
		});
		players.push(socket);
	}
	this.addPawn = function(socket, x)
	{
		let i = 0;
		let color = socket.color;
		for(i; i < datas[x].length; i++)
		{
			if(datas[x][i] != 0)
				break;
		}
		if(color === COLOR[0])
			datas[x][i-1] = 1;
		else if(color === COLOR[1])
			datas[x][i-1] = 2;
		for(var j = 0; j < players.length; j++)
		{
			players[j].emit("game:sendUpdate", {pawns:datas});
		}
	}
	this.removePlayer = function(socket)
	{
		let index = players.indexOf(socket);

		players.splice(index, 1);
	}
}
module.exports = Game;