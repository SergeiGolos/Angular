'use strict';

 angular.module('dynProxy', []);
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
            return function () {                        
              return invocation.create(name, arguments, intercepters, hooks,  object).process();
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

'use strict';

angular.module('dynProxy')
  .factory('empty',  [function() {        
    return {      
      value : function () { return null; },
      self : function () { return undefined; }
    };
  }]);

'use strict';

angular.module('dynProxy')
  .factory('invocation', [ function() { 
    return {
      create : function (_name, _args, _intercepters, _hooks, _object) {

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

'use strict';

angular.module('dynProxy')
  .factory('logHook', function () {
    // Service logic
    // ...

    var meaningOfLife = 42;

    // Public API here
    return {
      someMethod: function () {
        return meaningOfLife;
      }
    };
  });

'use strict';

angular.module('dynProxy')
  .factory('logIntercept', [ 'dynlog', function(dynlog) {
    return {
      intercept: function (invocation) {
        
        dynlog.log('LogIntercept: ' + invocation.name);
        var result = invocation.process();
        dynlog.log('LogIntercept: ' + result);
              
        return result;
      }
    };
  }]);


  
