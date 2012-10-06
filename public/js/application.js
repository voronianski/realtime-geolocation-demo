$(function() {
	// generate unique user id
	var userId = Math.random().toString(16).substring(2,15);
	var socket = io.connect('/');
	var info = $('#infobox');
	var map;

	// custom marker's icon styles
	var tinyIcon = L.Icon.extend({
		options: {
			shadowUrl: '../assets/marker-shadow.png',
			iconSize: [25, 39],
			iconAnchor:   [12, 36],
			shadowSize: [41, 41],
			shadowAnchor: [12, 38],
			popupAnchor: [0, -30]
		}
	});
	var redIcon = new tinyIcon({ iconUrl: '../assets/marker-red.png' });
	var yellowIcon = new tinyIcon({ iconUrl: '../assets/marker-yellow.png' });

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
		$('.map').text('Please use modern browser, this one doesn\'t support Geolocation!');
	}

	function positionSuccess(position) {
		var lat = position.coords.latitude;
		var lng = position.coords.longitude;
		var acr = position.coords.accuracy;

		// mark user's position
		var userMarker = L.marker([lat, lng], {
			icon: redIcon
		});
		// uncomment for static debug
		userMarker = L.marker([51.45, 30.050], {
			icon: redIcon
		});

		// load leaflet map
		map = L.map('map');

		// leaflet API key tiler
		L.tileLayer('http://{s}.tile.cloudmade.com/BC9A493B41014CAABB98F0471D759707/997/256/{z}/{x}/{y}.png', { maxZoom: 18, detectRetina: true }).addTo(map);
		
		map.setView([lat, lng], 2);
		userMarker.addTo(map);
		userMarker.bindPopup('<p>You are there! Your ID is ' + userId + '</p>').openPopup();

		sentData.coords.push({
			lat: lat,
			lng: lng,
			acr: acr
		});

		$('.app').click(function() { showError('Updating data..') });

		socket.emit('send:coords', JSON.stringify(sentData));
		sentData.coords = new Array();
	}

	function setMap(data) {
		for (i = 0; i < data.coords.length; i++) {
			console.log(data.id);
			var marker = L.marker([data.coords[i].lat, data.coords[i].lng], { icon: yellowIcon }).addTo(map);
			marker.bindPopup('<p>One more external user is here!</p>');
		}
	}

	function positionError(error) {
		var errors = {
			1: 'Authorization fails', // permission denied
			2: 'Can\'t detect your location', //position unavailable
			3: 'Connection timeout' // timeout
		};
		showError('Error:' + errors[error.code]);
	}

	function showError(msg) {
		info.addClass('error').text(msg);
	}
});