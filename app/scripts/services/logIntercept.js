'use strict';

angular.module('dynProxy')
  .factory('logIntercept', [ 'dynlog', function(dynlog) {
    return {
      priority: 10,
      properties : [],
      intercept: function (invocation) {        
        
        dynlog.log('LogIntercept: ' + invocation.name);
        var result = invocation.process();
        dynlog.log('LogIntercept: ' + result);
              
        return result;
      }
    };
  }]);


  
