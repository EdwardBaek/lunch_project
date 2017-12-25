angular.module('game',
	[
		"ui.router",
	])
.config(['$stateProvider','$urlRouterProvider',
	function($stateProvider, $urlRouterProvider){
		$stateProvider.state('game',{
          abstract: true,
          url: '/game',
          templateUrl : '/partials/game.html',          
          controller: 'GameController'
        })
		.state('game.list', {
        	url: '',
        	templateUrl : '/partials/game.list.html',
        	controller: 'GameListController'
        })
        .state('game.bullsAndCows', {
        	abstract: true,
			url : '/bullsAndCows',
			template : '<div ui-view></div>'
		})
		.state('game.bullsAndCows.play', {
			url : '/play',
			templateUrl : '/partials/game.bullsAndCows.html',
			controller : 'bullsAndCowsController'
		})
		.state('game.bullsAndCows.score', {
			url : '/score',
			templateUrl : '/partials/game.bullsAndCows.score.html',
			controller : 'bullsAndCowsScoreController'
		})
        ;
	}
])
.controller('GameController',
	function GameController($scope, $state){
		console.log('GameController ...');
		console.log('$state.$current.name', $state.$current.name);
	}
)
.controller('GameListController',
	function GameListController($scope, $state){
		console.log('GameListController ...');
		console.log('$state.$current.name', $state.$current.name);
	}
)
.controller('bullsAndCowsController', 
function bullsAndCowsController($scope, $state){
	console.log('bullsAndCowsController ...');
	console.log('$state.$current.name', $state.$current.name);
/*
숫자 야구 게임
0에서 9까지의 정수를 사용한다.
중복되는 숫자는 없다.
100 이상
1회차에서 9회차까지 총 9번의 기회가 있다.
3개의 숫자의 입력을 받는다.
스트라이크 - 해당하는 숫자가 제 위치에 있다.
볼 - 해당하는 숫자가 있고 위치가 다른다.
아웃 - 해당하는 숫자가 없다.
무엇이 맞고 틀린지 알려주지 않는다.

정답: 102
입력: 124
->1스트라이크 1볼
*/
	$scope.inputNum = 123;
	$scope.answerArray = [];
	$scope.gameHistory = [];
	$scope.gameLimit = 9;
	$scope.gameTryCount = 0;
	
	// XXX 10개 이상이 넘어가면 안된다. 게임자체제의 룰에서 성립이 안됨. 체크에서 무한 루프로 빠짐.
	$scope.answerArrayLimit = 3;
	$scope.hasWarning = false;
	$scope.warningMessage = '';
	$scope.isGameDone = false;
	$scope.isPlayerWin = false;

	function getRandomZeroToNine(){
		return Math.floor( Math.random() * 10);
	}
	function isRegisteredNum( array, num ){
		// console.info( 'isRegistered-$scope.answerArray', array )
		for( var i = 0; i < array.length; ++i ){
			if( array[i] === num )
				return true;
		}
		return false;
	}
	function arrayToString( array ){
		var returnStr = '';
		for( var i = 0; i < array.length; ++i ){
			returnStr += array[i].toString();
		}
		return returnStr;
	}
	function numToArray( num ){
		var numStr = String( num );		
		var returnArray = [];
		for( var i = 0; i < numStr.length; ++i ){
			returnArray.push( Number( numStr[i] ) );
		}
		return returnArray;	
	}
	function hasDupulicatedValue( array ){
		var checkValue = array[0];
		var checkArray = array.slice();
		checkArray.splice( 0, 1 );
		for( var i = 0; i < array.length - 1; ++i ){
			if( isRegisteredNum( checkArray, checkValue ) ){
				return true;
			}else{
				checkValue = checkArray[0];
				checkArray.splice( 0, 1 );
			}
		}
		return false;
	}
	function checkAnswer( answerArray, inputArray ){
		var strikeNum = 0;
		var ballNum = 0;
		var passNum = 0;
		var isOut = false;
		++$scope.gameTryCount;
		// console.info('checkAnswer-answerArray', answerArray );
		// console.info('checkAnswer-inputArray', inputArray );		

		for( var i = 0; i < answerArray.length; ++i ){
			console.info(answerArray[i] + '/' + inputArray[i] + ':', answerArray[i] === inputArray[i]  );
			if( answerArray[i] === inputArray[i] )
				++strikeNum;
			else if( isRegisteredNum( answerArray, inputArray[i] ) )
				++ballNum;
			else
				++passNum;
		}
		if( passNum === answerArray.length )
			isOut = true;

		// console.info( 'strike-', strikeNum );
		// console.info( 'ballNum-', ballNum );
		// console.info( 'isOut-', isOut );
		
		$scope.gameHistory.push( 
			[ 
				$scope.gameTryCount, 
				isOut, 
				strikeNum, 
				ballNum,
				arrayToString( inputArray )
			] 
		);		
		if( strikeNum === $scope.answerArrayLimit ){
			$scope.isGameDone = true;
			$scope.isPlayerWin = true;
		}else if( isGameDone() ){
			$scope.isGameDone = true;
			$scope.isPlayerWin = false;
		}
	}

	function getRandomNumArray(){
		var randomNumArray = [];
		for( var i = 0; i < $scope.answerArrayLimit; ++i ){
			while( true ){
				var randomAnswer = getRandomZeroToNine();
				if( i === 0 ){
					// console.info( 'first 0', randomAnswer );
					while( randomAnswer === 0 ){
						randomAnswer = getRandomZeroToNine();						
						// console.info( 'reget randomNum', randomAnswer );
					}
				}
				if( !isRegisteredNum( randomNumArray, randomAnswer ) ){
					randomNumArray.push( randomAnswer );
					break;
				}
			}
		}
		return randomNumArray;
	}
	function isGameDone(){
		return ( $scope.gameLimit === $scope.gameTryCount );
	}

	$scope.resetGame = function(){
		$scope.answerArray = [];
		$scope.answerArray = getRandomNumArray();
		$scope.gameHistory = [];
		$scope.warningMessage = '';
		$scope.isGameDone = false;
		$scope.isPlayerWin = false;
		$scope.gameTryCount = 0;
	};	
	$scope.checkAnswer = function(){
		$scope.hasWarning = false;
		var inputArray = numToArray( $scope.inputNum );
		// console.info( '$scope.inputNum-', $scope.inputNum );
		// console.info( '$scope.inputNum-', $scope.inputNum < 100 );
		if( isGameDone() )
			return;		

		if( $scope.inputNum < 100 ){
			$scope.hasWarning = true;
			$scope.warningMessage = 'input over 99.' ;
			return;
		}
		if( inputArray.length !== $scope.answerArrayLimit ){
			$scope.hasWarning = true;
			$scope.warningMessage = 'input ' + $scope.answerArrayLimit + ' digit number only' ;
			return;
		} if( hasDupulicatedValue( inputArray ) ){
			$scope.hasWarning = true;
			$scope.warningMessage =  'input not duplicated number';
			return;
		}

		// console.info('$scope.checkAnswer-$scope.inputNum', $scope.inputNum );
		// console.info('$scope.checkAnswer-inputArray', inputArray );
		checkAnswer( $scope.answerArray, inputArray );

	};
	$scope.displayInputNum = function(){		
		return $scope.inputNum;
	};
	$scope.displayAnswer = function(){
		return arrayToString( $scope.answerArray );
	};
	$scope.getWarningMessage = function(){
		if( $scope.hasWarning )
			return $scope.warningMessage;
	};
	$scope.getGameDoneMessage = function(){
		if( $scope.isPlayerWin )
			return 'You Win!!!';
		else
			return 'You Lose, loser!!!';
	}

	$scope.resetGame();
	
})
.controller('bullsAndCowsScoreController', 
function bullsAndCowsScoreController($scope, $state){
	console.log('bullsAndCowsScoreController ...');
	console.log('$state.$current.name', $state.$current.name);
	}
);
