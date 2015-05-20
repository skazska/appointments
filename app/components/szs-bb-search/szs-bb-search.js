'use strict';

/**
 * @ngdoc overview
 * @name szsBbSearch
 * @module szsBbSearch
 * @description
 * Provides a directive to create search dashboard, using search input, search options and result dashboard.
 *
 * It should request search by search string and options
 */
angular.module('szsBbSearch', ['szsKeyList', 'szsBoard', 'ui.sortable'])
/**
 * @ngdoc object
 * @name szsBbSearch.szsBbSearchQuery
 * @module szsBbSearch
 * @description
 * service for search server querying
 * configurable: the zsBbSearchQueryProvider expose method  urlPrefix  to set|get urlPrefix ant configuration
 * service is a constructor function, that request server for data and initialize live data refreshes on options or
 *  search string change, and by poling or websocket
 *
 */
  .provider('szsBbSearchQuery', function szsBbSearchQueryProvider (){
    var urlPrefix = '';
    this.urlPrefix = function(val) {
      if (angular.isDefined(val)) {
        urlPrefix = val;
      }
      return urlPrefix;
    };

    this.$get = ['$http', function($http){
      /**
       * @ngdoc method
       * @name constructor
       * @methodOf szsBbSearch.szsBbSearchQuery
       * @param {string} path - url path to web service
       * @param {string|object} searchStr - search string
       * @param {object} opts - search options
       * @param {function(data)} setter - result data setter
       * @description
       * returns object with method to do requests to search service by search string and options
       * initialize poling for result change or websocket
       */
      return function(path, setter){
        var req = {
          method: 'GET',
          url: urlPrefix.concat(path),
          params: {},
          headers:{}
        };
        return {
          /**
           * @ngdoc method
           * @name req
           * @description
           * @methodOf szsBbSearch.szsBbSearchQuery
           * @returns {Object} request specs
           */
          req: function(){ return req; },
          /**
           * @ngdoc method
           * @name request
           * @methodOf szsBbSearch.szsBbSearchQuery
           * @param {string} searchStr - search string
           * @param {object} opts - search options
           * @description
           *
           */
          request: function(searchStr, opts) {
            req.params = angular.copy(opts);
            req.params.searchStr = searchStr;
            $http(req).success(function(data){
              setter(data);
            });//.error();
          }
        }
      }
    }];
  })
/**
 * @ngdoc service
 * @name szsBbSearch.szsBbSearchKeyListOpts
 * @module szsBbSearch
 * @param {szsKeyList.szsKeyList} opts - keyList options data
 * @returns {Object} - options in form {opt:['itm']}
 * @description
 * service convert szsKeyList options data {opt:{title:'o',items:{itm:{title:'i'}}}} to {opt:['itm']}
 */
  .factory('szsBbSearchKeyListOpts', function(){
    return function(opts){
      var res = {};
      angular.forEach(opts, function(val, key){
        this[key] = [];
        angular.forEach(val.items, function(val1, key1){
          this.push(key1);
        },this[key]);
      },res);
      return res;
    }
  })
/**
 * @ngdoc directive
 * @name szsBbSearch.szsBbSearch
 * @module szsBbSearch
 * @restrict 'E'
 * @param {attribute} svcUrl - url to search service
 * @param {attribute} searchStr - search string
 * @description
 * fill scope by models:
 * szsKeyList - ref to named service
 * szsBoardData - Search results
 * sortOptions - structure with options for JQuery.sortable
 * watcher for searchStr and event listener for keyList change
 * itemClick function for
 */
  .directive('szsBbSearch',['$http', '$window','szsKeyList', 'szsBbSearchQuery', 'szsBbSearchKeyListOpts',
    function($http, $window, szsKeyList, szsBbSearchQuery, szsBbSearchKeyListOpts){
      return {
        restrict: 'E',
        scope: {
          svcUrl: '@',
          searchStr: '@'
        },
        controller: function($scope) {//, $element, $attrs, $transclude, otherInjectables) { ... },
          function upTop(i){
            i = scope.szsBoardData.splice(i,1);
            scope.szsBoardData.splice(0,0,i[0]);
          }
          var scope = $scope;
          this.upTop = upTop;
          var keyList = szsKeyList();
          scope.szsKeyList = keyList;
          scope.szsBoardData = [];
          var query = szsBbSearchQuery(scope.svcUrl, function(data){
            scope.szsBoardData = data
          });
          scope.tabClick = function(evt){
            var target = angular.element(evt.delegateTarget);
            if (target.hasClass('szs-bb-search-tab')) {
              var i = target.attr('data-szs-bb-search-tab');
              upTop(i);
            }

          };

          scope.$watch('searchStr', function(){
            query.request(scope.searchStr, szsBbSearchKeyListOpts(keyList.opts));
          });
          keyList.onChange = function(){
            query.request(scope.searchStr, szsBbSearchKeyListOpts(keyList.opts));
          };

          scope.sortOptions = {axis:'y'};
          if ($window.innerWidth<768){ scope.sortOptions.axis = 'x'; }
          $window.onresize = function(){
            if ($window.innerWidth<768){
              scope.$apply("sortOptions.axis = 'x'");
            } else {
              scope.$apply("sortOptions.axis = 'y'");
            }
          };

          scope.itemClick = function(option, item) {
            switch (option.contentType) {
              case 'option':
                keyList.add(option.option,item.item,option.title,item.title);
                break;
              case 'item':

                break;
            }
          };
        },
//        link: function(scope) { //, elt, attrs, ctrl){
//        },
        templateUrl: 'components/szs-bb-search/szs-bb-search.html'
      }
    }
  ])
;