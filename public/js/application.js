$(function() {
	// generate unique user id
	var userId = Math.random().toString(16).substring(2,15);
	var socket = io.connect('/');

	// load leaflet map
	var map = L.map('map');

	var sentData = {
		id: userId,
		coords: []
	}

	var clients = {};

	socket.on('load:coords', function(data) {
		//if (!(data.id in clients)) {;
		setMap(JSON.parse(data));
		//}

		//clients[data.id] = data;
		//clients[data.id].updated = $.now();
	});

	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(positionSuccess, positionError, { enableHighAccuracy: true });
	} else {
		alert('Please use modern browser, this one doesn\'t support Geolocation!');
	}

	function positionSuccess(position) {
		var lat = position.coords.latitude;
		var lng = position.coords.longitude;
		var acr = position.coords.accuracy;

		var userMarker = L.marker([lat, lng]);

		// leaflet API key tiler
		L.tileLayer('http://{s}.tile.cloudmade.com/BC9A493B41014CAABB98F0471D759707/997/256/{z}/{x}/{y}.png', { maxZoom: 18 }).addTo(map);
		
		map.setView([lat, lng], 11);
		userMarker.addTo(map);
		userMarker.bindPopup('<p>You are there! Your ID is ' + userId + '</p>').openPopup();

		sentData.coords.push({
			lat: lat,
			lng: lng,
			acr: acr
		});

		//$(document).bind('mousemove', function() {
		//interval = window.setInterval(function() {
		socket.emit('send:coords', JSON.stringify(sentData));
		//}, 5000);
		//});
		}

		function positionError(error) {
			alert('Booo! Error appeared ;)');
		}

		function setMap(data) {
			console.log(data.coords.length);
			for (i = 0; i < data.coords.length; i++) {
				console.log(data.coords[i]);
				var marker = L.marker([data.coords[i].lat, data.coords[i].lng]).addTo(map);
				marker.bindPopup('<p>External user is here!</p>');
			}
		}
});