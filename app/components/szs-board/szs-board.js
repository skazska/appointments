'use strict'
/**
 * @ngdoc overview
 * @name szsBoard
 * @module szsBoard
 * @description
 * Provides transclude directive to present content in resizable panes. Depends on JQuery ui resizable widget */
angular.module('szsBoard', [])

/**
 * @ngdoc directive
 * @name szsBoard.szsBoardPane
 * @module szsBoard
 * @restrict 'E'
 * @param {attribute} title - text for pane's title
 * @transclude
 * @description
 * wrapper, consist of header, transclude container, resize handler
 * header contains logo and title, provided through scope
 *
 */
  .directive('szsBoardPane', [function(){
    return{
      restrict: 'A',
//      require: '^szsBbSearch',
      transclude: true,
      scope: {
        title:'@'
      },
      link: function (scope, elt, attrs, ctrl){
        var content = elt.find('.ui-widget-content');
        content.resizable?content.resizable({handles:{s:elt.find('.ui-resizable-s')}}):null;
      },
      templateUrl:'components/szs-board/szs-board-pane.html'
    }

  }]);