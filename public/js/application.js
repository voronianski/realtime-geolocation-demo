$(function() {
	// generate unique user id
	var userId = Math.random().toString(16).substring(2,15);
	var socket = io.connect('/');
	var map;

	var	info = $('#infobox');
	//console.log(userId);

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
	var markers = {};

	socket.on('load:coords', function(id, data) {
		if (!(id in clients)) {			
			console.log('id in clients');
			clients[id] = id;

			setMarker(JSON.parse(data));
		}

		//clients[id].updated = $.now();
		//clients[data.id] = data;
		//clients[data.id].updated = $.now();
	});

	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(positionSuccess, positionError, { enableHighAccuracy: true });
	} else {
		$('.map').text('Your browser is out of fashion, there\'s no geolocation!');
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
		
		// map.setView([lat, lng], 6);
		map.fitWorld();
		userMarker.addTo(map);
		userMarker.bindPopup('<p>You are there! Your ID is ' + userId + '</p>').openPopup();

		$(document).bind('mousemove', function() {
			resetTimer();

		sentData.coords.push({
			lat: lat,
			lng: lng,
			acr: acr
		});

		//console.log('move');
		socket.emit('send:coords', userId, JSON.stringify(sentData));
		sentData.coords = new Array();
		});
	}

	var emarker;
	function setMarker(data) {
		//console.log('set');
		for (i = 0; i < data.coords.length; i++) {
			//console.log(data.id);
			emarker = L.marker([data.coords[i].lat, data.coords[i].lng], { icon: yellowIcon }).addTo(map);
			emarker.bindPopup('<p>One more external user is here!</p>');
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

	// check and remove marker for inactive user 
	var timer = 5;
	function inactivity() {
		if (timer == 0)	{
			console.log('no activity on the page');
			/*for (ident in markers) {
				console.log('clean');
			  	map.removeLayer(markers[ident]);
			  	//console.log(clients[ident]);
			}*/
			resetTimer();
		} else {
			//console.log('else');
			timer--
		}
	}

	function resetTimer() {
		timer = 5;
	} 

	setInterval(function() { inactivity() }, 2000);
});