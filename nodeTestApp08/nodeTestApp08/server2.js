'use strict';

var http = require('http');
var url = require('url');
var querystring = require('querystring');

http.createServer(function(request, response) {

	var pathName = url.parse(request.url).pathname;
	var query = url.parse(request.url).query;
	var id = querystring.parse(query)['id'];

	var result = {
		'pathName': pathName,
		'id': id,
		'value': Math.floor(Math.random() * 1000)
	};

	response.writeHead(200, { "Content-Type": "application/json" });
	response.end(JSON.stringify(result));
}).listen(
	8080,
	function() {
		console.log('Echo Server listening on port 8080');
	}
);