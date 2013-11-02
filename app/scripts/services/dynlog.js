'use strict';

angular.module('dynProxy')
  .factory('dynlog', [function() {
    var logs = [];
    return { 
      log : function(value) {
        logs.push(value);
        console.log(value);
      },
      length : function () {
        return logs.length;
      }
    };
  }]);
