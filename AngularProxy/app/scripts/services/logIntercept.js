(function() {
  'use strict';
  angular.module('dynProxy')
    .factory('logIntercept', [ function() {
      return {        
        intercept: function (invocation) {        
          
          console.log('LogIntercept: ' + invocation.name);
          var result = invocation.process();
          console.log('LogIntercept: ' + result);
                
          return result;
        }
      };
  }]);
}());