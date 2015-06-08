'use strict';

angular.module('mockBbSearch', []).directive('szsDashSearch',function(){
  return {
    controller: function($scope){
      this.upTop = function(i){return true;}
    }
  }
});

describe('module szs-board', function(){
  describe('szs-board-pane directive', function(){
    var $compile, $rootScope, $controller, scope;
    var elt, ctrl;
    beforeEach(function(){
      module('templates');
      module('mockBbSearch');
      module('szsBoard');
    })
    beforeEach(inject(function(_$compile_, _$rootScope_, _$controller_){
      $compile = _$compile_;
      $rootScope = _$rootScope_;
      $controller = _$controller_;
      scope = $rootScope.$new();
      elt = angular.element('<szs-dash-search><div szs-board-pane title="title" logo="url" position="9">Hello!</div></szs-dash-search>');
      elt = $compile(elt)(scope);
      $rootScope.$digest();
    }));
    it('should be a wrapper', function(){
      expect(elt.find('.szs-board-pane').length).toBe(1);
      expect(elt.find('.szs-board-pane-body').html()).toContain('Hello!');
    });
    it('should consist of header, transclude container, resize handler', function(){
      expect(elt.find('.szs-board-pane-header').length).toBe(1);
      expect(elt.find('.szs-board-pane-body').length).toBe(1);
    });
    it('should be a JQuery-ui-resizable',function(){
      expect(elt.find('.szs-board-pane.ui-widget-content').hasClass('ui-resizable')).toBeTruthy();
    });
    it('should have header composed of logo and title, provided through attrs', function(){
      var header = elt.find('.szs-board-pane-header');
      expect(header.find('img').attr("ng-src")).toBe("url");
      expect(header.find('.title').text()).toBe("title");

    });
    it('should be linkable with szsDashSearch directive and call upTop method on "top" action', function(){
      var ctrl = elt.controller('szsDashSearch');
      spyOn(ctrl, 'upTop');
      elt.find('.tie [data-action=top]').click();
      expect(ctrl.upTop).toHaveBeenCalledWith('9');
    });
    it('should have action triggers with min, med, max values of data-action attributes and collapse, '
        + 'set height and fit contents on them',function(){
      elt.find('.tie [data-action=min]').click();
      var e = elt.find('.szs-board-pane.ui-widget-content');
      expect($(e).height()).toBe(elt.find('.szs-board-pane-header.ui-widget-header').height()+1);
      elt.find('.tie [data-action=med]').click();
      var e = elt.find('.szs-board-pane.ui-widget-content');
      expect($(e).height()).toBe(300);
      elt.find('.tie [data-action=max]').click();
      var e = elt.find('.szs-board-pane.ui-widget-content');
      expect($(e).height()).toBe(0);
    })


  });
});
