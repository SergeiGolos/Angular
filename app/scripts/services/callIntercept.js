(function() {
  'use strict';
  angular.module('dynProxy')
    .factory('callIntercept', [
        function() {
            return {
                intercept: function(invocation) {
                    console.log('Call To ' + invocation.name);
                    console.log('with Args: ');
                    angular.forEach(invocation.args, function(arg) {
                        console.log("- " + arg);
                    });
                    
                    var result = invocation.process();
                    console.log('=> ', result);

                    return result;
                }
            };
        }
    ]);
}());