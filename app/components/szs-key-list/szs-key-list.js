'use strict'

angular.module('szsKeyList',[])
  .provider('szsKeyList', function szsKeyListProvider(){

    this.$get = function szsKeyList(){

    }
  })

  .directive('szsKeyList', [function(){
    return {
      restrict: 'E',
      scope: {
        delFn:'&szsDelFn',
        data:'=szsKeyListData'
      },
      link: function(scope, elt, attrs, ctrl){
//        scope.data = scope.szsGetDataFn();
      },
      templateUrl: 'components/szs-key-list/szs-key-list.html'
    }
  }])
;