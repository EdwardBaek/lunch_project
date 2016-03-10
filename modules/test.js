var dbUtil  = require("./db_util.js");
var define  = require("./define.js");
var auth    = require("./auth.js");
var util	= require("./util.js");

var ServerError = function( errorCode, message ){
	this.code = errorCode;
	this.message = message;
};

module.exports.testGet = function( req, res ){
	console.log('testGet');
	console.info('req', req);
	console.info('req.query.name-', req.query.name);

	res.json(
	{	
		'data': 
		{
			'type' : 'get',
			'name' : req.query.name
		}
	}
	);
	res.end();
};
module.exports.testDelete = function( req, res ){
	console.log('testDelete');
	console.info('req', req);
	console.info('req.body.name-', req.body.name);

	res.json(
	{	
		'data': 
		{
			'type' : 'delete',
			'name' : req.body.name
		}
	}
	);
	res.end();
};

module.exports.testPost = function( req, res ){
	console.log('testPost');
	console.info('req', req);
	console.info('req.body.name-', req.body.name);

	res.json(
	{	
		'data': 
		{
			'type' : 'post',
			'name' : req.body.name
		}
	}
	);
	res.end();
};
module.exports.testPut = function( req, res ){
	console.log('testPut');
	console.info('req', req);
	console.info('req.body.name-', req.body.name);

	res.json(
	{	
		'data': 
		{
			'type' : 'put',
			'name' : req.body.name
		}
	}
	);
	res.end();
};

module.exports.testDb = function( req, res ){
	console.log('getTodayLunchList');
	console.log('req.body.name-', req.body.name);
	var query = 'SELECT $1::int AS number';
	dbUtil.connectWithSingleQuery(
		query,
		['1'],
		function success(err, result){
			console.log(result.rows[0].number);
			res.json(
			{	
				'data': 
				{
					'type' : 'put',
					'name' : req.body.name,
					'data' : result.rows[0].number
				}
			}
			);
		},
		function fail(err, result){
			console.log('err' + err);
		}
	);
}

module.exports.testLogin = function( req, res ){
	var requestedToken = req.body.token;
	var requestedEmail = req.body.email;

	if( requestedToken !== undefined 
		&& requestedToken !== null 
		&& requestedToken !== ''
		&& auth.isValidToken( requestedToken ) ){
		if( auth.isValidTokenUser( requestedToken, requestedEmail ) ){
			auth.reissueToken( requestedToken );
			util.responseWithData( res, define.httpStatusCode.OK, { logintype : "token" });
			return;
		}
	}

	console.info('token', requestedToken);
	var requestedPw = req.body.pw;
	//TODO: check value of params.

	testLoginDbTask(
		requestedToken,
		requestedEmail,
		requestedPw,
		function success(result){
			util.responseWithData( res, define.httpStatusCode.OK, result );
		},
		function fail(err){
			util.responseWithData( res, define.httpStatusCode.BAD_REQUEST, err );
		}
	);
};

function testLoginDbTask( token, email, password, fnSuccessCallback, fnFailCallback ){
	var token;
	var userData = {};
	userData.token = token;
	dbUtil.connectWithQueries(
		function getUserData(err, client, done, callback){
			console.log('getUserData...');
			var query = ''
			+ ' SELECT id, email, password'
			+ '   FROM t_user'
			+ '  WHERE email = $1'
			+ '';
			var params = [email];
			console.info('query', query);
			console.info('email', params);
			client.query(
				query,
				params,
				function(err, result){
					if(err)
						return callback(new ServerError(123, 'query error'));
					if( result.rowCount < 1)
						return callback(new ServerError(1234, 'Invalid Email.'));

					console.info('result:', result);
					callback(null, result.rows[0]);
				}
			);
		},
		function checkUserData(result, callback){
			console.log('checkUserData...');
			if( result.password !== password )
				return new ServerError(123, 'Invalid Password');
			callback(null);
		},
		function issueNewToken(callback){
			console.log('issueNewToken...');			
			userData.token = auth.issueNewToken(email, email);
			console.info('NewToken', userData.token);
			console.info('auth.tokenTable', auth.tokenTable);

			var userSessionData = 
			{
				email 	: email,
				name 	: email,
				type 	: userData.type,
				token 	: userData.token,
				loginType : "password"
			};			
			callback(null, userSessionData);
		},
		fnSuccessCallback,
		fnFailCallback
	);
}

module.exports.testSignup = function( req, res ){
	var requestedEmail = req.body.email;
	var requestedPw = req.body.pw;
	//TODO: check value of params.

	console.info('requestedEmail : ', requestedEmail);
	console.info('requestedPw : ', requestedPw);
	testSignupDbTask(
		requestedEmail,
		requestedPw,
		function success(result){
			console.log('testSignup success');
			console.info('result', result);
			util.responseWithData( res, define.httpStatusCode.OK, result );
		},
		function fail(error){
			console.log('testSignup fail');
			console.info('error', error);
			util.responseWithData( res, define.httpStatusCode.BAD_REQUEST, error );
		}
	);	
}

var testSignupDbTask = function(email, password, fnSuccessCallback, fnFailCallback){
	
	dbUtil.connectWithQueries(
		function checkUserEmail(err, client, done, callback){
			console.log('checkUserDate...');
			var query = 'SELECT * from t_user where email = $1';
			var params = [ email ];
			client.query(
				query,
				params,
				function(err, result){
					if(err)
						return callback(new ServerError(1234, 'running query error.'));

					if( 0 < result.rowCount )
						return callback(new ServerError(1234, 'Already Used Email.'));

					callback(null, result.rows, client, done);
				}
			);
		},		
		function insertNewUserData(result, client, done, callback){
			console.log('insertNewUserData...');
			var query = ''
					+ ' INSERT INTO t_user( email, password, name, type) '
					+ ' VALUES( $1, $2, $3, $4 )'
					+ '';
			var name = email;
			var type = 'user';
			var params = 
			[ 
				email,
				password,
				email,
				type
			];

			console.info('query', query);
			console.info('params', params);
			
			client.query(
				query,
				params,
				function(err, result){
					if(err)
						return callback(new ServerError(1234, 'Internal Server Error.'));
					var userSessionData =
					{
						redirectUrl : '/dashboard'
					};
					console.info('insertNewUserData result:', result);
					callback(null, userSessionData);
				}
			);
		},
		fnSuccessCallback,
		fnFailCallback
	);
};





