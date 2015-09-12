function LunchNetwork( val ){
	this.idx = val;
}

LunchNetwork.prototype.getIdx = function(){
	return this.idx;
};

//TODO: API 구분
// 반환값: [ { idx, name, imgUrl } ...  ]
LunchNetwork.prototype.getRestaurantList = function( callback ){
	var api = 'restaurant_list/';
	var data = {};
	return this.get( api, data, callback );
};

LunchNetwork.prototype.deleteTodayLunch = function( callback ){
	var api = 'delete_today_lunch';
	var data = {idx : 1 };
	return this.delete( api, data, callback );
};

// 반환값: [ { idx, date } ...  ]
LunchNetwork.prototype.getSelectedLunchList = function( callback ){
	var api = 'today_lunch_list';
	var data = { idx : 1 };
	return this.get( api, data, callback );
};

LunchNetwork.prototype.getSelectedLunchListAll = function( callback ){
	var api = 'today_lunch_list_all';
	var data = {};
	return this.get( api, data, callback );
};

LunchNetwork.prototype.insertTodayLunch = function( data ){
	console.info( 'insertTodayLunch', data );
	var api = 'new_restaurant';
	var data = data ;
	var callback = '';
	return this.post( api, data, callback );
};

// FIXME: There should be better way...
LunchNetwork.prototype.get = function( api, data, callback ){
	var returnValue = '';
	var restType = 'GET'
	return this.ajax( restType, api, data, callback );
};
LunchNetwork.prototype.post = function( api, data, callback ){
	var returnValue = '';
	var restType = 'POST'
	return this.ajax( restType, api, data, callback );
};
LunchNetwork.prototype.put = function( api, data, callback ){
	var returnValue = '';
	var restType = 'PUT'
	return this.ajax( restType, api, data, callback );
};
LunchNetwork.prototype.delete = function( api, data, callback ){
	var returnValue = '';
	var restType = 'DELETE'
	return this.ajax( restType, api, data, callback );
};

// jQuery 필요
LunchNetwork.prototype.ajax = function( restType, api, data, callback ){
	var returnValue = "";
	// console.log( '---ajax---' );
	// console.log( 'restType : ' + restType );
	// console.log( 'api : ' + api );
	// console.log( 'data : ' );
	// console.log( data );

	$.ajax({
		type	: restType,
		url		: "/api/" + api,
		dataType: "json",
		// XXX: controller 초기화시 변수에 담기 때문에 현재 동기식으로 지정. 
		// 		html page 로딩/ 유저 편의 차원에서 좋지 않은 방법인 것 같다.
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
