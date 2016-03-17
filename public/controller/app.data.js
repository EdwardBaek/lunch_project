angular.module('app.data',[])
.factory('$appData',
	function appData(){
		var data = {};
		var localStorageKeys = [];
		var getLocalStorageKeys = function(){
			return localStorageKeys;
		};
		var addLocalStorageKeys = function(key){
			localStorageKeys.push(key);
		};
		var removeLocalStorageKeys = function(key){
			for( var i = 0; i < localStorageKeys.length; ++i){
				if(localStorageKeys[i] === key){
					delete localStorageKeys[i];
					break;
				}
			}
		};
		
		var getAllLocalStorage = function(){
			return localStorage;
		};
		var getLocalStorage = function(key){
			return localStorage.getItem(key);
		};
		var setLocalStorage = function(key, value){
			addLocalStorageKeys(key);
			localStorage.setItem(key, value);
		};
		var removeLocalStorage = function(key){
			removeLocalStorageKeys(key);
			localStorage.removeItem(key);
		};
		return {
			getAllLocalStorage : getAllLocalStorage,
			getLocalStorageKeys : getLocalStorageKeys,
			getLocalStorage : getLocalStorage,
			setLocalStorage: setLocalStorage,
			removeLocalStorage : removeLocalStorage
		}
	}
)