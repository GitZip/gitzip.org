process.env.TZ = 'UTC';
var express = require('express');
var app = express();
var http = require('http');

// settings for express
require('./config/express')(app);

// routes
require('./config/routes')(app);

http.createServer(app).listen(3000);
