'use strict'

angular.module('szsKeyList',[])
/**
 * @ngdoc overview
 * @name szsKeyList module
 * @description
 * Provides a service and a directive to support manageable list of options, each with list of items.
 */
  .factory('szsKeyList', function (){
    /**
     * @ngdoc service
     * @name szsKeyList
     * @description
     * Provides object, containing data for szsKeyList directive and methods to add/delete options/items
     */
    return function(){
      var opts = {};
      return {
        opts: opts,
        /**
         * @ngdoc property
         * @name opts
         * @description
         * keyList data
         */
        add: function(optKey, itmKey, optText, itmText){
          /**
           * @ngdoc method
           * @name add
           * @methodOf szsKeyList.szsKeyList
           * @param {string} optKey - key of the option
           * @param {string} itmKey - key of the item
           * @param {string} optText - text of the option
           * @param {string} itmText - text of the item
           * @description
           * adds an option and item
           * sets the option and item if exists
           */
          if (!angular.isDefined(opts[optKey])){
            opts[optKey] = {title:optText, items:{}}
          }
          opts[optKey].items[itmKey] = {title:itmText};
        },
        del: function(optKey, itmKey) {
          /**
           * @ngdoc method
           * @name del
           * @param optKey {string} - key of the option
           * @param itmKey {string} - key of the item
           * @description
           * removes an item of option identified by optKey and itm Key
           * if no items left removes option
           * if no itmKey provided removes option with all items
           */
          if (angular.isDefined(optKey)) {
            if (angular.isDefined(itmKey)) {
              if (angular.isDefined(opts[optKey].items[itmKey])) {
                delete opts[optKey].items[itmKey];
                if (Object.keys(opts[optKey].items).length == 0) delete opts[optKey];
              }
            } else {
              if (angular.isDefined(opts[optKey])) delete opts[optKey];
            }
          }
        }
      };
    };
  })
  .directive('szsKeyList', [function(){
    /**
     * @ngdoc directive
     * @name szsKeyList
     * @requires szsBbSearch
     */
    return {
      restrict: 'E',
      require: '^szsBbSearch',
      scope: {
        data:'=szsKeyList'
      },
      link: function(scope, elt, attrs, ctrl){
//        scope.delFn = ctrl.fltOptsDel;
        scope.a = 'test';
      },
      templateUrl: 'components/szs-key-list/szs-key-list.html'
    }
  }])
;