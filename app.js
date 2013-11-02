(function(){


	var app = angular.module('app', ['dynProxy']);

	
	app.factory("ModifyIntercept", [function() {
		return {
			intercept : function (invocation) { 
				if (invocation.name == 'value') {
					var value = invocation.invoke();
					if (value === undefined) {
						return 1;
					}
					if (value === null) {
						return 2;
					}
				}
				return invocation.process();
			}
		}
	}]);






}());