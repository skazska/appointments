'use strict';

describe('szsKeyList module', function(){
  beforeEach(module('szsKeyList'));
  describe('szsKeyList service', function() {
    var srv;
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

    beforeEach(inject(function(_$compile_, _$rootScope_){
      $compile = _$compile_;
      $rootScope = _$rootScope_;
    }));

//    it('should replace <szs-key-list-panel> tag with <ul><li> compiled using szsKeyList data set in attr',
//      inject(function(szsKeyList){
//        $rootScope.szsKeyList = szsKeyList();
//        $rootScope.szsKeyList.add('opt','itm','option','item');
//        var elt = $compile('<div><szs-key-list-panel szs-key-list="szsKeyList"></szs-key-list-panel></div>')($rootScope);
//        $rootScope.$digest();
//        expect(elt.html()).toMatch(/.*<div[^>]*szs-key-list.*>*option*<ul>*<li[^>]*szs-key-list-item*>*item*keyList.del*/);
//      });
//    );
  });

});