'use strict';

// Declare app level module which depends on views, and components
angular.module('appointments', [
  'ngRoute',
  'bbSearch',
  'appointments.bb',
  'myApp.view2'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/bb'});
}]);
