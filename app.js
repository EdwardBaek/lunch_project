/**************************************************************************************************
    FileName        : app.js
    Description     : 

    Update History
      2015.09. 04(Fri)       Edward       Create 
**************************************************************************************************/
'use strict'

var express       = require('express');
var path          = require('path');
var favicon       = require('serve-favicon');
var logger        = require('morgan');
var routes        = require('./routes/index');
var users         = require('./routes/users');
var fs            = require('fs');
var bodyParser    = require('body-parser');
var cookieParser  = require('cookie-parser');
var multer        = require('multer');
var app           = express();




app.use( bodyParser.json() );
// TODO: 아래 관련 정보 정리. post시 body정보 에러 있었음.
app.use( bodyParser.urlencoded({ extended : false}) );
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use( logger('dev') );

require('./apiController.js').setApi(app);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

//routes
app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});


// error handlers
if (app.get('env') === 'development') {
  // development error handler
  // will print stacktrace
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}else{
  // production error handler
  // no stacktraces leaked to user
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: {}
    });
  });  
}


module.exports = app;