'use strict'

angular.module('szsBoard', [])

  .directive('szsBoardTab', [function(){
    return{
      restrict: 'E',
      transclude: true,
      scope: {
        data:'=szsBoardData'
      },
      controller:function($scope, $element, $attrs, $transclude){

      },
      controllerAs:'ctrl',
      bindToController: true,
      templateUrl:'components/szs-board/szs-board-tab.html'
    }
  }])

  .directive('szsBoardPane', [function(){
    return{
      restrict: 'E',
      require: '^szsBoardTab',
      transclude: true,
      scope: {
        title: '@'
      },
      link: function(scope, elt, attrs, ctrl){
//        scope.data = scope.szsGetDataFn();
      },
      templateUrl:'components/szs-board/szs-board-pane.html'
    }

  }])