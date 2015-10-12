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

var data = require('./src/data.js');

var app = express();

function baseSetup() {
  app.use(logger('dev'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use(express.static(path.join(__dirname, 'public')));
}

function viewEngineSetup() {
  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'jade');
  app.engine('jade', require('jade').__express);
  app.engine('html', require('ejs').__express); 
}

function routesSetup() {
  app.set('json spaces', 2);
  app.use(errorRoutes);
  app.use('/', baseRoutes);
  app.use('/api/users', userRoutes);
  app.use('/api/events', eventRoutes);
}

/* START BLOCK TODO: Move to errors */

/*
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});
*/

/* END BLOCK*/

baseSetup();
viewEngineSetup();
routesSetup();

module.exports = app;
