'use strict';

describe('module szsBbSearch',function(){
  beforeEach(module('szsBbSearch'));
  describe('szsBbSearchQueryProvider', function(){
    var prv, srv;

    beforeEach(function(){
      angular.module('testMod',['szsBbSearch']).config(function(szsBbSearchQueryProvider){
        prv = szsBbSearchQueryProvider;
      });
      module('testMod');
      inject(function(szsBbSearchQuery){
        srv = szsBbSearchQuery;}
      );
    });
    it('should have urlPrefix configurable', function() {
      expect(prv.urlPrefix()).toBe('');
      prv.urlPrefix('data/');
      expect(prv.urlPrefix()).toBe('data/');
    });
    it('urlPrefix should be attached to service url', function(){
      prv.urlPrefix('data/');
      var inst = srv('search.json',function(res){});
      expect(inst.req().url).toBe('data/search.json');
    });
  });
  describe('szsBbSearchQuery', function(){
    var inst, result, $httpBackend;

    beforeEach(inject(function(_$httpBackend_,szsBbSearchQuery){
      inst = szsBbSearchQuery('search',function(res){result = res;});
      result = null;
      $httpBackend = _$httpBackend_;
    }));
    it('should return object with method to request search service by search string and options',
      function(){
        expect(typeof inst.req).toBe('function');
        expect(typeof inst.request).toBe('function');
      }
    );
    it('should prepare request on search string and options', inject(function(szsKeyList){
      var opts = szsKeyList();
      opts.add('opt', 'itm', 'option', 'item');
      opts.add('opt', 'itm2', 'option', 'item2');
      opts.add('opt1', 'itm3', 'option', 'item2');
      inst.request('search',opts);
      var req = inst.req();
      expect(req.params).toEqual({opt:['itm','itm2'], opt1:['itm'], searchStr:'search'})
    }));

  });
})