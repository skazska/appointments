'use strict'

angular.module('szsKeyList',[])

.directive('szsKeyList', [function(){
    return {
      restrict: 'E',
      scope: {
        szsGetDataFn:'&',
        szsDelFn:'&'
      },
      link: function(scope, elt, attrs, ctrl){
        scope.data = scope.szsGetDataFn();
      },
      templateUrl: 'components/szs-key-list/szs-key-list.html'
    }
  }])

;