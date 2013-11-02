'use strict';

angular.module('dynProxy')
  .factory('invocation', [ function() { 
    return {
      create : function (_name, _args, _intercepters, _object) {

        var depth = _intercepters.length;
        var self = undefined;       

        function process() {          
          var intercepter = null
          while (intercepter == null && depth > 0) {
            intercepter = _intercepters[_intercepters.length - depth];
            depth--;
            if (typeof(intercepter.intercept) != "function") {
              intercepter = null;
            }
          }

          if (intercepter != null) {
            var result = intercepter.intercept(self);                               
            return result;
          }
          
          return invoke(); 
        }

        function invoke(name, args) {                           
          return _object[name || _name].apply(_object, args || _args);          
        }

        self =  {
            'name' : _name,
            'args' : _args,           
            'intercepters' : _intercepters,             
            'process' : process,
            'invoke' : invoke
          };        

        return self;
      }
    };
  }]);
