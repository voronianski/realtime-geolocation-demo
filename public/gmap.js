
	$(function() {
		var user_id = Math.random().toString(16).substring(2,15);
		var socket = io.connect('/');
		var sent = {
			id: user_id,
			coords: []
		}

		console.log('my id: ' + user_id);

		var clients = {};

		socket.on('load:coords', function(data) {
			console.log('in load');
			//if (!(data.id in clients)) {;
				setMap(JSON.parse(data));
			//}

			//clients[data.id] = data;
			//clients[data.id].updated = $.now();
		});

		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(positionSuccess, positionError);
		} else {
			alert('Please use modern browser, this one doesn\'t support Geolocation!');
		}

		function positionSuccess(pos) {
			var lat = pos.coords.latitude;
			var lng = pos.coords.longitude;
			var accuracy = pos.coords.accuracy;

			sent.coords.push({
				lat: lat,
				lng: lng,
				accuracy: accuracy
			});
			//$(document).bind('mousemove', function() {
			//interval = window.setInterval(function() {
			socket.emit('send:coords', JSON.stringify(sent));
			//}, 5000);
			//});
		}

		function positionError(error) {
			alert('Booo! Error appeared ;)');
		}

		function setMap(data) {
			var canvas = document.getElementById('map');
			var center = new google.maps.LatLng(45.58329,12.65625);
			var bounds = new google.maps.LatLngBounds();

			var options = {
				zoom: 3,
				//center: center,
				mapTypeId: google.maps.MapTypeId.ROADMAP
			}

			console.log(data.coords);

			var map = new google.maps.Map(canvas, options);

			for (i = 0; i < data.coords.length; i++) {
				var clientPos = new google.maps.LatLng(data.coords[i].lat, data.coords[i].lng);
				var marker = new google.maps.Marker({
					position: clientPos,
					map: map,
					title: data.id
				});

				bounds.extend(marker.position);
			}

			map.fitBounds(bounds);

		}

	});