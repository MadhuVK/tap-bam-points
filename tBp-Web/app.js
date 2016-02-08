var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var sassMiddleware = require('node-sass-middleware');

var auth_helper = require('./src/auth_helper');
var baseRoutes = require('./routes/index');
var userRoutes = require('./routes/users');
var apiBaseRoutes = require('./routes/api');
var eventRoutes = require('./routes/events');
var adminRoutes = require('./routes/admin');
var errorRoutes = require('./routes/errors');

var config = require('./bin/config')[process.env.NODE_ENV];

var app = express();

app.use(sassMiddleware({
    src: path.join(__dirname, 'public/stylesheets'),
    dest: path.join(__dirname, 'public/stylesheets'),
    debug: true,
    outputStyle: 'compressed',
    prefix: '/stylesheets', // Where prefix is at <link rel="stylesheets" href="prefix/style.css"/>
}));

baseSetup();
viewEngineSetup();
routesSetup();

app.config = config;
module.exports = app;

function baseSetup() {
  app.use(express.static(path.join(__dirname, 'public')));
  app.use(logger('dev'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.set('json spaces', 2);
}

function viewEngineSetup() {
    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'ejs');
    app.engine('html', require('ejs').__express);
}

function routesSetup() {
  app.use(errorRoutes);
  app.use('/', auth_helper.checkToken);
  app.use('/', baseRoutes);
  app.use('/admin', adminRoutes); 
  app.use('/api', apiBaseRoutes); 
  app.use('/api/users', userRoutes);
  app.use('/api/events', eventRoutes);
}
