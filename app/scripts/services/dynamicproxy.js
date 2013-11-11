'use strict';

angular.module('dynProxy')
  .factory('dynamicproxy', ['$injector', 'invocation', function ($injector, invocation) {     
    // tracks the registred hooks.
    var defaultPriority = 10;
    var hooks = [];
     
    function _register() {
      for (var key in arguments) {
        var hook = $injector.get(arguments[key]);        
        hooks.push(hook);   
      }
    }

    function _interceptor(name) {
      var item = $injector.get(name);
        if (typeof(item.intercept) == "function") {
            return item;
        }
        return undefined;
    }

    function _interceptors(type, args) {            
      var interceptors = [];
      for (var key in args) {
        var item = _interceptor(args[key]);
        if (item != undefined) {
          interceptors.push(item);
        }      
      }

      for (var key in hooks) {
        var hook = hooks[key];
        if (hook.types == undefined) {
          continue;
        }

        if (hook.types.indexOf(type) > -1) {
          for (var hookIntercept in hook.interceptors) {
            var item = _interceptor(hook.interceptors[hookIntercept]);
            if (item != undefined) {
              interceptors.push(item);
            }      
          }
        }

      }

      return interceptors.sort(function(x, y) { 
        return x.priority || defaultPriority - y.priority || defaultPriority;
      });
    }

    function _create(type) {
      var response = {};      
          
      var object = $injector.get(type);
      var additionalArgs = [].splice.call(arguments, 1);     
      var registredInterceptors = _interceptors(type, additionalArgs);
      
      for(var propertyName in object) {       
        if (typeof(object[propertyName]) == "function") {          
          response[propertyName] = function () {            
            var name = propertyName;   
            return function() { 
              return invocation.create(name, arguments, registredInterceptors,  object).process();            
            };
          }();
        }
      }

      return response;
    }

    return {
      create : _create,
      register : _register
    };
  }]);