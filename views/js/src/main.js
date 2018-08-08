function main()
{
	var canvas = document.getElementsByTagName("canvas")[0];
	var socket = io();
	var game = new Game(canvas, socket);

	canvas.width = 700;
	canvas.height = 700;
	game.render();
}

exportLib(main);