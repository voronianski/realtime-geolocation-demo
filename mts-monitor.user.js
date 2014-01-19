// ==UserScript==
// @name        mts_monitor@imts
// @name        IITC plugin: mts monitor
// @category       Layer
// @version        0.5.0.20140113.195930
// @namespace      https://github.com/jonatkins/ingress-intel-total-conversion
// @description    mts player tracker
// @include        https://www.ingress.com/intel*
// @include        http://www.ingress.com/intel*
// @match          https://www.ingress.com/intel*
// @match          http://www.ingress.com/intel*
// ==/UserScript==

function wrapper(plugin_info) {
// ensure plugin framework is there, even if iitc is not yet loaded

    if(typeof window.plugin !== 'function') window.plugin = function() {};

//PLUGIN AUTHORS: writing a plugin outside of the IITC build environment? if so, delete these lines!!
//(leaving them in place might break the 'About IITC' page or break update checks)
// plugin_info.buildName = 'jonatkins';
// plugin_info.dateTimeVersion = '';
// plugin_info.pluginId = '';
//END PLUGIN AUTHORS NOTE

// PLUGIN START ////////////////////////////////////////////////////////

    window.plugin.mtsmon = function() {};

    var service = 'http://mts.fonk.me:8080/';


  var iconResImage = 'data:image/png;base64,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';
  var iconResRetImage = 'data:image/png;base64,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';

    var socket = false;
    var connects = {};

    window.plugin.mtsmon.iconRes = L.Icon.Default.extend({options: {
	iconUrl: iconResImage,
	iconRetinaUrl: iconResRetImage
    }});

    window.plugin.mtsmon.handledata = function(data) {
    	console.log(data);
	window.plugin.mtsmon.plot_user(data);			
	connects[data.id].updated = $.now(); // shothand for (new Date).getTime()
    };


    window.plugin.mtsmon.plot_user = function(data) {
	var latlngs = L.latLng(data.coords[0].lat, data.coords[0].lng);
	
	if (!(data.id in connects)) {
	    connects[data.id] = {};
	    var icon = new plugin.mtsmon.iconRes() 
//	    var marker = new L.marker(latlngs, {icon:icon}).bindPopup("<b>" + data.id + "</b>");
	    var marker = new L.marker(latlngs).bindPopup("<b>" + data.id + "</b>");
	    connects[data.id].marker = marker;
	    window.plugin.mtsmon.layerGroup.addLayer(marker)
	} else {
	    connects[data.id].marker.setLatLng(latlngs);
	}
    }


    setup = function() {
	console.log("MTS monitor setup");
	L.Icon.Default.imagePath = 'http://leafletjs.com/dist/images';
	
	console.log("inject socket.io");
        var proto = document.createElement('script');
        proto.type = 'text/javascript';
        proto.src = '//cdnjs.cloudflare.com/ajax/libs/socket.io/0.9.16/socket.io.min.js';

        var dhead = document.getElementsByTagName('head')[0] || document.documentElement;
        dhead.insertBefore(proto, dhead.firstChild);

	console.log("inject socket.io done");


	window.plugin.mtsmon.layerGroup = new L.LayerGroup();
	window.addLayerGroup('mts player monitor', window.plugin.mtsmon.layerGroup, true);


	var wait_socket = function() {
	    if (!socket && !(typeof window.io == 'undefined')) {
		console.log("MTS connecting socket");
		socket = window.io.connect(service);
		socket.on('load:coords', function(data) {
		    window.plugin.mtsmon.handledata(data);
		});
	    } else {
		window.setTimeout(wait_socket, 100);
	    }
	};
	
	wait_socket();

	// delete inactive users every 15 sec
	var timer = function() {
	    for (var ident in connects){
		if ($.now() - connects[ident].updated > 15000) {
		    window.plugin.mtsmon.layerGroup.removeLayer(connects[ident].marker);
		    delete connects[ident];
		}
	    }
	};
	setInterval( timer , 15000);
    }	

    
    setup.info = plugin_info; //add the script info data to the function as a property
    if("undefined" === window.bootPlugins) window.bootPlugins = [];
    window.bootPlugins.push(setup);
    // if IITC has already booted, immediately run the 'setup' function
    if(window.iitcLoaded && typeof setup === 'function') setup();
} 

// wrapper end

console.log("MTS monitor loading...");


// inject code into site context
var script = document.createElement('script');
var info = {};
if (typeof GM_info !== 'undefined' && GM_info && GM_info.script) info.script = { version: GM_info.script.version, name: GM_info.script.name, description: GM_info.script.description };

script.appendChild(document.createTextNode('('+ wrapper +')('+JSON.stringify(info)+');'));
(document.body || document.head || document.documentElement).appendChild(script);

