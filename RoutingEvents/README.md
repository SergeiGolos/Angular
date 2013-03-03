Routing Events for AngularJS
================

The routing implementation for angular is robust, but for smaller application can result in decent amount of ceremony code.  To simplify the process in smaller projects Routing Events brings routing events directly to the controller.  Importing the RoutingEvent module enable injecting the reRouter object into a controller.

How Does it Work? ([e.g.](https://github.com/SergeiGolos/Angular/blob/master/RoutingEvents/sample.html))
-----------------

In a scenario where routings main function is to load a template and overlay a controller over it, the default routing system simplifies the implementation.  However, another way to look at the role of routing in a UI application is a state machine, to notify any interested controllers of the current state of the application.  Building a UI around this strategy also enables deep linking in your application. Routing Events an abstraction to simplify the process. 

Plain and simple
-----------------

Inject the 'RoutingEvents' module into your application and inject the reRouter service into your controller.  Register the route with reRouter and a callback function. Now when the route on the page matches #/Event, the $scope variable of that controller will be set to $scope.id to id from the route variable.  

	// create an application with RoutingEvents injected
	var app = angular.module('app', ['RoutingEvents']);

	// create a controller with reRouter injected
	app.controller('ctrl', function($scope, reRouter) {
		
		//register your route
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

Working with the spirit of Angulars DI model, the callback function can request any for variables to be injected.  This process is also promise aware.  When registering the event handler:

 + *options.init* - Resolve each of the resolver function and return the resulting objects.
 + *options.resolved* - Promises are completed and the resulting data is injected to the handler.

**route variables**

	when ('/Home/:variableName', function(variableName) {});

**resolver objects**
	
	when ('/Home/:message', 
		function(variableName, anotherName) { 
		},{ 
			'variableName' : function(args) { return args.message; },
		  	'anotherName' : function(args) { return "any data in scope"; }
		});

	// args : an object which consists of route variables;
	
**angulars DI**

	when ('/Home', function($injector) {  });


Ajax Example
-------------

When the loading starts, we can set the loading state
	
	// here the 'request' variable is going to be a promise
	var _init = function($scope) { $scope.loading = true }

Once all promises are completed, this function fires

	// with the 'request' variable now the promise resolution	
 	var _resolved = function($scope, request, $injector) {  		
 		$scope.model = request.data;
 		}); 	
 	};

The main controller with requesting ajax resolution
	
	app.controller('ctrlMain', function ($scope, $http, reRouter) {	
		
		// register the event		
		reRouter.When('/Event/:id', 
		
			// pre-defined callback function allow for unit testing 
			// as all dependencies needs to be passed to the function
			{
				event : _init,
				resolved : _resolved 
			}, 		
			{ 
				// the resolver inject the scope varaible				
				'$scope' : function () { 
					return $scope; 
				},
			
				// the resolver inject the an $http promise			    	
			    	'request' : function(args) {
			    		return $http.get('/someUrl', args);
				}
			});
	});
	
The second controller, which may need to react to the state change
	
	app.controller('ctrlSibling', function ($scope, reRouter) {
		
		// register the event	
		reRouter.When('/Event/:id', 
			
			// this controller only cares when the function is resolved
			// but request and the same object as the initial controller
			// requet is not in this controllers resolver
			
			// Resolver allows promise resolution to the scoped for event.  
			// As a route registered to the same event from another controller
			// has access to resulting values
			
			function($scope, request) {						
				$scope.model = request.data[0];
			}, 		
			{ 
				// the resolver inject the scope varaible
				'$scope' : function () { 
					return $scope; 
				}
			});		
	});


Important Note: Routing Events has not yet been tested against the minification friendly format : ['message', '$injector', function(message, $injector) { }]

APIs
-----

**reRouter** - the injectable service which exposes the 'When' register function

**When** - resigters routing events with RoutingEvents 
	
	When(event, callback, resolver);
 + **event** - *The route to be registerd _(e.g. '/Home' or '/User/:user')_*
 + **callback** - *function to be called after routing and successful resolution.  This is the 'resolved' function in the expressive options processor*
 + **resolver** (optional) - *a object of resolving function _(e.g. { 'name' : function(args) { return 'value'; } })_*

The short hand of *When(event, callback)* is useful in the short term, it promotes poor pratice of writing  hard to unit test code.  It is better to utilize the resolver to inject the scope into a function. 

	When(event, options, resolver);

 + **event** - *The route to be registerd (e.g. '/Home' or '/User/:user')*
 + **options** - *function to be called after routing and successful resolution*
	- **init** - *processed at route change, no resolution takes place and promisess are returned*
	- **resolved** - *processed once all dependencies are resolved, the promise response is returned*	
 + **resolver** (optional) - *a object of resolving function (e.g. { 'name' : function(args) { return 'value'; } })*

The extended version of When, exposes the init property where a function to process the initialize command and exposes the requesting promises from the resolver.  This is useful to show a loading state when making calls to the server.

Change Log
----------

 + **2013.03.03**: Removed the dependency on vg-view and controller.


TODO
------
* 100% Unit Test Coverage;
* support minification friendly format
