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
      templateUrl: 'components/szs-key-list/szs-key-list-panel.html'
    }
  }])
;