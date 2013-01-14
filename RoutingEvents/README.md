Routing Events
================

The routing implementation for angular is robust, but for smaller application can be overkill.  To simplify the process in smaller projects Routing Events brings routing events directly to the controller.  Importing the RoutingEvent module enable injecting the reRouter object into a controller.

Important note: Currently, the RoutingEvents module utilize a dummy <ng-view></ng-view> section. A hidden div is rendered to it, future versions will address this.

How Does it Work? ([e.g.](https://github.com/SergeiGolos/Angular/blob/master/RoutingEvents/sample.html))
-----------------

In a scenario where routing main function is to load a template and overlay a controller over it the default routing system simplifies the implementation.  However, another way to look at the role of routing in a UI application, is to notify any interested controllers of the current state of the application.  Building a UI around this strategy also allows deep linking into the application. Routing Events an abstraction to simplify the process. 

Once the reRouter objects is injected into your controller, register a route with the When function.  Because of closure, $scope is available with in the function automatically.

	reRouter.When('/Event', function() { $scope.eventList.push("Event"); });

With the help of Angulars DI, any function registered with When also gain this benefit.  This applies to variables registered in the route as well as anything available to a controller level injector.  In the example below, bother the :message variable from the route and the DI requested $injector objects are loaded to function at execution.

	reRouter.When('/Event/:message', function(message, $injector) { 
		$scope.eventList.push("Event:" +  message)
	});

Important Note: Routing Events has not yet been tested against the minification friendly format :

	['message', '$injector', function(message, $onjector) { }]


TODO
------
* create unit test harness
* create unit tests 
* remove dependency on nv-view and ng-controller
* add support for handling minification friendly format
* add support to handle data requests with promises
