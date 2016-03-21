angular.module('signup',
	[
		"ui.router",
		"app.data",
		"app.network"
	]
)
.controller('signupController', 
function($scope, $appNetwork, $appData, $state){
	$scope.isSignupComplete = false;
	$scope.user = 
	{
		email : null,
		name : null,
		password : null
	};
	$scope.signupSubmit = function(){
		var data = 
		{
			email : $scope.user.email,
			password : $scope.user.password,
		};
		$appNetwork.post(
			'/api/signup',
			data,
			function success(response){
				console.info('success-response',response);
				$scope.result = response.data.message;
				$scope.isSignupComplete = true;
				$scope.resetInput();
				$scope.goLogin();
			},
			function fail(response){
				console.info('fail-response',response);
				$scope.result = response.data.message;
				$scope.isSignupComplete = false;
			}
		);	
	};
	$scope.goLogin = function(){
		$state.go('dashboard');
	};
	$scope.resetInput = function(){
		$scope.email = undefined;
		$scope.password = undefined;
	};
	
});