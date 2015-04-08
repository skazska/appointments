'use strict';


angular.module('szsSearch', ['szsKeyList'])
  /**
   * @ngdoc directive
   * @name bbSearch
   * @restrict E
   * @requires $http
   * @description
   * a complex component wires up search string, search options, search results and server communications
   */
  .directive('szsSearch', [function() {
    return {
      restrict: 'E',
//      transclude: true,
      scope: {
        searchStr: '=szsSearchStr'
      },
      controller: function($scope, $element, $attrs, $transclude){

      },
      templateUrl: 'components/szs-search/szs-search.html'
    };
  }])

;


