'use strict'



angular.module('szsBoard', [])

  .directive('szsBoardPane', [function(){
    return{
      restrict: 'A',
      require: '^szsBbSearch',
      transclude: true,
      scope: {
        title:'@'
      },
      link: function (scope, elt, attrs, ctrl){
        elt.find('.ui-widget-content').resizable({handles:{s:elt.find('.ui-resizable-s')}});
      },
      templateUrl:'components/szs-board/szs-board-pane.html'
    }

  }]);