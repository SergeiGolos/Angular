/*  	The MIT License (MIT)
		Copyright (c) 2013 Sergei Golos

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
///<reference path="AngularTS\angular.d.ts" />
///<reference path="AngulazrTS\angularPublic.d.ts" />
module RoutingEvents {
    /// Private Variables
    var _routeProvider, 
        _eventStack,
        _id;

    angular.module("RoutingEvents", [], function ($routeProvider) {
        _routeProvider = $routeProvider;                        
    }).
    factory('reRouteStack', function($injector) {
        var _eventStack = {}, _id = 0;
        return {
            List : function() { return _eventStack; },
            Push : function(event, id, args) { 
                
                _eventStack[event] = _eventStack[event] || {};
                _eventStack[event][id] = args;
                return {
                    Break: function () {
                        delete _eventStack[event][id];
                    }
                };
            },            
            Process : function (name, ngParams) {
                if(_eventStack[name] != undefined) {
                    angular.forEach(_eventStack[name], function (event, index) {
                        var func = typeof (event) == "function" ? event : event[event.length], argList = $injector.annotate(event), params = [];
                        angular.forEach(argList, function (arg, index) {
                            params.push(ngParams[arg] || $injector.get(arg));
                        });
                        func.apply(undefined, params);
                    });
                }
            }            
        };
    }).
    factory('reRouter', function (reRouteStack) {         
        return {
            // Register event and generate 
            When: function (event : string, args) {
                var id = _id++;
                _routeProvider.when(event, {
                    controller: 'ctrlRouting',
                    template: '<div style="display:none;"></div>',
                    resolve: { 'routeName': function () { return event; } }
                });

                return reRouteStack.Push(event, id, args);                
            },

            // Exposes the event stack
            Routes: function () { return _eventStack;  }            
        };        
    }).
    controller('ctrlRouting', function ($route, routeName, reRouteStack) {
        reRouteStack.Process(routeName, $route.current.params);          
    });    
}