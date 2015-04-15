'use strict'

angular.module('szsBbSearch', ['szsKeyList', 'szsBoard', 'ui.sortable'])

  .directive('szsBbSearch',['$http', 'szsKeyListData', function($http, szsKeyListData){
    return {
      restrict: 'E',
      scope: {
        svcUrl: '@',
        searchStr: '@'
      },
      controller: function($scope, $element, $attrs, $transclude) {
        var keyList = szsKeyListData();
        $scope.szsKeyList = keyList;

        var board = [];
        $http.get($scope.svcUrl).success(function(data) {
          $scope.szsBoardData = board = data;
        });

        $scope.sortOptions = {
          axis:'y'
        };

        $scope.itemClick = function(option, item) {
          switch (option.contentType) {
            case 'option':
              keyList.add(option.option,item.item,option.title,item.title);
              break;
            case 'item':

              break;
          }
        };

//        this.fltOptsDel = keyList.del;
      },
      templateUrl: 'components/szs-bb-search/szs-bb-search.html'
    }
  }])
;