'use strict';

// Declare app level module which depends on views, and components
angular.module('appointments', [
  'ngRoute',
  'appointments.bb'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/bb'});
}]);
