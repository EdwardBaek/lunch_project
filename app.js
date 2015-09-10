/**************************************************************************************************
    FileName        : app.js
    Description     : 

    Update History
      2015.09. 04(Fri)       Edward       Create 
**************************************************************************************************/

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

var mysql = require( 'mysql' );
var dbConnection = mysql.createConnection({
  host  : "localhost",
  port  : 3306,
  user  : "root",
  password: "1234",
  database: "lunch" 
});

//
app.use( bodyParser.json() );
//
app.use( bodyParser.urlencoded() );

//TODO: 쿼리 정리
function getSelectRows( query, rowNumber, pageNumber ){
  var formatedQuery = '';
  if( rowNumber ||  pageNumber){
    rowNumber = 5;
    pageNumber = 1;
  }
  var preQuery = '\
    SELECT *, ( @ROWNUM) TOTAL\
      FROM (\
            SELECT DUMMY.*, ( @ROWNUM :=  @ROWNUM + 1 ) ROWNUM\
              FROM (';
  var endQuery = '\
                    ) DUMMY\
                   , (SELECT @ROWNUM:=0) R\
           ) LIST\
     WHERE LIST.ROWNUM >= ( {ROW_CNT} * ({PAGE_NO} -1)+1)\
       AND LIST.ROWNUM <= ( {ROW_CNT} * {PAGE_NO} )\
  ORDER BY LIST.ROWNUM';

  formatedQuery = preQuery + query + endQuery;

  return formatedQuery;
}


// api test
function printJson( json ){
    var result = 'jsonDate : \n';
    for( object  in json ){
        result += object + ':' + json[object] + '\n';
    }
    console.log( result );
}


app.get('/restaurant_list', function(req, res){
    console.log("I received a GET request");
    var query = 'SELECT * FROM RESTAURANTS';
    var dbData = dbConnection.query( query, function( err, rows ){
        console.log( 'mysql query' );
        if ( err ){
            console.error( err );
        }else{
          console.log( rows );
          res.json( rows );
        }
        console.log('---get end---');
    });
});

app.get('/today_lunch_list', function(req, res){
    console.log("I received a GET request");
    var query = 'SELECT * FROM TODAY_LUNCH';
    var dbData = dbConnection.query( query, function( err, rows ){
        console.log( 'mysql query' );
        if ( err ){
            console.error( err );
        }else{
          console.log( rows );
          res.json( rows );
        }
        console.log('---get end---');
    });
});

//curl POST -H "Content-Type: application/json" http://localhost:3000/new_restaurant -v -d "{\"NAME\":\"NATHAN\"}" 
//curl POST "http://127.0.0.1/inner-api/settings/starred/messages/8" -H "Content-Type: application/json" 

app.post('/new_restaurant', function(req, res){
    console.log( 'req.body' );
    console.log( req.body );  
    printJson( req.body );
    var name = req.body.NAME;
    var imgUrl = req.body.IMG_URL;
    var idx = req.body.IDX;
    console.log( 'req.body.NAME : ' + name );  
    console.log( 'req.body.IMG_URL : ' + imgUrl );  

    var query = '';
    query += 'INSERT INTO TODAY_LUNCH VALUES( "'+ idx + '", NOW() )';
    console.log( 'query :\n' + query );

    var dbData = dbConnection.query( query, function( err, rows ){
      console.log( rows );
      res.json( rows );
      console.log('---newRestaurant end---');
  });
});



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

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


module.exports = app;
