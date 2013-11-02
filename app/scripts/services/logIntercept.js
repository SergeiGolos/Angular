'use strict';

angular.module('dynProxy')
  .factory('logIntercept', [ 'dynlog', function(dpLog) {
    return {
      intercept: function (invocation) {
        
        dpLog.log('LogIntercept: ' + invocation.name);
        var result = invocation.process();
        dpLog.log('LogIntercept: ' + result);

        return result;
      }
    };
  }]);
