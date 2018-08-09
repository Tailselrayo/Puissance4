const COLOR = ["red","green"];
var Game = function()
{
	let tileNumber;
	let winPawnPos = {x:-1, y:-1};
	let currentPlayer = 0;
	let players = [];
	let datas;
	let hasWon = false;

	let reset = function(x=7, y=6)
	{
		tileNumber = x*y;
		datas = new Array(x);
		hasWon = false;
		for(let i = 0; i < x; i++)
		{
			datas[i] = new Array(y);
			for(let j = 0; j < y; j++)
			{
				datas[i][j] = 0;
			}
		}
		broadcast("game:sendUpdate", {pawns:datas});

	}
	let broadcast = function(event, content)
	{
		for(var j = 0; j < players.length; j++)
		{
			players[j].emit(event, content);
		}
	}
	let checkRow = function(x, y)
	{
		let selected = datas[x][y];
		if(x+4 > datas.length)
			return (false);
		for(let i = x; i < x+4; i++)
		{
			if(selected != datas[i][y])
				return (false);
		}
		return (true)
	}
	let checkColumn = function(x, y)
	{
		let selected = datas[x][y];
		if(y+4 > datas[x].length)
			return (false);
		for(let i = y; i < y+4; i++)
		{
			if(selected != datas[x][i])
				return (false);
		}
		return (true);
	}
	let checkLeftDiagonal = function(x, y)
	{
		let selected = datas[x][y];
		if(x-3 < 0 || y+4 > datas[x].length)
			return (false);
		for(let i = x; i > x-4; i--)
		{
			if(selected != datas[i][y+(x-i)])
				return (false);
		}
		return (true);
	}
	let checkRightDiagonal = function(x, y)
	{
		let selected = datas[x][y];
		if(x+4 > datas.length || y+4 > datas[x].length)
			return (false);
		for(let i = x; i < x+4; i++)
		{
			if(selected != datas[i][y+(i-x)])
				return (false);
		}
		return !(false);
	}
	let checkVictory = function()
	{
		for(let i = 0; i < datas.length; i++)
		{
			for(let j = 0; j < datas[i].length; j++)
			{
				if(datas[i][j] != 0)
				{
					if(checkRow(i, j) 
						|| checkColumn(i, j) 
						|| checkLeftDiagonal(i, j)
						|| checkRightDiagonal(i, j))
					{
						winPawnPos.x = i;
						winPawnPos.y = j;
						return (true); 	
					}
				}
			}
		}
	}

	this.addPlayer = function(socket)
	{
		socket.color = COLOR[players.length];
		players.push(socket);
		if(players[0].color === socket.color)
			socket.color = "red";
		socket.emit("game:initialize", 
		{
			color:socket.color, 
			pawns:datas
		});
	}
	this.addPawn = function(socket, x)
	{
		let i = 0;
		let color = socket.color;
		if(players[currentPlayer] == undefined 
			|| players[currentPlayer].id !== socket.id 
			|| hasWon)
			return;
		for(i; i < datas[x].length; i++)
		{
			if(datas[x][i] != 0)
				break;
		}
		if(i == 0 && datas[x][i] != 0)
			return;
		if(color === COLOR[0])
			datas[x][i-1] = 1;
		else if(color === COLOR[1])
			datas[x][i-1] = 2;
		broadcast("game:sendUpdate", 
		{
			pawns:datas,
			newX:x,
			newY:i-1
		});
		if(checkVictory() == true)
		{
			broadcast("game:end", 
			{
				color:players[currentPlayer].color,
				x:winPawnPos.x, 
				y:winPawnPos.y
			});
			hasWon = true;
			setTimeout(reset, 5000);
			return;
		}
		tileNumber--;
		if(tileNumber == 0)
			setTimeout(reset, 5000);
		currentPlayer++;
		if(currentPlayer > 1)
			currentPlayer = 0;
	}
	this.removePlayer = function(socket)
	{
		let index = players.indexOf(socket);

		players.splice(index, 1);
	}
	reset();
}
module.exports = Game;