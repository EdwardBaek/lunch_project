angular.module('app.network',['app.data'])
.factory('$appNetwork', function($http,$appData){
	var Network = function Network(){};
	var token;
	token = $appData.getLocalStorage('Auth');
	Network.prototype.setToken = function(userToken){
		token = userToken;
	};
	Network.prototype.getToken = function(){
		return token;
	};
	Network.prototype.get = function(url, successCallback, errorCallback){
		var config =
		{	
			method : 'GET',
			url : url,
			headers : { Auth : token }
		};
		$http(config).then(successCallback, errorCallback);
	};
	Network.prototype.post = function(url, data, successCallback, errorCallback){
		console.info('token',token);
		var config =
		{	
			method : 'POST',
			url : url,
			data : data,
			headers : { Auth : token }
		};
		$http(config).then(successCallback, errorCallback);
	};
	Network.prototype.put = function(url, data, successCallback, errorCallback){
		var config =
		{	
			method : 'PUT',
			url : url,
			data : data,
			headers : { Auth : token }
		};
		$http(config).then(successCallback, errorCallback);
	};
	Network.prototype.delete = function(url, data, successCallback, errorCallback){
		var config =
		{	
			method : 'DELETE',
			url : url,
			data : data,
			headers : { Auth : token }
		};
		$http(config).then(successCallback, errorCallback);
	};

	var network = new Network();
	return network;
})