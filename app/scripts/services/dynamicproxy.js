'use strict';

angular.module('dynProxy')
  .factory('dynamicproxy', ['$injector', 'invocation', function ($injector, invocation) {   
    var intercepters = [];
    var hooks = [];
    
    function createClassProxy (type) {                  
      var response = {};
      for (var i = 1; i < arguments.length; i++) {        
        
        var intercepter = $injector.get(arguments[i]);
        intercepters.push(intercepter);       
      }

      var object = $injector.get(type);     
      
      for(var propertyName in object) {       
        if (typeof(object[propertyName]) == "function") {
          response[propertyName] = function () {
            var name = propertyName;  
            var property = object[propertyName];

            return function () {                        
              return invocation.create(name, arguments, intercepters, hooks,  object, property).process();
            }
          }();
        }
      }

      return response;
    }

    return {
      CreateClassProxy : createClassProxy
    };
  }]);
