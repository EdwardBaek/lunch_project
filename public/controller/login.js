angular.module('login',
	[
		"ui.router",
		"app.data",
		"app.network"
	])
.controller("LoginController", 
function LoginController($scope, $appData, $appNetwork, $state){
	console.info('LoginController', 'loaded...');
	console.info('network toekn', $appNetwork.getToken());
	$scope.user = 
	{
		email : null,
		password : null
	};
	$scope.hello = 'world';

	$scope.hasToken = function(){
		return ( $appData.getLocalStorage('Auth') );
	};
	$scope.getTokenEmail = function(){
		return ( $appData.getLocalStorage('email') );	
	};

	$scope.loginSubmit = function(){
		var data = 
		{
			email : $scope.user.email,
			password : $scope.user.password			
		};
		$appNetwork.post(
			'/api/login/',
			data,
			function success(response){
				console.info('success.response',response);
				$scope.result = response.data.message;
				$appData.setLocalStorage('email', $scope.user.email);
				$appData.setLocalStorage('Auth', response.data.token);
				$appNetwork.setToken(response.data.token);
				$scope.resetFormData();

				var redirectUrl = 'dashboard';
				$state.go('dashboard');
			},
			function error(response){
				console.info('error.response',response);
				$scope.result = response.data.message;
			}
		);
	};

	$scope.autoLogin = function(){
		var data = 
		{
			email : $appData.getLocalStorage('email'),
			password : 00000000,
			loginType : 'token'			
		};
		$appNetwork.post(
			'/api/login/',
			data,
			function success(response){
				console.info('success.response',response);
				$scope.result = response.data.message;
				$scope.resetFormData();

				$state.go('dashboard');
			},
			function error(response){
				console.info('error.response',response);
				$scope.result = response.data.message;
				if(response.data.errorCode === 1818){
					$scope.logOut();					
				}
			}
		);
	}

	$scope.resetFormData = function(){
		$scope.user.email = '';
		$scope.user.password = '';
	};
	$scope.logOut = function(){
		$appData.removeLocalStorage('email');
		$appData.removeLocalStorage('Auth');
	};
});
