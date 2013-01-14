Routing Events for AngularJS
================

The routing implementation for angular is robust, but for smaller application can be overkill.  To simplify the process in smaller projects Routing Events brings routing events directly to the controller.  Importing the RoutingEvent module enable injecting the reRouter object into a controller.

Important note: Currently, the RoutingEvents module utilize a dummy <ng-view></ng-view> section. A hidden div is rendered to it, future versions will address this.

How Does it Work? ([e.g.](https://github.com/SergeiGolos/Angular/blob/master/RoutingEvents/sample.html))
-----------------

In a scenario where routing main function is to load a template and overlay a controller over it the default routing system simplifies the implementation.  However, another way to look at the role of routing in a UI application, is to notify any interested controllers of the current state of the application.  Building a UI around this strategy also allows deep linking into the application. Routing Events an abstraction to simplify the process. 


Plain and simple
-----------------

Inject the 'RoutingEvents' module into your application and inject the reRouter service into your controller.  Register the route with reRouter and a callback function.  And finally create dummy ng-view element with in the application scope.  Now when the route on the page matches #/Event, the $scope variable of that controller will be set to $scope.id to id from the route variable.  

	var app = angular.module('app', ['RoutingEvents']);

	app.controller('ctrl', function($scope, reRouter) {
		reRouter.When('/Event/:id', function(id) {
			$scope.id = id;
		});
	});

	// Note, this the quick and dirty example of the bare-bone requirements to get 
	// routing up and running.  THis example goes against best practices.  Because 
	// of closure, $scope is available to the callback function. However, this creates 
	// dependency on $scope and prevents function from being tested.  
	

Dependency Injection to the rescue
-----------------------------------

Working with the spirit of Angulars DI model, the callback function can request any for variables to be injected. This applies to:  

### variables registered in the route 

	when ('/Home/:variableName', function(variableName) {});

### variables defined in the resolve object 

	when ('/Home', { 
		event : function(variableName) {},
		resolve : { 'variableName' : function() { return variableValue; }
	});
	
### variables registered with angulars DI  

	when ('/Home', { 
		event : function($injector) {} }		
	});

### DI Example

The handler function is defined outside the scope of the controller, as a result we need to inject the scope into the function at event resolution.  On top of injecting the scope, the message variable from route parameters and angulars $injector are injected into the function as well.
	
	// Here, the handler function has no external dependences and can be tested. 
 	
 	var handler = function($scope, message, $injector) { 
 		$scope.message = message;
 	};

	app.controller('ctrlMessage', function ($scope, reRouter) {	
		reRouter.When('/Event/:message', {
			event : handler,
			resolve : { '$scope' : function () { return $scope; }}
		});
	});


Important Note: Routing Events has not yet been tested against the minification friendly format : ['message', '$injector', function(message, $onjector) { }]


TODO
------
* remove dependency on nv-view and ng-controller
* 100% Unit Test Coverage;
* support minification friendly format
