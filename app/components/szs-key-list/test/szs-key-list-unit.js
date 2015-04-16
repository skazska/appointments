'use strict';

describe('szsKeyList module', function(){
  describe('szsKeyList service', function() {
    var srv;

    beforeEach(module('szsKeyList'));

    beforeEach(inject(function(szsKeyList){
      srv = szsKeyList();
    }));
    it('should add items to opts', function(){
      srv.add('opt', 'itm', 'option', 'item');
      expect(srv.opts).toEqual({opt:{title:"option",items:{itm:{title:"item"}}}});
    });
    it('should remove option', function(){
      srv.add('opt', 'itm1', 'option', 'item1');
      srv.del('opt');
      expect(srv.opts).toEqual({});
    });
    it('should remove items from option, removing option with last item', function(){
      srv.add('opt', 'itm', 'option', 'item');
      srv.add('opt', 'itm2', 'option', 'item2');
      srv.del('opt', 'itm2');
      expect(srv.opts).toEqual({opt:{title:"option",items:{itm:{title:"item"}}}});
      srv.del('opt', 'itm');
      expect(srv.opts).toEqual({});
    });
  });
  describe('szsKeyList directive', function() {
    var $compile,
      $rootScope;

    beforeEach(function(){
      module('templates');
      module('szsKeyList');
    });

    beforeEach(inject(function(_$compile_, _$rootScope_){
      $compile = _$compile_;
      $rootScope = _$rootScope_;
    }));

    it('should not contain elements if keyList is empty, should contain elements for options and items otherwise',
      inject(function(szsKeyList){
        $rootScope.szsKeyList = szsKeyList();
        var elt = $compile('<szs-key-list-panel szs-key-list="szsKeyList"></szs-key-list-panel>')($rootScope);
        $rootScope.$digest();
        expect(elt.html()).not.toMatch(/class.*szs-key-list/);
        $rootScope.szsKeyList.add('opt','itm','optiontitle','itemtitle');
        $rootScope.$digest();
        expect(elt.html().split('optiontitle').length).toBe(2);
        expect(elt.html().split('itemtitle').length).toBe(2);
        expect(elt.html()).toMatch(/class.*szs-key-list/);
        expect(elt.html()).toMatch(/class.*szs-key-list-item/);
      })
    );
  });

});