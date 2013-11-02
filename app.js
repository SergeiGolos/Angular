(function(){


	var app = angular.module('app', ['dynProxy']);

	app.factory("test", [function() {
		return {
			test : function () { return 1; }
		}
	}]);
}());