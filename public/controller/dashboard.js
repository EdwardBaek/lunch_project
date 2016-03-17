angular.module('dashboard',
	[
		"ui.router",
		"app.data",
	])
.controller("DashboardController", 
function($scope, $state, $appData){
	console.info('DashboardController', 'loaded...');

	$scope.hasToken = function(){
		return ( $appData.getLocalStorage('Auth') );
	};
	$scope.getTokenEmail = function(){
		return ( $appData.getLocalStorage('email') );	
	};
	$scope.logOut = function(){
		$appData.removeLocalStorage('email');
		$appData.removeLocalStorage('Auth');
		$scope.goLoginPage();
	};
	$scope.goLoginPage = function(){
		$state.go('login');
	};

})