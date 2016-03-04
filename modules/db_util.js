var pg = require('pg');
var DB_CONNECTION_INFO = "postgres://postgres:1234@localhost/testdb";;

var DBUtil = function DBUtil(){};
DBUtil.prototype.connectDataBase = function connectDataBase( fnCallback ){
	pg.connect
	(
		DB_CONNECTION_INFO,
		function(err, client, done){
			if(err)
			    return console.error('error fetching client from pool', err);
			fnCallback(err, client, done);
		}
	);
}

DBUtil.prototype.connectWithSingleQuery = function connectwithSingleQuery( query, queryParams, fnSeccessCallback, fnFailCallback){
	if( queryParams.constructor !== Array )
		queryParams = [];
	pg.connect
	(
		DB_CONNECTION_INFO,
		function(err, client, done){
			if(err)
			    return console.error('error fetching client from pool', err);
			client.query( query, queryParams, function(err, result){
				done();
				if(err){
					fnFailCallback(err, result);
					return console.error('error running query', err);
				}
				fnSeccessCallback(err, result);
			});
		}
	);
}


var _dbUtilInstance = new DBUtil();
module.exports = _dbUtilInstance;