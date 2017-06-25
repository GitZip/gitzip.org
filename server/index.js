process.env.TZ = 'UTC';
var express = require('express');
var app = express();
var http = require('http');

var isProduction = process.env.NODE_ENV === 'production';

// settings for express
require('./config/express')(app);

// routes
require('./config/routes')(app);

http.createServer(app).listen(80);

if(isProduction){
	var https = require('https');
	var fs = require('fs');

	var options = {
		key: fs.readFileSync('/home/ubuntu/.private/gitzip-zerossl.key'),
		cert: fs.readFileSync('/home/ubuntu/.certs/gitzip-zerossl.crt')
	};

	https.createServer(options, app).listen(443);
}

