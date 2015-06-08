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
})(window, window.angular);;
(function(window, angular, undefined) {
  'use strict';

  /**
   * @ngdoc overview
   * @name szsKeyList
   * @module szsKeyList
   * @description
   * Provides a service and a directive to support manageable list of options, each with list of items.
   */
  angular.module('szsKeyList',[])
  /**
   * @ngdoc object
   * @name szsKeyList.szsKeyList
   * @module szsKeyList
   * @description
   * Provides function returning an object, containing data for szsKeyList directive and methods to add/delete options/items
   * property: opts
   * methods: add, del
   */
    .factory('szsKeyList', function (){
      return function(){
        var opts = {};
        return {
          opts: opts,
          /**
           * @ngdoc method
           * @name add
           * @methodOf szsKeyList.szsKeyList
           * @param {string} optKey - key of the option
           * @param {string} itmKey - key of the item
           * @param {string} optText - text of the option
           * @param {string} itmText - text of the item
           * @description
           * adds an option and item,
           * sets the option and item if exists
           */
          add: function(optKey, itmKey, optText, itmText){
            if (!angular.isDefined(opts[optKey])){
              opts[optKey] = {title:optText, items:{}}
            }
            opts[optKey].items[itmKey] = {title:itmText};
            if (this.onChange) this.onChange();
          },
          /**
           * @ngdoc method
           * @name del
           * @methodOf szsKeyList.szsKeyList
           * @param {string} optKey - key of the option
           * @param {string} itmKey - key of the item
           * @description
           * removes an item of option identified by optKey and itm Key
           * if no items left removes option,
           * if no itmKey provided removes option with all items
           */
          del: function(optKey, itmKey) {
            if (angular.isDefined(optKey)) {
              if (angular.isDefined(itmKey)) {
                if (angular.isDefined(opts[optKey].items[itmKey])) {
                  delete opts[optKey].items[itmKey];
                  if (Object.keys(opts[optKey].items).length == 0) delete opts[optKey];
                  if (this.onChange) this.onChange();
                }
              } else {
                if (angular.isDefined(opts[optKey])) delete opts[optKey];
              }
            }
          },
          /**
           * @ngdoc event
           * @name onChange
           * @eventOf szsKeyList.szsKeyList
           * @description
           * fired when keyList is being manipulated via add/del
           */
          onChange: null
        };
      };
    })

  /**
   * @ngdoc directive
   * @name szsKeyList.szsKeyListPanel
   * @module szsKeyList
   * @restrict 'E'
   * @param {attribute} szsKeyList - object, returned by szsKeyList service
   */
    .directive('szsKeyListPanel', [function(){
      return {
        restrict: 'E',
        scope: {
          keyList:'=szsKeyList'
        },
        link: function(scope){//, elt, attrs, ctrl){
          scope.optClick = function(optKey, evt){
            var target = angular.element(evt.target);
            if (target.hasClass('szs-key-list-button')) {
              if (target.hasClass('remove')) {
                scope.keyList.del(optKey, target.attr('data-szs-item'));
              }
            }
          };
          scope.optDel = function(optKey){
            scope.keyList.del(optKey);
          }
        },
        templateUrl: 'templates/szs-key-list-panel.html'
      }
    }]);
})(window, window.angular);;
(function(window, angular, undefined) {
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
          templateUrl: 'templates/szs-dash-search.html'
        }
      }
    ]);
})(window, window.angular);