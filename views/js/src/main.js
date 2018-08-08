function main()
{
	var canvas = document.getElementsByTagName("canvas")[0];
	var socket = io();
	var game = new Game(canvas, socket);

	game.render();
}

exportLib(main);