// var express = require('express');
// var session = require('express-session');
var session = require('cookie-session');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var path = require('path');
var secrets = require('./secrets');

module.exports = function (app) {
  var isProduction = process.env.NODE_ENV === 'production';
  
  // app.set('port', 80);

  // X-Powered-By header has no functional value.
  // Keeping it makes it easier for an attacker to build the site's profile
  // It can be removed safely
  app.disable('x-powered-by');
  app.set('views', path.join(__dirname, '..', 'views'));
  app.set('case sensitive routing', true);
  app.set('view engine', 'ejs');
  app.set('view cache', false);

  if(isProduction) {
    app.use(session({
      secret: secrets.session_secret,
      cookie: { maxAge: 10 * 24 * 60 * 60 * 1000 } // 10 days
    })); // session secret  
  }else{
    app.use(session({ secret: secrets.session_secret })); // session secret  
  }

  app.use(cookieParser());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({extended: true})); // for parsing application/x-www-form-urlencoded

};