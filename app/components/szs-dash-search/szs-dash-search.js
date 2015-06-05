'use strict';

/**
 * @ngdoc overview
 * @name szsDashSearch
 * @module szsDashSearch
 * @description
 * Provides a directive to create search dashboard, using search input, search options and result dashboard.
 *
 * It should request search by search string and options
 */
angular.module('szsDashSearch', ['szsKeyList', 'szsBoard', 'ui.sortable'])
/**
 * @ngdoc object
 * @name szsDashSearch.szsDashSearchQuery
 * @module szsDashSearch
 * @description
 * service for search server querying
 * configurable: the zsBbSearchQueryProvider expose method  urlPrefix  to set|get urlPrefix ant configuration
 * service is a constructor function, that request server for data and initialize live data refreshes on options or
 *  search string change, and by poling or websocket
 *
 */
  .provider('szsDashSearchQuery', [
    function szsDashSearchQueryProvider () {
      var urlPrefix = '';
      this.urlPrefix = function (val) {
        if (angular.isDefined(val)) {
          urlPrefix = val;
        }
        return urlPrefix;
      };
      this.$get = ['$http', function ($http) {
        /**
         * @ngdoc method
         * @name constructor
         * @methodOf szsDashSearch.szsDashSearchQuery
         * @param {string} path - url path to web service
         * @param {string|object} searchStr - search string
         * @param {object} opts - search options
         * @param {function(data)} setter - result data setter
         * @description
         * returns object with method to do requests to search service by search string and options
         * initialize poling for result change or websocket
         */
        return function (path, setter, error) {
          var req = {
            method: 'GET',
            url: urlPrefix.concat(path||''),
            params: {},
            headers: {},
            responseType: "json"
          };
          return {
            /**
             * @ngdoc method
             * @name req
             * @description
             * @methodOf szsDashSearch.szsDashSearchQuery
             * @returns {Object} request specs
             */
            req: function () {
              return req;
            },
            /**
             * @ngdoc method
             * @name request
             * @methodOf szsDashSearch.szsDashSearchQuery
             * @param {string} searchStr - search string
             * @param {object} opts - search options
             * @description
             *
             */
            request: function (searchStr, opts) {
              if (angular.isDefined(opts)){
                req.params = angular.copy(opts);
              }
              if (angular.isDefined(searchStr)){
                req.params.searchStr = searchStr;
              }
              $http(req).success(setter||angular.noop).error(error||angular.noop);
            }
          }
        }
      }];
    }
  ])
/**
 * @ngdoc service
 * @name szsDashSearch.szsDashSearchKeyListOpts
 * @module szsDashSearch
 * @param {szsKeyList.szsKeyList} opts - keyList options data
 * @returns {Object} - options in form {opt:['itm']}
 * @description
 * service convert szsKeyList options data {opt:{title:'o',items:{itm:{title:'i'}}}} to {opt:['itm']}
 */
  .factory('szsDashSearchKeyListOpts', function(){
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
 * @name szsDashSearch.szsDashSearch
 * @module szsDashSearch
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
  .directive('szsDashSearch',['$http', '$window','szsKeyList', 'szsDashSearchQuery', 'szsDashSearchKeyListOpts',
    function($http, $window, szsKeyList, szsDashSearchQuery, szsDashSearchKeyListOpts){
      return {
        restrict: 'E',
        scope: {
          svcUrl: '@',
          searchStr: '@',
          minSearchStr: '@',
          autoApply: '@'
        },
        controller: function($scope, $element, $attrs){//, $transclude, otherInjectables) { ... },
          var scope = $scope;
          if (angular.isDefined(scope.minSearchStr)) { scope.minSearchStr = parseInt(scope.minSearchStr); }
          else { scope.minSearchStr = 0; }
          //key list
          var keyList = szsKeyList();
          scope.szsKeyList = keyList;

          //board data
          scope.szsBoardData = [];
          //reorder list of boards
          function upTop(i){
            i = scope.szsBoardData.splice(i,1);
            scope.szsBoardData.splice(0,0,i[0]);
          }
          //assign boards reorder method to controller
          this.upTop = upTop;
          //assign boards reorder on click method to scope
          scope.tabClick = function(evt){
            var target = angular.element(evt.delegateTarget);
            if (target.hasClass('szs-dash-search-tab')) {
              var i = target.attr('data-szs-dash-search-tab');
              upTop(i);
            }
          };
          //assign board items click handler
          scope.itemClick = function(option, item) {
            switch (option.contentType) {
              case 'option':
                keyList.add(option.option,item.item,option.title,item.title);
                break;
              case 'item':

                break;
            }
          };

          //querying
          //decorate apply-btn with .btn-info class and "Wait" caption on query start,
          //.btn-primary and "Apply" on searchStr or keyList change pending
          //.btn-success and "Ok" on successful request
          //.btn-danger and "Error" on request error
          //request data method
          scope.apply={caption:"Search", auto:false, btnClass:"btn-success"};
          scope.request = function(){
            scope.apply.caption = "Wait"; scope.apply.btnClass = "btn-info";
            szsDashSearchQuery(
              scope.svcUrl,
              function(data){
                scope.szsBoardData = data;
                scope.apply.caption = "Ok"; scope.apply.btnClass = "btn-success";
              },
              function(data, status) {
                scope.apply.caption = "Error"; scope.apply.btnClass = "btn-danger";
              }
            ).request(scope.searchStr, szsDashSearchKeyListOpts(keyList.opts));
          };
          //if auto-apply - set watcher and listener to search string and keylist
          scope.requestTrigger = function(){
            scope.apply.caption = 'Apply'; scope.apply.btnClass = "btn-primary";
            if (angular.isDefined($attrs.autoApply)) { scope.request(); }
          };
          //query on search string change
          scope.$watch('searchStr', function(newVal, oldVal){
            if (!angular.isDefined(newVal)) newVal = "";
            if ((newVal.length>=parseInt(scope.minSearchStr))){ scope.requestTrigger(); }
          });
          //query on keyList change
          keyList.onChange = scope.requestTrigger;
          //disable apply-btn
          scope.apply.auto = angular.isDefined($attrs.autoApply);

          //init JQuery sortable with responsivness
          scope.sortOptions = {axis:'y'};
          if ($window.innerWidth<768){ scope.sortOptions.axis = 'x'; }
          $window.onresize = function(){
            if ($window.innerWidth<768){
              scope.$apply("sortOptions.axis = 'x'");
            } else {
              scope.$apply("sortOptions.axis = 'y'");
            }
          };

        },
        templateUrl: 'components/szs-dash-search/szs-dash-search.html'
      }
    }
  ])
;