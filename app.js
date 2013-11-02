(function(){


	var app = angular.module('app', ['dynProxy']);

	
	app.factory("ModifyIntercept", [function() {
		return {
			intercept : function (invocation) { 
				if (invocation.name == 'value') {
					return 1;
				}
				return invocation.process();
			}
		}
	}]);






}());