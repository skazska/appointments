(function(window, angular, undefined) {
  'use strict';
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
    .directive('szsBoardPane', [function () {
      return {
        restrict: 'A',
        require: '^?szsDashSearch',
        transclude: true,
        scope: {
          title: '@',
          logo: '@',
          position: '@'
        },
        link: function (scope, elt, attrs, ctrl) {
          var content = elt.find('.ui-widget-content');
          content.resizable ? content.resizable({handles: {s: elt.find('.ui-resizable-s')}}) : null;

          scope.action = function (evt) {
            var action = $(evt.target).attr("data-action");
            if (angular.isDefined(action)) {
              switch (action) {
                case 'min':
                  $(evt.currentTarget).height(elt.find(".ui-widget-header").height() + 1);
                  break;
                case 'med':
                  $(evt.currentTarget).height(elt.find(".ui-widget-header").height() + 300);
                  break;
                case 'max':
                  //                $(evt.currentTarget).height(elt.find(".ui-widget-header").height()+600);
                  $(evt.currentTarget).removeAttr("style");
                  break;
                case 'top':
                  ctrl.upTop(this.position);
                  break;
                case 'btm':
                  break;
              }
            }
          }
        },
        templateUrl: 'templates/szs-board-pane.html'
      }

    }]);
})(window, window.angular);