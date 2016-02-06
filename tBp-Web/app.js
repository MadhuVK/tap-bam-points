var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var baseRoutes = require('./routes/index');
var userRoutes = require('./routes/users');
var apiBaseRoutes = require('./routes/api');
var eventRoutes = require('./routes/events');
var adminRoutes = require('./routes/admin');
var errorRoutes = require('./routes/errors');

var config = require('./bin/config')[process.env.NODE_ENV]

var app = express();
var session = require('express-session'); 
var RedisStore = require('connect-redis')(session); 

function baseSetup() {
  app.use(logger('dev'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));

  app.use(cookieParser());
  app.use(session({
    store: new RedisStore({
      host: 'localhost', 
      port: 6379,
      db: 2, 
      pass: "jubyjuby22"
    }), 
    secret: "MY_SECRET_KEY"
  })); 

  app.use(express.static(path.join(__dirname, 'public')));
  app.set('json spaces', 2);
}

function viewEngineSetup() {
  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'ejs');
  app.engine('html', require('ejs').__express); 
}



function routesSetup() {
  app.use(errorRoutes);
  app.use('/', baseRoutes);
  app.use('/admin', adminRoutes); 
  app.use('/api', apiBaseRoutes); 
  app.use('/api/users', userRoutes);
  app.use('/api/events', eventRoutes);
}

baseSetup();
viewEngineSetup();
routesSetup();

app.config = config; 
module.exports = app;
