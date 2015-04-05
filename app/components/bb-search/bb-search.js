'use strict';


angular.module('bbSearch.directives', [])
  /**
   * @ngdoc directive
   * @name bbSearch
   * @restrict E
   * @requires $http
   * @description
   * a complex component wires up search string, search options, search results and server communications
   */
  .directive('bbSearch', ['$http', function($http) {
    return {
      restrict: 'E',
      scope: {
        searchStr: '@searchStr'
//        searchOpts: [{key:'OPT', name:'OPTION', items: [{key:'ITM', name:'item'}]}]
      },
      controller: function(scope){

      },
      link: function(scope, element, attr, ctr) {

      },
      templateUrl: 'components/bb-search/bb-search.html'
    };
  }])

;

angular.module('bbSearch', [
  'bbSearch.directives'
])

  .value('version', '0.1');
