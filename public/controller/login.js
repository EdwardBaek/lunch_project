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

	$scope.hello = 'world';

	$scope.hasToken = function(){
		return ( $appData.getLocalStorage('Auth') );
	};
	$scope.getTokenEmail = function(){
		return ( $appData.getLocalStorage('email') );	
	};

	$scope.submit = function(){
		// console.info('login form', $scope.login );
		// console.info('email', $scope.email);
		// console.info('password', $scope.password);
		var data = 
		{
			email : $scope.email,
			password : $scope.password			
		};
		$appNetwork.post(
			'/api/login/',
			data,
			function success(response){
				console.info('success.response',response);
				$scope.result = response.data.message;
				$appData.setLocalStorage('email', $scope.email);
				$appData.setLocalStorage('Auth', response.data.token);
				$appNetwork.setToken(response.data.token);
				$scope.resetFormData();

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
			password : 00000000			
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
		$scope.email = '';
		$scope.password = '';
	};
	$scope.logOut = function(){
		$appData.removeLocalStorage('email');
		$appData.removeLocalStorage('Auth');
	};
});
