'use strict';

angular.module('dynProxy')
  .factory('empty',  [function() {        
    return {      
      value : function () { return null; },
      self : function () { return undefined; }
    };
  }]);
