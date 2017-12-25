var app = angular.module("app", [
	"app.data",
	"app.network",

	"angularFileUpload",
]);

app.controller("appController",
	function($scope, $appNetwork, $http){
		console.log("appController loaded...");
		$appNetwork.get(
			"/api/restaurant-random-with-recent-today",
			function(response){
				console.log(response);
				init(response.data);
			},
			function(response){
				console.log("fail", response);
			}
		);
		$scope.addNewRestaurant = function(){
			console.log("addNewRestaurant");
		}
		$scope.updateRetaurant = function(){
			console.log("updateRetaurant");
		}
		$scope.deleteRetaurant = function(restaurantId){
			console.log("deleteRetaurant",restaurantId);
			$appNetwork.delete(
				"api/restaurant/" + restaurantId,
				{
					id: restaurantId
				},
				function(response){
					console.log("succeed", response);
				},
				function(response){console.log("fail", response);}
			);
		}

		function init(data){
			$scope.randomRestaurantList = data.data.randomRestaurantList;
			$scope.recentTodayList = data.data.recentTodayList;
			// $scope.restaurants = data.data.randomRestaurantList;

			$scope.restaurants = removeDupulicateById($scope.randomRestaurantList, $scope.recentTodayList);
			$scope.todayRestaurant = $scope.restaurants[getRandomNumber($scope.restaurants.length)];
			if( !$scope.todayRestaurant )
				console.log("No Data");
			console.log("randomRestaurantList", $scope.randomRestaurantList);
			console.log("RecentTodayRestaurant", $scope.recentTodayList);
			console.log("Restaurant", $scope.restaurants);
			console.log("todayRestaurant", $scope.todayRestaurant);
		}

		function removeDupulicateById(array1, array2){
			var dulpulicatedIdArray = new Array();
			var returnArray = array1.slice();
			for(var i = 0; i < array1.length; i++){
				for( var ii = 0; ii < array2.length; ii++){
					if( array1[i].id == array2[ii].id){
						dulpulicatedIdArray.push(i);
						break;
					}
				}
			}
			for(var i =  dulpulicatedIdArray.length; i >-1; i--){
				returnArray.splice(dulpulicatedIdArray[i], 1);
			}
			return returnArray;
		}
		function getRandomNumber( max ){
			return Math.floor( ( Math.random() * max ) );
		}
	}
);

