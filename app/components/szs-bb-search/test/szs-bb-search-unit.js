'use strict';

describe('module szsBbSearch',function(){
  describe('szsBbSearchQueryProvider', function(){
    var prv, srv;

//    beforeEach(module('szsBbSearch'));

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
  describe('szsBbSearchQuery', function() {
    var inst, result, $httpBackend;

    beforeEach(module('szsBbSearch'));

    beforeEach(inject(function (_$httpBackend_, szsBbSearchQuery) {
      inst = szsBbSearchQuery('search', function (res) {
        result = res;
      });
      result = null;
//      $httpBackend = _$httpBackend_;
    }));
    it('should return object with method to request search service by search string and options',
      function () {
        expect(typeof inst.req).toBe('function');
        expect(typeof inst.request).toBe('function');
      }
    );
    it('should prepare request on search string and options', inject(function (szsKeyList, szsBbSearchKeyListOpts) {
      var opts = szsKeyList();
      opts.add('opt', 'itm', 'option', 'item');
      opts.add('opt', 'itm2', 'option', 'item2');
      opts.add('opt1', 'itm3', 'option', 'item2');
      inst.request('search', szsBbSearchKeyListOpts(opts.opts));
      var req = inst.req();
      expect(req.params).toEqual({opt: ['itm', 'itm2'], opt1: ['itm3'], searchStr: 'search'})
    }));
  });
  describe('szsBbSearchKeyListOpts', function(){
    var srv;

    beforeEach(module('szsBbSearch'));

    beforeEach(inject(function(szsBbSearchKeyListOpts){
      srv = szsBbSearchKeyListOpts;
    }));

    it("Should convert szsKeyList options data {opt:{title:'o',items:{itm:{title:'i'}}}} to {opt:['itm']}", function(){
      var input = {opt:{title:'o',items:{itm:{title:'i'}}}};
      var output = {opt:['itm']};
      expect(srv(input)).toEqual(output);
    });
  });
  describe('szsBbSearch', function(){
    var $compile, $rootScope, $httpBackend;


    beforeEach(function(){
      module('templates');
      module('szsBbSearch');
    });

    beforeEach(inject(function(_$compile_, _$rootScope_, _$httpBackend_){
      $compile = _$compile_;
      $rootScope = _$rootScope_;
      $httpBackend = _$httpBackend_;
    }));


    it('Should request search and set response to szsBoardData',function(){
      $httpBackend.expectGET('test?searchStr=srch').respond([{test: 'item'}]);
      var scope = $rootScope.$new();
      $compile('<szs-bb-search svc-url="test" search-str="srch" ></szs-bb-search>')(scope);
      $httpBackend.flush();
      $rootScope.$digest();
      expect(scope.$countChildScopes()).toBe(0);
      expect(scope.szsBoardData).toEqual([{test: 'item'}]);
    });

    it('Should contain szs-search-string, szs-key-list, szs-bb-search and szs-board-pane elements',
      inject(function(){
        $httpBackend.expectGET('test?searchStr=srch').
          respond([{option: 'item', title:'title', items:[]}]);
        var elt = $compile('<szs-bb-search svc-url="test" search-str="srch" ></szs-bb-search>')($rootScope);
        $rootScope.$digest();
        expect(elt.html()).toMatch(/szs-search-string/);
        expect(elt.html()).toMatch(/szs-key-list/);
        expect(elt.html()).toMatch(/szs-bb-search/);
//        expect(elt.html()).toMatch(/szs-board-pane/);
      })
    );

  });
});