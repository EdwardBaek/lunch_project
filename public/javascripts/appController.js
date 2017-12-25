var app = angular.module("app", [
	"app.data",
	"app.network",

	"angularFileUpload",
]);

// app.config([],
// 	function(){}
// )
// .run(
// 	// [],
// 	// function(){
	
// 	// }
// );

app.controller("appController",
	function($scope, $appNetwork, $http){
		console.log("appController loaded...");
		$appNetwork.get(
			"/api/restaurant/9999/0",
			function(response){
				init(response.data);
			},
			function(response){
				console.log("fail", response);
			}
		);
		$scope.deleteRetaurant = function(restaurantId){
			console.log("deleteRetaurant",restaurantId);
			$appNetwork.delete(
				"/api/restaurant/" + restaurantId,
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
			$scope.restaurants = data.data;
			console.log("restaurants", $scope.restaurants);
		}
	}
);

