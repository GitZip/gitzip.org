process.env.TZ = 'UTC';
var express = require('express');
var app = express();
var http = require('http');

// settings for express
require('./config/express')(app);

// routes
require('./config/routes')(app);

var server = http.createServer(app).listen(app.get('port'));
