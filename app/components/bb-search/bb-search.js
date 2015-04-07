'use strict';


angular.module('bbSearch', ['szsKeyList'])
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
        searchStr: '@'
      },
      controller: function($scope, $element, $attrs, $transclude){
        var opts = $scope.searchOpts = {OPT:{name:'OPTION', items: {ITM:'item'}}}; //ITM:'item'

        this.searchOptsDel = function(optKey, itemKey) {
          if (angular.isDefined(optKey)) {
            if (angular.isDefined(itemKey)) {
              if (angular.isDefined(opts[optKey].items[itemKey])) delete opts[optKey].items[itemKey];
            } else {
              if (angular.isDefined(opts[optKey])) delete opts[optKey];
            }
          }
        }

        this.searchOpts = function(val, optKey, itemKey){
          if (!angular.isDefined(val)) {
            if (angular.isDefined(optKey)&&angular.isDefined(itemKey)) return opts[optKey].items[itemKey] || null;
            if (angular.isDefined(optKey)) return opts[optKey] || null;
            return opts || null;
          } else {
            if (angular.isDefined(optKey)&&angular.isDefined(itemKey)) {
              opts[optKey].items[itemKey] = val;
            } else if (angular.isDefined(optKey)) {
              opts[optKey] = val;
            } else {
              opts = val;
            }
          }
        }
      },
      controllerAs: 'bbSearch',
      templateUrl: 'components/bb-search/bb-search.html'
    };
  }])

;


