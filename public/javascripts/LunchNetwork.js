function LunchNetwork( val ){
	this.idx = val;
}

LunchNetwork.prototype.getIdx = function(){
	return this.idx;
};

//TODO: API 구분
// 반환값: [ { idx, name, imgUrl } ...  ]
LunchNetwork.prototype.getLunchList = function( callback ){
	var query = 'SELECT_ALL_RESTAURANT';
	var result = '';
	result = this.get( query, callback );
	return result;
};

// 반환값: [ { idx, date } ...  ]
LunchNetwork.prototype.getSelectedLunchList = function( callback ){
	var restType = 'GET';
	var api = 'today_lunch_list';
	return this.ajax( restType, api, '', callback );
};

LunchNetwork.prototype.insertTodayLunch = function( callback ){
	
};
LunchNetwork.prototype.get = function( data, callback ){
	var returnValue = '';
	var restType = 'GET'
	return this.ajax( data, restType, callback );
};
LunchNetwork.prototype.post = function( data, callback ){
	var returnValue = '';
	var restType = 'POST'
	return this.ajaxPost( data, callback );
};
LunchNetwork.prototype.put = function( data, callback ){
	var returnValue = '';
	var restType = 'PUT'
	return this.ajax( data, restType, callback );
};
LunchNetwork.prototype.delete = function( data, callback ){
	var returnValue = '';
	var restType = 'DELETE'
	return this.ajax( data, restType, callback );
};

// jQuery 필요
LunchNetwork.prototype.ajax = function( restType, api, data, callback ){
	var returnValue = "";
	var url = '';
	// url = 'http://192.168.0.14:3000/api/';
	url = 'http://localhost:3000/';
	console.log( '---ajax---' );
	console.log( 'restType : ' + restType );
	console.log( 'api : ' + api );
	console.log( 'data : ' );
	console.log( data );

	$.ajax({
		type	: restType,
		url		: "/" + api,
		dataType: "json",
		async	: false,
		data	: data,
		timeout: 5000,
		success: function( result ){
			if( typeof callback === "function" ){
				callback( result );
			}else{
				returnValue = result;
			}
		},
		error: function( request, textStatus, errorThrown ){
			console.log( "error : " + textStatus );
			console.log( request );
		}
	});

	return returnValue;
};

LunchNetwork.prototype.getResultJson = function getResultJson(data, callback){
	var returnValue = "";
	var url = '';
	// url = 'http://192.168.0.14:3000/api/';
	url = 'http://localhost:3000/api/1';
	$.ajax({
		type: "POST",
		async: false,
		url: url,
		dataType: "json",
		data: data,
		timeout: 5000,
		success: function( result ){
			if( typeof callback === "function" ){
				callback( result );
			}else{
				returnValue = result;
			}
		},
		error: function( request, textStatus, errorThrown ){
			console.log( "error : " + textStatus );
			console.log( request );
		}
	});
	return returnValue;
}