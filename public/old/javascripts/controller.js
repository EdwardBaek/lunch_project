/**************************************************************************************************
    FileName        : controller.js
    Description     : 

    Update History
      2015.09. 03(Tue)       Edward       Create 
**************************************************************************************************/

/*
목적: 하루에 한번 식사장소 선정
조건: 일주일간 중복되지 않는다.

01. 기간체크
02. 금일 확인
	오늘일 경우 	
		그대로 출력
	오늘이 아니면
		새로운 식당 선정
03. 새로운 식당 선정 알고리즘
	A = 전체 식당 리스트 구성
	B = 기존의 선택되었던 식당 테이블 구성
	C = A - B : 후보 식당 리스트 구성
	랜덤 함수로 식당 선정
04. 해당 결과를 출력
*/

var _lunchNetwork = new LunchNetwork();
var _selectedLunchList = _lunchNetwork.getSelectedLunchList(5, 
			function(result){
				console.info('result', result)
				console.log(new Date());
			});

// FIXME: 네트워크로 값을 가져오지 않는다.
//			1.reset() 후 -> 2.선택된 식당리스트로 이동 3.뒤로 가기 4.앞으로 가기 
// 			네트워크에서 값을 제대로 가져오지 않는다.
console.info( 'init _selectedLunchList', _selectedLunchList );


// 01. 기간체크
function isToday( date ){
	var returnValue = false;
	if( date == getFomatedToday() ){
		returnValue = true;
	}
	return returnValue;
}

function getFomatedToday(){
	return getFormatedDate( new Date() );
}

function getFormatedDate( rawDate ){
	var now 		= new Date(rawDate);
	var formatedDay = now;
	var year 		= now.getFullYear();
	var month 		= now.getMonth() + 1;
	var day 		= now.getDate();
	if( month < 10 ){
		month = '0' + month;
	}
	if( day < 10 ){
		day = '0' + day;
	}
	formatedDay = year + '-' + month + '-' + day ;
	return formatedDay.trim();
}


//02. 식당 선정 알고리즘
//	오늘일 경우 	
//		그대로 출력
//	오늘이 아니면
//		새로운 식당 선정
function getSelectTodayLunch(){
	// var selectedLunchList = get_selectedLunchList();
	var selectedLunchList = _lunchNetwork.getSelectedLunchList(5);
	
	// console.info( 'selectedLunchList', selectedLunchList);
	// console.info( 'selectedLunchList.length', selectedLunchList.length);

	var selectedLunch = '';
	if( selectedLunchList.length === 0 ){
		selectedLunch.date = getFomatedToday();
	}else{
		selectedLunch = selectedLunchList[0];
	}

	console.info( '***check selectedTodaydate', getFormatedDate(selectedLunch.date) +'/'+ selectedLunch.date );
	console.info( '***check Today', isToday(getFormatedDate(selectedLunch.date)) + ' t:'+getFomatedToday() +'/ s:' +getFormatedDate(selectedLunch.date) );

	if( isToday( getFormatedDate(selectedLunch.date) ) === true ){
		console.log( 'display from selectedLunchList' );
		return selectedLunch;
	}else{
		var newLunch = getNewTodayLunch();
		console.log( 'display from newLunchList' );
		// console.info('newLunch', newLunch );
		_lunchNetwork.insertTodayLunch( newLunch );

		_selectedLunchList = null;
		selectedLunchList = null;
		console.log('getSelectTodayLunch-_selectedLunchList:' + _selectedLunchList);
		// console.log( '_lunchNetwork.insertTodayLunch( newLunch );' );		

		return newLunch;
	}
}

//03. 새로운 식당 선정 알고리즘
//	A = 전체 식당 리스트 구성
//	B = 기존의 선택되었던 식당 테이블 구성
//	C = A - B : 후보 식당 리스트 구성
//	랜덤 함수로 식당 선정
function getNewTodayLunch(){
	// console.log( 'getNewTodayLunch' );
	var restaurantList = _lunchNetwork.getRestaurantList();
	// console.log('restaurantList',restaurantList);
	var selectedLunchList = _selectedLunchList;	
	var candidateLunchList = restaurantList.slice();

	// cadidate table 구성
	for( var idxLunch = restaurantList.length - 1; 0 < idxLunch; --idxLunch ){
		for( var idxSelect = 0; idxSelect < selectedLunchList.length; ++idxSelect){
			if( restaurantList[idxLunch].id === selectedLunchList[idxSelect].id ){
				candidateLunchList.splice( idxLunch, 1 );
				break;
			}			
		}
	}
	// console.log('candidateLunchList',candidateLunchList);
	var idxSelectedLunch = getRandomNumber( candidateLunchList.length );
	return candidateLunchList[ idxSelectedLunch ];
}

function getRandomNumber( max ){
	return Math.floor( ( Math.random() * max ) );
}


//04. 해당 결과를 출력


function getLunchItemByIdx( idx ){
	var lunchItem = '';
	return lunchItem;
}

function resetTodayLunch( callback ){
	resetGlobalValues();
	_lunchNetwork.deleteTodayLunch( callback );
}

// XXX: 분리되어 있지 않은 함수. 다른 대안을 찾아보자.
function get_selectedLunchList(){
	if( _selectedLunchList === null || _selectedLunchList === undefined || _selectedLunchList.length == 0){
		_selectedLunchList = _lunchNetwork.getSelectedLunchList();
	}
	return _selectedLunchList;
}

function resetGlobalValues(){
	_selectedLunchList 	= '';
	// console.info( '_selectedLunchList', _selectedLunchList );
}
//TODO: 설계 및 코딩 프로세스 기록 및 코멘트


