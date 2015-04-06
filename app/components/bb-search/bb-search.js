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
      transclude: true,
      scope: {
        searchStr: '@searchStr'
      },
      controller: function($scope, $element, $attrs, $transclude){
        var opts = $scope.searchOpts = {OPT:{name:'OPTION', items: {ITM:'item'}}}; //ITM:'item'

        this.searchOpts = function(val){
          if (!angular.isDefined(val)) { return opts; }
          else if (val === false) {opts = {}; }
          else {  opts = val; }
        }

        this.searchOpt = function(key, val){
          if (angular.isDefined(key)) {
            if (!angular.isDefined(val)) { return opts[key]; }
            else if (val === false) { delete opts[key]; }
            else { opts[key] = val; }
          }
        }

        this.searchOptItems = function(key, val){
          if (angular.isDefined(key)) {
            if (!angular.isDefined(val)) { return opts[key].items; }
            else if (val === false) { delete opts[key].items; }
            else { opts[key].items = val; }
          }
        }

        this.searchOptItem = function(key, item, val){
          if (angular.isDefined(key)&&angular.isDefined(item)) {
            if (!angular.isDefined(val)) { return opts[key].items[item]; }
            else if (val === false) { delete opts[key].items[item]; }
            else { opts[key].items[item] = val; }
          }
        }

      },
      controllerAs: 'bbSearch',
      templateUrl: 'components/bb-search/bb-search.html'
    };
  }])

;

angular.module('bbSearch', [
  'bbSearch.directives'
])

  .value('version', '0.1');
