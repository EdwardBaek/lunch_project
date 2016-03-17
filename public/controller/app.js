var app = angular.module("app",
	[
		"ui.router",
    "app.data",

    "login",
    "dashboard",
	]
)
.config(['$stateProvider', '$urlRouterProvider',
  function($stateProvider, $urlRouterProvider) {

    $stateProvider.state('login', {
      	url : '/login',
        templateUrl: 'partials/login.html',
        controller: 'LoginController'
      }).state('dashboard', {
      	url : '/dashboard',
        templateUrl: 'partials/dashboard.html',
        controller: 'DashboardController'
      });

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

});