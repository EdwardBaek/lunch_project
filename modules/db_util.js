var pg = require('pg');
var devDefine = require('./dev.define.js');
var DB_CONNECTION_INFO = devDefine.DB_CONNECTION_INFO;
console.log("DB_CONNECTION_INFO",DB_CONNECTION_INFO);
var async = require('async');

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
/* query, queryParams, fnSeccessCallback, fnFailCallback */
DBUtil.prototype.connectWithQueries = function connectWithQueries(){
	// console.info( '\nDBUtil.connectWithQueries', arguments );	
	var fnDbDone;
	var fnDbClient;
	var fnSuccessCallback = arguments[ arguments.length - 2 ];
	var fnFailCallback = arguments[ arguments.length - 1 ];
	var arFunctions = 
	[
		function connectDataBase(callback){
			// console.info('_dbUtilInstance', _dbUtilInstance);
			_dbUtilInstance.connectDataBase(
				function(err, client, done){
					fnDbDone = done;
					fnDbClient = client;
					callback(null, err, client, done);
				}
			);
		}
	];
	for( var i = 0; i < arguments.length - 2; ++i)
		arFunctions.push(arguments[i]);
	async.waterfall(
		arFunctions,
		function waterfallEnd(err, result){
			fnDbDone();
			// console.info('waterfallEnd err : ', err);

			if(err)
				fnFailCallback(err);
			else
				fnSuccessCallback(result);
		}
	);

};

var _dbUtilInstance = new DBUtil();
module.exports = _dbUtilInstance;