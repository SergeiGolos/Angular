(function(){


	var proxyLib = angular.module('dynProxy', []);	
	/*angular.prototype.interceptable = function(name, type, int) {
		return 

	};*/

	proxyLib.factory('LogIntercept', [ function() {
		return {
			intercept: function (invocation) {
				console.log('LogIntercept: ' + invocation);
				var result = invocation.process();
				console.log('LogIntercept: ' + result);

				return result;
			}
		};
	}]);

	proxyLib.factory('Empty', [function() {				
		return {
			self : function () { return undefined; }
		};
	}]);


	proxyLib.factory('Invocation', ['$injector', function($injector) { 
		return {
			create : function (_name, _args, _intercepters, fn) {

				var depth = _intercepters.length;
				var self = undefined;				

				function process() {					
					if ( depth > 0 ) {						
						
						var intercepter = $injector.get(_intercepters[_intercepters.length - depth])
						depth--;
						var result = intercepter.intercept(self);												
						return result;
					}
					return fn.apply(_args);
				}

				self = {
					'name' : function() { return _name; },
					'args' : function() { return _args; },
					'intercepters' : function() { return _intercepters; },							
					'process' : process
				};

				return self;
			}
		};
	}]);

	proxyLib.factory('DynamicProxy', ['$injector', 'Invocation', function ($injector, Invocation) {		
		var intercepters = [];
		
		function createClassProxy (type) {									
			var response = {};
					
			for (var i = 1; i < arguments.length; i++) {
				intercepters.push(arguments[i]);				
			}

			response = $injector.get(type);
			for(var propertyName in response) {
				var property = response[propertyName];

				if (typeof(property) == "function") {
					response[propertyName] = function () {
						return Invocation.create(propertyName, arguments, intercepters, property).process();
					}
				}
			}

			return response;
		}

		return {
			CreateClassProxy : createClassProxy
		};
	}]);

	

}());