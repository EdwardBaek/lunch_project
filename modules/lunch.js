var dbUtil  = require("./db_util.js");
var define  = require("./define.js");
var auth    = require("./auth.js");
var util	= require("./util.js");

var ServerError = function( errorCode, message ){
	this.errorCode = errorCode;
	this.message = message;
};

module.exports.getRestaurantList = function( req, res ){
	console.log('getRestaurantList');
	var query = '' 
		 + 'SELECT id, name, img_url, reg_date '
		 + '  FROM t_restaurant_list'
		 + ' ORDER BY id desc ' 
		 + ' LIMIT $1 OFFSET $2'
		 ;
	var nLimitNum = req.params.num;
	var nOffsetNum = req.params.offset;

	console.log('nLimitNum:' + nLimitNum);
	console.log('nOffsetNum:' + nOffsetNum);

	nLimitNum = Number(nLimitNum);
	nOffsetNum = Number(nOffsetNum);

	dbUtil.connectWithSingleQuery(
		query,
		[nLimitNum, nOffsetNum],
		function success(err, result){
			// console.log(result.rows);
			res.json( {'data':result.rows} );
		},
		function fail(err, result){
			console.log('err' + err);
			res.json( {'data': err} );
		}
	);
}

module.exports.getRandomRestaurantList = function( req, res ){
	console.log('getRandomRestaurantList');
	var query = '' 
		 + 'SELECT id, name, img_url, reg_date '
		 + '  FROM t_restaurant_list'
		 + ' ORDER BY random() ' 
		 + ' LIMIT $1 '
		 ;
	var nLimitNum = req.params.num;
	if( !nLimitNum || nLimitNum > 21){
		nLimitNum = 20; //default and maximum
	}
	var params = [nLimitNum];
	console.info('query:', query);
	console.info('nLimitNum:', params);

	dbUtil.connectWithSingleQuery(
		query,
		[nLimitNum],
		function success(err, result){
			// console.log(result.rows);
			res.json( {'data':result.rows} );
		},
		function fail(err, result){
			console.log('err' + err);
		}
	);
}

module.exports.getRandomRestaurantListWithRecentTodayLunch = function( req, res ){
	console.log('getRandomRestaurantList');

	var returnData = 
	{
		randomRestaurantList : {},
		recentTodayList : {},
	};
	dbUtil.connectWithQueries(
		function getRandomRestaurantList(err, client, done, callback){
			console.log('getRandomRestaurantList...');
			
			var query = '' 
				 + 'SELECT id, name, img_url, reg_date '
				 + '  FROM t_restaurant_list'
				 + ' ORDER BY random() ' 
				 + ' LIMIT $1 '
				 ;
			var nLimitNum = req.params.num;
			if( !nLimitNum || nLimitNum > 21){
				nLimitNum = 20; //default and maximum
			}
			var params = [nLimitNum];
			console.info('query:', query);
			console.info('nLimitNum:', params);
			client.query(
				query,
				params,
				function(err, result){
					if(err)
						return callback(new ServerError(123, 'query error'));
					// if( result.rowCount < 1)
					// 	return callback(new ServerError(1234, 'Invalid Email.'));

					console.info('result:', result);
					callback(null, result, client, done);
					returnData.randomRestaurantList = result.rows;
					console.info('returnData.randomRestaurantList:', returnData.randomRestaurantList);
				}
			);
		},
		function getRecentTodayList(result, client, done, callback){
			console.log('getRecentTodayList...');
			var query = ''  
				 + 'SELECT trl.id, trl.name, trl.img_url, tlt.date '
				 + '  FROM t_lunch_today tlt,'
				 + ' 	   t_restaurant_list trl '
				 + ' WHERE tlt.restaurant_id = trl.id '
				 + ' ORDER BY tlt.date desc' 
				 + ' LIMIT $1 OFFSET $2'
				 ;
			var nLimitNum = Number(5);
			var nOffsetNum = Number(0);
			var params = 
			[ 
				nLimitNum,
				nOffsetNum
			];

			console.info('query', query);
			console.info('params', params);
			
			client.query(
				query,
				params,
				function(err, result){
					if(err)
						return callback(new ServerError(1234, 'Internal Server Error.'));

					console.info('getRecentTodayList result:', result);
					console.info('returnData.recentTodayList:', returnData.recentTodayList);
					returnData.recentTodayList = result.rows;
					callback(null, result);
				}
			);
		},
		function getRandomTodayRestaurant(result, callback){
			console.log("sd");
			callback(null, result);
		},
		function success(result){
			util.responseWithData( res, define.httpStatusCode.OK, {data:returnData} );
		},
		function fail(error){
			util.responseWithData( res, define.httpStatusCode.BAD_REQUEST, error );
		}
	);
}

module.exports.getNewTodayRestaurantWithSaving = function( req, res ){
	console.log('getNewTodayRestaurantWithSaving');

	var hasTodayRestaurant = false;
	dbUtil.connectWithQueries(
		function getTodayRestaurant(err, client, done, callback){
			console.log('getTodayRestaurant...');
			var query = ''  
				 + 'SELECT trl.id, trl.name, trl.img_url, tlt.date '
				 + '  FROM t_lunch_today tlt,'
				 + ' 	   t_restaurant_list trl '
				 + ' WHERE tlt.restaurant_id = trl.id '
				 + ' 		AND tlt.date = now()::date' 
				 ;
			console.info('query :\n ', query);
			
			client.query(
				query,
				[],
				function(err, result){
					if(err)
						return callback(new ServerError(123, 'query error'));
					// if( result.rowCount < 1)
					// 	return callback(new ServerError(1234, 'Invalid Email.'));

					if( result.rows.length > 0)
						hasTodayRestaurant = true;
					console.info('result :\n', result);
					console.info('hasTodayRestaurant :\n', hasTodayRestaurant);
					
					callback(null, result.rows[0], client, done);
				}
			);
		},
		function getRandomRestaurant(result, client, done, callback){
			if( hasTodayRestaurant){
				callback(null, result);
			}else{
				console.log('getRandomRestaurant...');
					var query = '' 
					 + 'WITH today_lunch AS ( '
					 + 'SELECT id  '
					 + '  FROM ( '
					 + '	SELECT id FROM t_restaurant_list '
					 + '	EXCEPT '
					 + '	SELECT restaurant_id  '
					 + '		FROM (  '
					 + '				SELECT restaurant_id ' 
					 + '				FROM t_lunch_today  '
					 + '				ORDER BY date desc  '
					 + '				LIMIT 5  '
					 + '			) as limited_tlt '
					 + '	) AS candidate_t '
					 + ' ORDER BY random() '
					 + ' LIMIT 1 '
					 + '), reset_today_lunch AS ( '
					 + 'DELETE FROM t_lunch_today '
					 + 'WHERE date = now()::date '
					 + '), insert_value_table AS ('
					 + 'INSERT INTO t_lunch_today(restaurant_id) ' 
					 + '	SELECT today_lunch.id  '
					 + '	  FROM today_lunch  '
					 + '	RETURNING * '
					 + ')	 '
					 + 'SELECT trl.*	 '
					 + '  FROM insert_value_table tlt,	 '
					 + '		 t_restaurant_list trl'
					 + ' WHERE trl.id = tlt.restaurant_id	 '
					 + '	 '
					 ;

				console.info('query:', query);
				client.query(
					query,
					[],
					function(err, result){
						if(err)
							return callback(new ServerError(1234, 'Internal Server Error.'));

						console.info('getRecentTodayList result:', result);
						callback(null, result.rows[0]);
					}
				);
			}
		},
		function getRandomTodayRestaurant(result, callback){
			console.log("sd");
			callback(null, result);
		},
		function success(result){
			util.responseWithData( res, define.httpStatusCode.OK, {data:result} );
		},
		function fail(error){
			util.responseWithData( res, define.httpStatusCode.BAD_REQUEST, error );
		}
	);
}

module.exports.getNewTodayRestaurantWithSavingReset = function( req, res ){
	console.log('getNewTodayRestaurantWithSavingReset');

	var query = '' 
		 + 'WITH today_lunch AS ( '
		 + 'SELECT id  '
		 + '  FROM ( '
		 + '	SELECT id FROM t_restaurant_list '
		 + '	EXCEPT '
		 + '	SELECT restaurant_id  '
		 + '		FROM (  '
		 + '				SELECT restaurant_id ' 
		 + '				FROM t_lunch_today  '
		 + '				ORDER BY date desc  '
		 + '				LIMIT 5  '
		 + '			) as limited_tlt '
		 + '	) AS candidate_t '
		 + ' ORDER BY random() '
		 + ' LIMIT 1 '
		 + '), reset_today_lunch AS ( '
		 + 'DELETE FROM t_lunch_today '
		 + 'WHERE date = now()::date '
		 + '), insert_value_table AS ('
		 + 'INSERT INTO t_lunch_today(restaurant_id) ' 
		 + '	SELECT today_lunch.id  '
		 + '	  FROM today_lunch  '
		 + '	RETURNING * '
		 + ')	 '
		 + 'SELECT trl.*	 '
		 + '  FROM insert_value_table tlt,	 '
		 + '		 t_restaurant_list trl'
		 + ' WHERE trl.id = tlt.restaurant_id	 '
		 + '	 '
		 ;
 		
	console.info('query:\n', query);
	dbUtil.connectWithSingleQuery(
		query,
		[],
		function success(err, result){
			// console.log(result.rows);
			res.json( {'data':result.rows[0]} );
		},
		function fail(err, result){
			console.log('err' + err);
		}
	);
}

module.exports.getRandomTodayLunch = function( req, res ){
	console.log('getRandomRestaurantList');

	var query = ''  
		 + 'SELECT trl.id, trl.name, trl.img_url, tlt.date '
		 + '  FROM t_lunch_today tlt,'
		 + ' 	   t_restaurant_list trl '
		 + ' WHERE tlt.restaurant_id = trl.id '
		 + ' ORDER BY random() ' 
		 + ' LIMIT 1 '

	console.info('query:', query);
	dbUtil.connectWithSingleQuery(
		query,
		[],
		function success(err, result){
			// console.log(result.rows);
			res.json( {'data':result.rows} );
		},
		function fail(err, result){
			console.log('err' + err);
		}
	);
}

module.exports.getTodayLunchList = function( req, res ){
	console.log('getTodayLunchList');
	var query = ''  
		 + 'SELECT trl.id, trl.name, trl.img_url, tlt.date '
		 + '  FROM t_lunch_today tlt,'
		 + ' 	   t_restaurant_list trl '
		 + ' WHERE tlt.restaurant_id = trl.id '
		 + ' ORDER BY tlt.date desc' 
		 + ' LIMIT $1 OFFSET $2'
		 ;
	var nLimitNum = Number(req.params.num);
	var nOffsetNum = Number(req.params.offset);
	console.log('nLimitNum:' + nLimitNum);
	console.log('nOffsetNum:' + nOffsetNum);
	dbUtil.connectWithSingleQuery(
		query,
		[nLimitNum, nOffsetNum],
		function success(err, result){
			// console.log(result.rows);
			res.json( {'data':result.rows} );
		},
		function fail(err, result){
			console.log('err' + err);
		}
	);
};

module.exports.addNewRestaurant = function( req, res ){
    console.log("addNewRestaurant");
    console.log("req:" + req );
    var publicImagePath = '/images/';
    var uploadsPath = '/uploads/';
    var restaurantName = req.body.restaurantName;
    console.log("------");
    console.log("req:");
    console.dir(req ,{depth:1})
    console.log("------");

    if( req.file ){
        var fileName = req.file.filename;
	    console.log("req:" + req.file.filename );
	    console.log("req:" + req.file );
        var imgUrl = uploadsPath + fileName ;
    }else{
        var fileName = 'no_restaurant_image.png';
        var imgUrl = publicImagePath + fileName ;
    }

    console.log("req.body.restaurantName:" + req.body.restaurantName );
    console.log("req.file.filename:" + req.file.filename );

    var query = ''
              + ' INSERT INTO '
              + ' t_restaurant_list ( name,	img_url,	reg_date ) '
              + '           VALUES  ( $1, 	$2, 		NOW() ); ';

	dbUtil.connectWithSingleQuery(
		query,
		[restaurantName, imgUrl],
		function success(err, result){
			console.log(result.rows);
		    res.writeHead( 302, { "Location":"/" });
		    res.end();
		    // res.json( {'result':result.rows} );
		    console.log('---addNewRestaurant end---');
		},
		function fail(err, result){
			console.log('err' + err);
			res.writeHead( 302, { "Location":"/" });
		}
	);
};


module.exports.insertNewTodayLunch = function insertNewTodayLunch( req, res ){
	var id = req.body.id;
	id = Number(id);	
	console.info('insertNewTodayLunch', id );
	var query = ''
              + ' INSERT INTO '
              + ' t_lunch_today ( restaurant_id,	date ) '
              + '       VALUES  ( $1, 				NOW() ); ';
    dbUtil.connectWithSingleQuery(
    	query,
    	[ id ],
    	function success(err, result){
    		// console.info('s', result );
    		res.json({'result':'ok'});
    	},
    	function fail(err, result){
    		console.log('f');
    		res.json({'result':'not ok'});
    	}
	);
};

module.exports.deleteTodayLunch = function deleteTodayLunch( req, res ){
	var query = 'DELETE FROM t_lunch_today'
			  + ' WHERE date = date(now()) '
			  + ''
			  + ''
			  + '';
	dbUtil.connectWithSingleQuery(
		query,
		[],
		function success(err, result){
			console.log('deleteTodayLunch s');
			res.json({'data':'ok'});
		},
		function fail(err, result){
			console.info('deleteTodayLunch', err);
			res.json({'data':'not ok'});
		}
	);
};

module.exports.deleteRestaurant = function deleteRestaurant( req, res ){
	var restaurantId = req.params.id;
	console.log("deleteRestaurant restaurantId:", req.body.id + "/" + req.params.id)
	if(!restaurantId)
		restaurantId = 0;

	var query = 'DELETE FROM t_restaurant_list'
			  + ' WHERE id = $1 '
			  + ''
			  + ''
			  + '';
	dbUtil.connectWithSingleQuery(
		query,
		[restaurantId],
		function success(err, result){
			console.log('deleteRestaurant susseed');
			res.json({'data': restaurantId + ' is deleted ok'});
		},
		function fail(err, result){
			console.info('deleteRestaurant', err);
			res.json({'data':'not ok'});
		}
	);
};


module.exports.login = function( req, res ){
	var requestedToken = req.header("Auth");
	var requestedEmail = req.body.email;
	var requestedPassword = req.body.password;
	var loginType = req.body.loginType;

	console.info('requestedToken', requestedToken);
	console.info('requestedToken', typeof requestedToken);

	if( loginType === 'token'){
		var isValidToken = auth.isValidToken( requestedToken );
		console.info('isValidToken', isValidToken);		
		if( isValidToken ){
			if( auth.isValidTokenUser( requestedToken, requestedEmail ) ){
				auth.reissueToken( requestedToken );
				util.responseWithData( res, define.httpStatusCode.OK, { logintype : "token" });
				return;
			}else{
				util.responseWithData( res, define.httpStatusCode.BAD_REQUEST, new ServerError(1817, 'Invalid Token User.'));
				return;
			}
		}else{
			util.responseWithData( res, define.httpStatusCode.BAD_REQUEST, new ServerError(1818, 'Invalid Token.'));
			return;
		}
	}

	//TODO: check value of params.
	loginDbTask(
		requestedToken,
		requestedEmail,
		requestedPassword,
		function success(result){
			console.info('loginDbTask-success', result);
			// util.responseWithData( res, define.httpStatusCode.OK, result );
			var token = result.token;
			var head =
			{
				"Content-Type" : "application/json",
				"Auth" : token
			};
			util.responseWithHeadAndData( res, define.httpStatusCode.OK, head, result );
		},
		function fail(err){
			console.info('loginDbTask-fail', err);
			util.responseWithData( res, define.httpStatusCode.BAD_REQUEST, err );
		}
	);
};

function loginDbTask( token, email, password, fnSuccessCallback, fnFailCallback ){
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
				return callback(new ServerError(123, 'Invalid Password'));
			callback(null);
		},
		function issueNewToken(callback){
			console.log('issueNewToken...');			
			userData.token = auth.issueNewToken(email, email);

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

module.exports.signup = function( req, res ){
	var requestedEmail = req.body.email;
	var requestedPw = req.body.password;
	//TODO: check value of params.

	console.info('requestedEmail : ', requestedEmail);
	console.info('requestedPw : ', requestedPw);
	signupDbTask(
		requestedEmail,
		requestedPw,
		function success(result){
			util.responseWithData( res, define.httpStatusCode.OK, result );
		},
		function fail(error){
			util.responseWithData( res, define.httpStatusCode.BAD_REQUEST, error );
		}
	);	
}

var signupDbTask = function(email, password, fnSuccessCallback, fnFailCallback){
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
						return callback(new ServerError(1230, 'running query error.'));

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


