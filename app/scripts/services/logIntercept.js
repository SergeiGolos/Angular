'use strict';

angular.module('dynProxy')
  .factory('logIntercept', [ 'dynlog', function(dynlog) {
    return {
      intercept: function (invocation) {
        
        dynlog.log('LogIntercept: ' + invocation.name);
        var result = invocation.process();
        dynlog.log('LogIntercept: ' + result);
              
        return result;
      }
    };
  }]);


  
