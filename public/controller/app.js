var app = angular.module("app",
	[
		"ui.router",
    "app.data",

    "signup",
    "login",
    "dashboard",
    "todayLunch",
    "game",
	]
)
.config(['$stateProvider', '$urlRouterProvider',
  function($stateProvider, $urlRouterProvider) {

    $stateProvider.state('login', {
      	url : '/login',
        templateUrl: 'partials/login.html',
        controller: 'LoginController'
      }).state('signup', {
      	url : '/signup',
        templateUrl: 'partials/signup.html',
        controller: 'signupController'
      }).state('dashboard', {
        url : '/dashboard',
        templateUrl: 'partials/dashboard.html',
        controller: 'DashboardController'  
      })
      ;

    $urlRouterProvider.otherwise('/login');
  }]
)
.run([ '$rootScope', '$state', '$stateParams',
    function($rootScope, $state, $stateParams){
      $rootScope.$state = $state;
      $rootScope.$stateParam = $stateParams;
    }
  ]
);

app.controller("MainController", 
function MainController($scope, $http, $appData){
	console.info('MainController', 'loaded...');
  console.info('appData', $appData.getAllLocalStorage());
  $scope.isAuthenticated = false;
  console.info('isAuthenticated', $scope.isAuthenticated);
  $scope.hasToken = function(){
    return ( $appData.getLocalStorage('Auth') );
  };
  console.info('$scope.hasToken',$scope.hasToken());
});