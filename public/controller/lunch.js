angular.module('todayLunch',
	[
		"ui.router",

		"angularFileUpload",
	])
.config(['$stateProvider','$urlRouterProvider',
	function($stateProvider, $urlRouterProvider){
		$stateProvider.state('todayLunch',{
	          abstract: true,
	          url: '/todayLunch',
	          templateUrl : '/partials/todayLunch.html',          
	          controller: 'TodayLunchController'
	     }).state('todayLunch.today', {
	     		abstract: true,
	        	url: '/today',
	        	template : '<div ui-view><div/>',
	        	// controller: 'TodayLunchTodayController'
	      }).state('todayLunch.today.main', {
	        	url: '',
	        	templateUrl : '/partials/todayLunch.today.html',
	        	controller: 'TodayLunchTodayController'   	
	     }).state('todayLunch.today.list', {
	        	url: '/list',
	        	templateUrl : '/partials/todayLunch.today.list.html',
	        	controller: 'TodayLunchTodayListController'
	     }).state('todayLunch.restaurant', {
	     		abstract: true,
	        	url: '/restaurant',
	        	template : '<div ui-view><div/>',
	        	controller: 'TodayLunchRestaurantController'
	     }).state('todayLunch.restaurant.list', {
	        	url: '/list',
	        	templateUrl : '/partials/todayLunch.restaurant.list.html',
	        	controller: 'TodayLunchRestaurantListController'
	     })
	     .state('todayLunch.restaurant.new', {
	        	url: '/new',
	        	templateUrl : '/partials/todayLunch.restaurant.new.html',
	        	controller: 'TodayLunchRestaurantNewController'
	     })
        ;
	}
])

// directive for upload file - angularFileUpload
.directive('ngThumb', ['$window', function($window) {
    var helper = {
        support: !!($window.FileReader && $window.CanvasRenderingContext2D),
        isFile: function(item) {
            return angular.isObject(item) && item instanceof $window.File;
        },
        isImage: function(file) {
            var type =  '|' + file.type.slice(file.type.lastIndexOf('/') + 1) + '|';
            return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
        }
    };

    return {
        restrict: 'A',
        template: '<canvas/>',
        link: function(scope, element, attributes) {
            if (!helper.support) return;

            var params = scope.$eval(attributes.ngThumb);

            if (!helper.isFile(params.file)) return;
            if (!helper.isImage(params.file)) return;

            var canvas = element.find('canvas');
            var reader = new FileReader();

            reader.onload = onLoadFile;
            reader.readAsDataURL(params.file);

            function onLoadFile(event) {
                var img = new Image();
                img.onload = onLoadImage;
                img.src = event.target.result;
            }

            function onLoadImage() {
                var width = params.width || this.width / this.height * params.height;
                var height = params.height || this.height / this.width * params.width;
                canvas.attr({ width: width, height: height });
                canvas[0].getContext('2d').drawImage(this, 0, 0, width, height);
            }
        }
    };
}])
/***********************************************************
*********			TODAY LUNCH - TODAY 		******** 
************************************************************/
.controller("TodayLunchController",
	function TodayLunchController($scope, $state){
		console.log('GameController ...');
		console.log('$state.$current.name', $state.$current.name);
	}
)
.controller("TodayLunchTodayController", 
	function TodayLunchTodayController($scope, $state, $appNetwork ){
		console.log("TodayLunchTodayController loaded...");
		// init		
		$appNetwork.get(
			"/api/restaurant-random_with_saving",
			function(response){
				console.log("response\n", response);
				$scope.todayRestaurant = response.data.data;
			},
			function(response){
				console.log("fail", response);
			}
		);


		$scope.getTodayWithReset = function getTodayWithReset(){
			$appNetwork.get(
				"/api/restaurant-random_with_saving_and_reset",
				function(response){
					$scope.todayRestaurant = response.data.data;
					console.log("$scope.todayRestaurant:\n", $scope.todayRestaurant);
				},
				function(response){
					console.log("fail", response);
				}
			);
		}

		$scope.getTodayWithClientCalcluation = function getTodayWithClientCalcluation(){
			$appNetwork.get(
				"/api/restaurant-random-with-recent-today",
				function(response){
					initData(response.data);
				},
				function(response){
					console.log("fail", response);
				}
			);
		}
		function initData(data){
			$scope.randomRestaurantList = data.data.randomRestaurantList;
			$scope.recentTodayList = data.data.recentTodayList;

			$scope.restaurants = removeDupulicateById($scope.randomRestaurantList, $scope.recentTodayList);
			$scope.todayRestaurant = $scope.restaurants[getRandomNumber($scope.restaurants.length)];
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
)
.controller("TodayLunchTodayListController",
	function TodayLunchTodayListController($scope, $state, $appNetwork){
		console.log('TodayLunchTodayListController ...');
		
		$appNetwork.get(
			"/api/today/lunch/9999/0",
			function(response){
				init(response.data);
			},
			function(response){
				console.log("fail", response);
			}
		);
		function init(data){
			$scope.restaurants = data.data;
			console.log("restaurants", $scope.restaurants);
		}
	}
)
/***********************************************************
*********		TODAY LUNCH - RESTAURANT 		******** 
************************************************************/
.controller("TodayLunchRestaurantController",
	function TodayLunchRestaurantController($scope, $state){
		console.log('TodayLunchRestaurantController ...');
		console.log('$state.$current.name', $state.$current.name);
	}
)
.controller("TodayLunchRestaurantListController",
	function TodayLunchRestaurantListController($scope, $state, $appNetwork){
		console.log('TodayLunchRestaurantListController ...');
		console.log('$state.$current.name', $state.$current.name);
		$appNetwork.get(
			"/api/restaurant/9999/0",
			function(response){
				init(response.data);
			},
			function(response){
				console.log("fail", response);
			}
		);
		$scope.deleteRetaurant = function(restaurant, index){
			console.log("deleteRetaurant:\n",restaurant);
			$appNetwork.delete(
				"/api/restaurant/" + restaurant.id,
				{
					id: restaurant.id
				},
				function(response){
					console.log("succeed", response);
					$scope.restaurants.splice(index, 1);

				},
				function(response){console.log("fail", response);}
			);
		}

		function init(data){
			$scope.restaurants = data.data;
			console.log("restaurants", $scope.restaurants);
		}
	}
)
.controller("TodayLunchRestaurantNewController",
	function TodayLunchRestaurantNewController($scope, $state, FileUploader, $http){
		console.log('TodayLunchRestaurantNewController ...');
		console.log('$state.$current.name', $state.$current.name);

		$scope.newRestaurant = {
		    name : "",
		};
		$scope.log = function log(){
		    console.log( "restaurantName---:",$scope.newRestaurant.name );
		    console.log( "restaurantName///:",uploader.formData[0].restaurantName );
		}
		function setFormData(item){
		    item.formData = [{
		        restaurantName: $scope.newRestaurant.name
		    }];
		}

		var uploader = $scope.uploader = new FileUploader({
		    url: '/api/add_new_restaurant'
		});

		// FILTERS
		uploader.filters.push({
		    name: 'imageFilter',
		    fn: function(item /*{File|FileLikeObject}*/, options) {
		        var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
		        return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
		    }
		});
		// limit upload file number
		uploader.queueLimit = 1;

		// CALLBACKS
		uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/, filter, options) {
		    console.info('onWhenAddingFileFailed', item, filter, options);
		    // console.warn("TypeError - ", "Not supported file format");
		};
		uploader.onAfterAddingFile = function(fileItem) {
		    // $scope.log();
		    // console.info('onAfterAddingFile', fileItem);
		};
		uploader.onAfterAddingAll = function(addedFileItems) {
		    console.info('onAfterAddingAll', addedFileItems);
		};
		uploader.onBeforeUploadItem = function(item) {
		    // console.info('onBeforeUploadItem', item);
		    // insert name value before upload by item
		    setFormData(item);
		};
		uploader.onProgressItem = function(fileItem, progress) {
		    // console.info('onProgressItem', fileItem, progress);
		};
		uploader.onProgressAll = function(progress) {
		    // console.info('onProgressAll', progress);
		};
		uploader.onSuccessItem = function(fileItem, response, status, headers) {
		    // console.info('onSuccessItem', fileItem, response, status, headers);
		};
		uploader.onErrorItem = function(fileItem, response, status, headers) {
		    // console.info('onErrorItem', fileItem, response, status, headers);
		};
		uploader.onCancelItem = function(fileItem, response, status, headers) {
		    // console.info('onCancelItem', fileItem, response, status, headers);
		};
		uploader.onCompleteItem = function(fileItem, response, status, headers) {
		    // console.info('onCompleteItem', fileItem, response, status, headers);
		};
		uploader.onCompleteAll = function() {
		    // console.info('onCompleteAll');
			$state.go("todayLunch.restaurant.list");
		};

	}
)
;