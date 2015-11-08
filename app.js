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

var app     = express();

// var upload  = multer( { dest: './public/uploads' });
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/uploads')
    },
    filename: function (req, file, cb) {
      console.log( file );
      cb(null, Date.now() + '-' +  file.originalname )
    }
})

var upload = multer({ storage: storage })


console.log('lunch server started...');
// TODO: logger use / mysql log
app.use( bodyParser.json() );
// TODO: 아래 관련 정보 정리. post시 body정보 에러 있었음.
app.use( bodyParser.urlencoded({ extended : false}) );


app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use( logger('dev') );


// TODO: RESTFULL API 모듈화
// TODO: 기능에 따른 API 재설
// TODO: mysql 모듈화
var mysql = require( 'mysql' );
var dbConnection = mysql.createConnection({
  host  : "localhost",
  port  : 3306,
  user  : "root",
  password: "1234",
  database: "lunch" 
});


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


app.get('/api/restaurant_list', function(req, res){
    console.log("/api/restaurant_list");
    var query = 'SELECT IDX, NAME, IMG_URL, DATE_FORMAT( REG_DATE, "%Y-%m-%d" ) AS REG_DATE FROM RESTAURANTS ORDER BY IDX DESC';
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

app.get('/api/today_lunch_list', function(req, res){
    console.log("/api/today_lunch_list");
    var baseRowNum = 5;
    var query = ''
               + ' SELECT LIST.IDX, DATE_FORMAT( LAUNCH.REG_DATE, "%Y-%m-%d" ) AS REG_DATE, '
               + '      LIST.NAME, LIST.IMG_URL '
               + ' FROM TODAY_LUNCH AS LAUNCH '
               + ' LEFT OUTER JOIN RESTAURANTS AS LIST ON (LAUNCH.RESTAURANTS_IDX = LIST.IDX) '
               + ' ORDER BY LAUNCH.REG_DATE desc' 
               + ' LIMIT 0, ' + baseRowNum + ';';
    console.log( 'query : ' + query );

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

app.get('/api/today_lunch_list_all', function(req, res){
    console.log("/api/today_lunch_list");
    var baseRowNum = 5;
    var query = ''
               + ' SELECT LIST.IDX, DATE_FORMAT( LAUNCH.REG_DATE, "%Y-%m-%d" ) AS REG_DATE, '
               + '      LIST.NAME, LIST.IMG_URL '
               + ' FROM TODAY_LUNCH AS LAUNCH '
               + ' LEFT OUTER JOIN RESTAURANTS AS LIST ON (LAUNCH.RESTAURANTS_IDX = LIST.IDX) '
               + ' ORDER BY LAUNCH.REG_DATE desc;'; 
    console.log( 'query : ' + query );

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


app.post('/api/new_restaurant', function(req, res){
    console.log("/api/new_restaurant");
    console.info( 'req.body', req.body );
    // printJson( req.body );
    var idx     = req.body.IDX;
    var name    = req.body.NAME;
    var imgUrl  = req.body.IMG_URL;
    console.log( 'req.body.IDX : ' + idx );  
    console.log( 'req.body.NAME : ' + name );  
    console.log( 'req.body.IMG_URL : ' + imgUrl );  

    var query = ''
              + 'INSERT INTO TODAY_LUNCH VALUES( "'+ idx + '", NOW() )';
    console.log( 'query :\n' + query );

    var dbData = dbConnection.query( query, function( err, rows ){
      console.log( rows );
      res.json( rows );
      console.log('---newRestaurant end---');
    });
});

app.put('/api/reset_today_lunch', function(req, res){
    console.log("/api/reset_today_lunch");
    console.info( 'req.body', req.body );
    res.send( req.body );
});

app.delete('/api/delete_today_lunch', function(req, res){
    console.log("/api/delete_today_lunch");
    console.info( 'req.body', req.body );
    var query = ''
              + 'DELETE '
              + '  FROM TODAY_LUNCH '
              + ' WHERE REG_DATE = DATE_FORMAT( NOW(), "%Y-%m-%d" );';
    console.log( 'query :\n' + query );
    var dbData = dbConnection.query( query, function( err, rows ){
        console.log( rows );
        res.json( rows );
        console.log('---delete_today_lunch end---');
    });
});

app.post('/api/file_upload', upload.single('uploadFile'), function(req, res) {
    console.log("/api/file_upload");
    console.info( 'req.file', req.file );
    console.info( 'req.file.filename', req.file.filename );
    console.info( 'req.body', req.body );    
    res.end();
});

app.post('/api/add_new_restaurant', upload.single('uploadFile'), function(req, res) {
    console.log("/api/add_new_restaurant");
    var publicImagePath = '/images/';
    var uploadsPath = '/uploads/';
    var fileName = '';
    var imgUrl = '';
    var restaurantName = req.body.restaurantName;
    
    if( req.file == undefined ){
        console.warn( 'no file uploaded' );
        fileName = 'no_restaurant_image.png';
        imgUrl = publicImagePath + fileName ;
    }else{
        fileName = req.file.filename;
        imgUrl = uploadsPath + fileName ;
    }

    console.info( 'req.body', req.body );    
    console.info( 'restaurantName', restaurantName )
    console.info( 'imgUrl', imgUrl )

    var query = ''
              + ' INSERT INTO RESTAURANTS ( NAME,  IMG_URL, REG_DATE ) '
              + '                 VALUES  ( "' + restaurantName + '", "' + imgUrl + '", NOW() ); ';
    console.log( 'query :\n' + query );

    var dbData = dbConnection.query( query, function( err, rows ){
      console.log( rows );
      res.json( rows );
      console.log('---newRestaurant end---');
    });
    // TODO: set redirection page
    // res.end();
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));



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
