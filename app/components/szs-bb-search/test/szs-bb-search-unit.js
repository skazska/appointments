'use strict';

describe('module szsBbSearch',function(){
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
    it('should have urlPrefix to configure', function() {
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
    var inst, result;
    beforeEach(module('szsBbSearch'));
    beforeEach(inject(function (_$httpBackend_, szsBbSearchQuery) {
      inst = szsBbSearchQuery('search', function (res) {
        result = res;
      });
      result = null;
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
  describe('szsBbSearch directive', function(){
    var $compile, $rootScope, $httpBackend, $log;
    var scope, iScope, elem;
    beforeEach(function(){

      module('templates');
      module('szsBbSearch');
    });
    beforeEach(inject(function(_$compile_, _$rootScope_, _$httpBackend_, _$log_){
      $log = _$log_;
      $compile = _$compile_;
      $rootScope = _$rootScope_;
      $httpBackend = _$httpBackend_;

      scope = $rootScope.$new();
//      elem = '<szs-bb-search svc-url="test" ></szs-bb-search>';
//      $httpBackend.expectGET('test?searchStr=src')
//        .respond([{option: 'test', title:'test', items:[{item: 'item', title: 'item'}]}]);
    }));
    describe('apply and auto apply', function(){
      beforeEach(function(){
        $httpBackend.expectGET('').respond([]);
        elem = '<szs-bb-search ></szs-bb-search>';
        elem = $compile(elem)(scope);
      });
      it('should contain element with class apply-btn', function(){
        expect(elem.find('.apply-btn').length).toBe(1);
      });
      it('should initiate search request if auto-apply is set', function(){
        elem = '<szs-bb-search auto-apply></szs-bb-search>';
        elem = $compile(elem)(scope);
        expect($httpBackend.flush).not.toThrow();
      });
      it('should initiate search request when click on applyBtn if auto-apply is not set', function(){
        expect($httpBackend.flush).toThrow();
        elem.find('.applyBtn').eq(0).click(); //$rootScope.$digest();
        expect($httpBackend.flush).not.toThrow();
      });
    });
    describe('markup', function(){
      beforeEach(function(){
        $httpBackend.expectGET('test').
          respond([{option: 'test', title:'test', items:[{item: 'item', title: 'item'}]}
            ,{option: 'test1', title:'test1', items:[{item: 'item1', title: 'item1'}
            ,{item: 'item2', title: 'item2'}]}]);
        elem = $compile(elem)(scope);
        $httpBackend.flush();
        $rootScope.$digest();
      });
      it('Should contain tabs', function(){
        expect(elem.find('.szs-bb-search-tabs .szs-bb-search-tab').length).toBe(2);
      });
      it('Should contain szs-board-pane items', function(){
        var panes = elem.find('.szs-board-pane');
        expect(panes.length).toBe(2);
        var pane = panes.eq(0);
        expect(pane.find('.opt-item').length).toBe(1);
        expect(pane.html()).toContain('item');
        pane = panes.eq(1);
        expect(pane.find('.opt-item').length).toBe(2);
        expect(pane.html()).toContain('item1');
        expect(pane.html()).toContain('item2');
      });
      it('Should contain szs-search-string', function(){
        expect(elem.find('.szs-search-string input[ng-model=searchStr]').length).toBe(1);
      });
      it('Should contain markup for apply changes in key list', function(){
        expect(elem.find('#applyBtn').length).toBe(1);
      });
    });
    describe('communication ', function(){
      it('Should request search and set response to szsBoardData',function(){
        $httpBackend.expectGET('test?searchStr=srch')
          .respond([{option: 'test', title:'test', items:[{item: 'item', title: 'item'}]}]);
        elem = '<szs-bb-search svc-url="test" search-str="srch" auto-apply></szs-bb-search>';
        elem = $compile(elem)(scope); $httpBackend.flush(); $rootScope.$digest();
        iScope = elem.isolateScope();
        expect(iScope.szsBoardData).toEqual([{option: 'test', title:'test', items:[{item: 'item', title: 'item'}]}]);
      });
      it('Should not request search if search string len less than min-search-str',function(){
        $httpBackend.expectGET('test?searchStr=src')
          .respond([{option: 'test', title:'test', items:[{item: 'item', title: 'item'}]}]);
        elem = '<szs-bb-search svc-url="test" search-str="src" min-search-str="4" auto-apply></szs-bb-search>';
        elem = $compile(elem)(scope);
        expect($httpBackend.flush).toThrow();
      });

      it('Should send request with searchStr param, on searchStr scope value change', function(){
        $httpBackend.expectGET('test').respond([]);
        elem = $compile(elem)(scope); $httpBackend.flush(); $rootScope.$digest();
        iScope = elem.isolateScope();
        expect(iScope.szsBoardData).toEqual([]);
        $httpBackend.expectGET('test?searchStr=1')
          .respond([{option: 'test', title:'test', items:[{item: 'item', title: 'item'}]}]);
        iScope.searchStr = '1'; $rootScope.$digest(); $httpBackend.flush();
        expect(iScope.szsBoardData).toEqual([{option: 'test', title:'test', items:[{item: 'item', title: 'item'}]}]);
      });
      it("Should send request with options params, on scope's keyList change", function(){
        $httpBackend.expectGET('test').respond([]);
        elem = $compile(elem)(scope); $httpBackend.flush(); $rootScope.$digest();
        iScope = elem.isolateScope();
        expect(iScope.szsBoardData).toEqual([]);
        $httpBackend.expectGET('test?opt=itm')
          .respond([{option: 'test', title:'test', items:[{item: 'item', title: 'item'}]}]);
        iScope.szsKeyList.add('opt', 'itm', 'option', 'item'); $rootScope.$digest(); $httpBackend.flush();
        expect(iScope.szsBoardData).toEqual([{option: 'test', title:'test', items:[{item: 'item', title: 'item'}]}]);
      });

    });
    describe('interactions', function(){
      it('should reorder tabs and panes on tab click so it become first', function(){
        $httpBackend.expectGET('test').
          respond([{option: 'test', title:'test'},{option: 'test1', title:'test1'},{option: 'test2', title:'test2'}]);
        elem = $compile(elem)(scope); $httpBackend.flush(); $rootScope.$digest();
        var tabs = elem.find('.szs-bb-search-tab');
        expect(tabs.eq(0).html()).toContain('test');
        tabs.eq(1).click(); //$rootScope.$digest();
        tabs = elem.find('.szs-bb-search-tab');
        expect(tabs.eq(0).html()).toContain('test1');
      });
    });

  });
});