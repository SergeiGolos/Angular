(function(){


	var proxyLib = angular.module('dynProxy', []);	
	/*angular.prototype.interceptable = function(name, type, int) {
		return 

	};*/	
	proxyLib.factory('dpLog', function() {
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
	});

	proxyLib.factory('LogIntercept', [ 'dpLog', function(dpLog) {
		return {
			intercept: function (invocation) {
				
				dpLog.log('LogIntercept: ' + invocation.name);
				var result = invocation.process();
				dpLog.log('LogIntercept: ' + result);

				return result;
			}
		};
	}]);

	proxyLib.factory('Empty', [function() {				
		return {			
			value : function () { return null; },
			self : function () { return undefined; }
		};
	}]);

	proxyLib.factory('Invocation', ['$injector', function($injector) { 
		return {
			create : function (_name, _args, _intercepters, _object, fn) {

				var depth = _intercepters.length;
				var self = undefined;				

				function process() {					
					var intercepter = null
					while (intercepter == null && depth > 0) {
						intercepter = $injector.get(_intercepters[_intercepters.length - depth])
						depth--;
						if (typeof(intercepter.intercept) != "function") {
							intercepter = null;
						}
					}

					if (intercepter != null) {
						var result = intercepter.intercept(self);																
						return result;
					}
					
					return fn.apply(_args);
				}

				function invoke(name, args) {					
					return _object[name || _name].apply(args || _args);
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

	proxyLib.factory('DynamicProxy', ['$injector', 'Invocation', function ($injector, Invocation) {		
		var intercepters = [];
		
		function createClassProxy (type) {									
			var response = {};
			for (var i = 1; i < arguments.length; i++) {				
				intercepters.push(arguments[i]);				
			}

			object = $injector.get(type);			
			
			for(var propertyName in object) {				
				if (typeof(object[propertyName]) == "function") {
					response[propertyName] = function () {
						var name = propertyName;	
						var property = object[propertyName];

						return function () {												
							return Invocation.create(name, arguments, intercepters, object, property).process();
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

	

}());