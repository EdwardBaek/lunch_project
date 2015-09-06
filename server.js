var express = require('express');
var path = require('path');
var app = express();
var mysql = require("mysql");
var dbConnection = mysql.createConnection({
	host	: "localhost",
	port	: 3306,
	user	: "root",
	password: "1234",
	database: "TEST" 
});

dbConnection.connect(function(err) {
    if (err) {
        console.error('mysql connection error');
        console.error(err);
        throw err;
    }else{
    	console.log( "mysql is connected." );
    }
});

app.use( express.static( path.join(__dirname, 'public') ) );

console.log( "__dirname : " + __dirname );
console.log( "__dirname : " + path.join(__dirname, 'public') );

//http network with controller.js
// app.get('/index.html', function(req, res){
// 	console.log("I received a GET request");

// 	var rows = null;
// 	var dbData = dbConnection.query("select * from TEST", function( err, rows ){
// 		console.log( rows );
// 		var result = "";
// 		for( var i=0; i<rows.length; ++i){
// 			result += rows[i].IDX + ":" + rows[i].NAME + "   ";
// 		}
// 		res.json( result );
// 	});

// });

// app.get("/public/", function( req, res, next ){
// 	console.log( "public" );
// 	console.log( req );
// });

// app.get("/insert.html", function( req, res){
// 	var user = {
// 		IDX : 2,
// 		NAME: "NANA"
// 	};
// 	var query = dbConnection.query("INSERT INTO TEST SET ?", user, function( err, result ){
// 		if( err ){
// 			console.error( err );
// 			throw err;
// 		}
// 		console.log(query);
//         res.send(200,'success');
// 	});
// });

app.listen(8800);
console.log('Server running on port 8800');
