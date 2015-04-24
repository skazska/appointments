'use strict';

describe('module szs-board', function(){
  describe('szs-board-pane directive', function(){
    var $compile, $rootScope, scope;
    var elt;
    beforeEach(function(){
      module('templates');
      module('szsBoard');
    })
    beforeEach(inject(function(_$compile_, _$rootScope_){
      $compile = _$compile_;
      $rootScope = _$rootScope_;
      scope = $rootScope.$new();
      elt = '<div><szs-board-pane title="title">Hello!</szs-board-pane></div>';
      elt = $compile(elt)(scope);
      $rootScope.$digest();
    }));
    it('should be a wrapper', function(){
      expect(elt.html()).toBe('e');
      expect(elt.find('.szs-board-pane').length).toBe(1);
      expect(elt.find('.szs-board-pane-body').html()).toBe('Hello!');

    });
    it('should consist of header, transclude container, resize handler', function(){
      expect(elt.find('.szs-board-pane'))
    });
    it('should have header composed of logo and title, provided through attrs', function(){

    });
  });
});
