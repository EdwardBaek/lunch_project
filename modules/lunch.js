var dbUtil = require("./db_util.js");

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

    if( req.file ){
        var fileName = req.file.filename;
        var imgUrl = uploadsPath + fileName ;
    }else{
        var fileName = 'no_restaurant_image.png';
        var imgUrl = publicImagePath + fileName ;
    }

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
	dbUtil.connectwithSingleQuery(
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