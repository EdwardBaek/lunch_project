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
var _selectedLunchList = _lunchNetwork.getSelectedLunchList();

// 01. 기간체크
function isToday( date ){

}

//02. 식당 선정 알고리즘
//	오늘일 경우 	
//		그대로 출력
//	오늘이 아니면
//		새로운 식당 선정
function selectTodayLunch(){
	var selectedLunchList = _selectedLunchList;
	for( var i = 0; i < selectedLunchList.length; ++i ){
		var selectedLunch = selectedLunchList[i];

		if( isToday( selectedLunch.date ) === true ){
			displayTodayLunch( selectedLunch );
		}else{
			var newLunch = getNewTodayLunch();
			displayTodayLunch( newLunch );
			_lunchNetwork.insertTodayLunch( newLunch );

		}
	}
}


//03. 새로운 식당 선정 알고리즘
//	A = 전체 식당 리스트 구성
//	B = 기존의 선택되었던 식당 테이블 구성
//	C = A - B : 후보 식당 리스트 구성
//	랜덤 함수로 식당 선정
function getNewTodayLunch(){
	var lunchList = _lunchNetwork.getLunchList();
	var selectedLunchList = _selectedLunchList;	
	var candidateLunchList = lunchList.slice();

	// cadidate table 구성

	for( var idxLunch = lunchList.length - 1; 0 < idxLunch; --idxLunch ){
		for( var idxSelect = 0; idxSelect < selectedLunchList.length; ++idxSelect){
			if( lunchList[idxLunch].idx === selectedLunchList[idxSelect].idx ){
				candidateLunchList.splice( idxLunch, 1 );
				break;
			}			
		}
	}

	var idxSelectedLunch = getRandomNumber( candidateLunchList.length );
	return candidateLunchList[ idxSelectedLunch ];
}

function getRandomNumber( max ){
	return Math.floor( ( Math.random() * max ) + 1 );
}


//04. 해당 결과를 출력
function displayTodayLunch( lunchItem ){
	console.log( lunchItem.name );
}



// 서버 통신 클래스
function LunchNetwork(){
}

// 반환값: [ { idx, name, imgUrl } ...  ]
LunchNetwork.prototype.getLunchList = function(){
	var data = {
		
	};
	LunchNetwork.prototype.ajaxNetworking( data, function(){

	});
};

// 반환값: [ { idx, date } ...  ]
LunchNetwork.prototype.getSelectedLunchList = function(){

};

LunchNetwork.prototype.insertTodayLunch = function(){

};
// jQuery 필요
LunchNetwork.prototype.ajaxNetworking = function( data, callback ){
	var returnValue = "";
	$.ajax({
		type:"POST",
		async: true,
		url: "",
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
};

//TODO: 설계 및 코딩 프로세스 기록 및 코멘트


