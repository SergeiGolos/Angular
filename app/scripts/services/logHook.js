'use strict';

angular.module('dynProxy')
  .factory('logHook', function () {    
    return {
      types : ['$location'],      
      interceptors : ['logIntercept']     
    };
  });
