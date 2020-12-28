var server = require('http').createServer(handler);
var Static = require('node-static');
var io = require('socket.io')(server);
var port = 3001;

var files = new Static.Server('./public');

function handler (request, response) {
	request.on('end', function() {
		files.serve(request, response);
	}).resume();
}

io.sockets.on('connection', function (socket) {

	socket.on('send:coords', function (data) {
		socket.broadcast.emit('load:coords', data);
	});
});

// start app on specified port
server.listen(port);
console.log('Your server goes on localhost:' + port);