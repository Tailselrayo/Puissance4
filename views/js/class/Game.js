var Game = function(canvas, socket)
{
	var self = this;
	var context = canvas.getContext("2d");
	var socketManager = new SocketManager(socket, self);
	var mouseX;
	this.color = "black";
	this.pawns = [];
	this.text = "";
	this.posPawn = new Vector2D(-1, -1);
	this.clock = new Clock();

	var animatePawn = function()
	{
		var time = self.clock.getElapsedTime();
		var x = 50+100*self.posPawn.x;
		var y = 150+100*self.posPawn.y;
		var color = "green";
		if(self.posPawn.x == -1 || self.pawns[self.posPawn.x] == undefined)
			return;
		if(self.pawns[self.posPawn.x][self.posPawn.y] == 1)
			color = "red";
		if(time < 1)
			y*=time;
		console.log(x + " " + y);
		drawPawn(x, y, color);
	}
	var drawText = function(text)
	{
		context.font = "50px Comic Sans MS";
		context.fillStyle = "gold";
		context.beginPath();
		context.fillText(text, 10, 50);
		context.fill();
	}
	var drawGrid = function()
	{
		var color = "white";
		context.fillStyle = "darkblue";
		context.fillRect(0, 0, canvas.width, 100);
		for(var i = 0; i < self.pawns.length+1; i++)
		{
			context.fillRect(i*100-10, 0, 20, canvas.height);
			context.fillRect(0, i*100-10, canvas.width, 20);
		}
		
	}
	var drawPawn = function(x, y, color)
	{
		context.fillStyle = color;
		context.beginPath();
		context.arc(x, y, 40, 0, Math.PI*2);
		context.fill();
		context.fillStyle = "rgba(255, 255, 255, 0.2)";
		context.strokeStyle = "black";
		context.beginPath();
		context.arc(x, y, 25, 0, Math.PI*2);
		context.fill();
		if(color !== "white")
			context.stroke();
	}
	var drawArray = function()
	{
		var color = "white";
		for(var i = 0; i < self.pawns.length; i++)
		{
			for(var j = 0; j < self.pawns[i].length; j++)
			{
				if(self.pawns[i][j] == 0)
					color = "white";
				else if(self.pawns[i][j] == 1)
					color = "red";
				else if(self.pawns[i][j] == 2)
					color = "green";
				if(color !== "white" 
					&& (i != self.posPawn.x 
					|| j != self.posPawn.y))
				drawPawn(50 + i*100, 150 + j*100, color);
			}
		}
	}
	var drawMousePawn = function(event)
	{
		mouseX = event.clientX;
		mouseX = 50 + Math.floor(mouseX/100)*100;
	}
	var dataMouse = function(event)
	{
		socket.emit("game:sendPos", {x:mouseX/100});
	}
	this.render = function()
	{
		context.clearRect(0, 0, canvas.width, canvas.height);
		if(self.pawns != undefined)
		{
			canvas.width = self.pawns.length*100;
			if(self.pawns[0] != undefined)
			{
				canvas.height = self.pawns[0].length*100+100;
			}
		}
		animatePawn();
		drawGrid();
		drawArray();
		drawPawn(mouseX, 50, self.color);
		drawText(self.text);
		window.requestAnimationFrame(self.render);
	}
	canvas.addEventListener("mousemove", drawMousePawn);
	canvas.addEventListener("mousedown", dataMouse);
}
