'use strict';

angular.module('dynProxy')
  .factory('dynamicproxy', ['$injector', 'invocation', function ($injector, invocation) {   
    var intercepters = [];
    var hooks = [];
    
    function registerHook () {
      for (var key in arguments) {
        var hook = $injector.get(arguments[key]);        
        hooks.push(hook);   
      }
    }

    function createClassProxy (type) {                  
      var response = {};
      for (var i = 1; i < arguments.length; i++) {        
        
        var intercepter = $injector.get(arguments[i]);
        intercepters.push(intercepter);       
      }

      var object = $injector.get(type);           
      var registredInterceptors = intercepters;

      for(var hook in hooks) {
        if (hooks[hook].types.indexOf(type) > -1) {
          for(var intercept in hooks[hook].interceptors) {
            registredInterceptors.push($injector.get(hooks[hook].interceptors[intercept]));  
          }          
        };

      }

      for(var propertyName in object) {       
        if (typeof(object[propertyName]) == "function") {
          response[propertyName] = function () {
            var name = propertyName;              
            

            
            
            return function () {                        
              return invocation.create(name, arguments, intercepters,  object).process();
            }
          }();
        }
      }

      return response;
    }

    return {
      CreateClassProxy : createClassProxy,
      RegisterHook : registerHook
    };
  }]);
