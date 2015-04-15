'use strict'

/**
 * @ngdoc overview
 * @name szsKeyList
 * @module szsKeyList
 * @description
 * Provides a service and a directive to support manageable list of options, each with list of items.
 */
angular.module('szsKeyList',[])
/**
 * @ngdoc service
 * @name szsKeyList
 * @module szsKeyList
 * @description
 * Provides object, containing data for szsKeyList directive and methods to add/delete options/items
 */
  .factory('szsKeyListData', function (){
    return function(){
      var opts = {};
      return {
        /**
         * @ngdoc property
         * @name opts
         * @description dd
         */
        opts: opts,
        /**
         * @ngdoc method
         * @name add
         * @methodOf szsKeyListData
         * @param {string} optKey - key of the option
         * @param {string} itmKey - key of the item
         * @param {string} optText - text of the option
         * @param {string} itmText - text of the item
         * @description
         * adds an option and item
         * sets the option and item if exists
         */
        add: function(optKey, itmKey, optText, itmText){
          if (!angular.isDefined(opts[optKey])){
            opts[optKey] = {title:optText, items:{}}
          }
          opts[optKey].items[itmKey] = {title:itmText};
        },
        /**
         * @method del
         * @param {string} optKey - key of the option
         * @param {string} itmKey - key of the item
         * @description
         * removes an item of option identified by optKey and itm Key
         * if no items left removes option
         * if no itmKey provided removes option with all items
         */
        del: function(optKey, itmKey) {
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

/**
 * @ngdoc directive
 * @name szsKeyList
 * @module szsKeyList
 * @restrict 'E'
 * @requires szsBbSearch
 * @param {attribute} szsKeyList - object, returned by szsKeyList service
 */
  .directive('szsKeyList', [function(){
    return {
      restrict: 'E',
      require: '^szsBbSearch',
      scope: {
        keyList:'=szsKeyList'
      },
      link: function(scope, elt, attrs, ctrl){
      },
      templateUrl: 'components/szs-key-list/szs-key-list.html'
    }
  }])
;