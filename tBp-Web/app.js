var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var baseRoutes = require('./routes/index');
var userRoutes = require('./routes/users');
var eventRoutes = require('./routes/events');
var errorRoutes = require('./routes/errors');

var engines = require('consolidate')
var config = require('./bin/config')[process.env.NODE_ENV]

var app = express();

function baseSetup() {
  app.use(logger('dev'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use(express.static(path.join(__dirname, 'public')));
  app.set('json spaces', 2);
}

function viewEngineSetup() {
  app.set('views', path.join(__dirname, 'views'));
  app.engine('html', require('ejs').__express); 
}



function routesSetup() {
  app.use(errorRoutes);
  app.use('/', baseRoutes);
  app.use('/api/users', userRoutes);
  app.use('/api/events', eventRoutes);
}

baseSetup();
viewEngineSetup();
routesSetup();

app.config = config; 
module.exports = app;
