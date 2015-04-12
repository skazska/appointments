'use strict'

angular.module('szsKeyList',[])
  .factory('szsKeyList', function (){
    return {
      init: function(){
        var opts = {};
        return {
          opts: opts,
          add: function(optKey, itmKey, optText, itmText){
            if (!angular.isDefined(this.opts[optKey])){
              this.opts[optKey] = {title:optText, items:{}}
            }
            this.opts[optKey].items[itmKey] = {title:itmText};
          },
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
      }
    }
  })
  .directive('szsKeyList', [function(){
    return {
      restrict: 'E',
      require: '^szsBbSearch',
      scope: {
        data:'=szsKeyListData'
      },
      link: function(scope, elt, attrs, ctrl){
        scope.delFn = ctrl.fltOptsDel;
      },
      templateUrl: 'components/szs-key-list/szs-key-list.html'
    }
  }])
;