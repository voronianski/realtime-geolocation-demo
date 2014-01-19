var http = require('http');
var Static = require('node-static');
var app = http.createServer();
var io = require('socket.io').listen(app);
var port = 8080;

// delete to see more logs from sockets
io.set('log level', 1);

io.sockets.on('connection', function (socket) {

	socket.on('send:coords', function (data) {
		socket.broadcast.emit('load:coords', data);
		console.log(data.id + ' [' + data.coords[0].lat + ', ' + data.coords[0].lng + ']');
	});
});

// start app on specified port
app.listen(port);
console.log('Your server goes on localhost:' + port);