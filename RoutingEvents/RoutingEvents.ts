/*      The MIT License (MIT)
        Copyright (c) 2013 Sergei Golos

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.*/
///<reference path="AngularTS\angular.d.ts" />
///<reference path="AngularTS\angularPublic.d.ts" />
module RoutingEvents {
    /// Private Variables    
    var _rp;
    var RoutingEvents = angular.module("RoutingEvents", [], function ($routeProvider) {
        _rp = $routeProvider;
    }).
    /// This factory removes further routeProvider dependency for unit testing
    factory('routeProvider', function () {
        return _rp;
    }).
    /// Tacks the event stack object.
    factory('reRouteStack', function($injector, $q) {
        var _eventStack = {}, _id = 0;                  
        var events;
        return {
            // Get the full event stack object
            List : function() { return _eventStack; },
            // Register an event on route argument
            Push : function(event, args, resolve) { 
                var id = _id++;                
                // clean input for board caster
                // if only function, run only resolver function
                args = typeof (args) == 'function' ? { 'resolved': args }: args;
                
                // make sure the required properties exist, 
                args.init = args.init && typeof (args.init) == 'function' ? args.init : function () { };
                args.resolved = args.resolved && typeof (args.resolved) == 'function' ? args.resolved : function () { };
                args.resolve = args.resolve && typeof (args.resolve) == 'object' ? args.resolve : resolve || {};
                
                angular.forEach(args, function (item, index) {
                    if (typeof (item) == 'function') {
                        args[index] = {                                
                            func: item,
                            annotation : $injector.annotate(item),
                            params : {}
                        };
                    }
                });                     

                _eventStack[event] = _eventStack[event] || {};
                _eventStack[event][id] = args;
                                                      
                /// need to validate that this doesn't break the page.      
                return {
                    Break: function () {
                        delete _eventStack[event][id];
                    }
                };
            },            
            // Called with a route name and list of processed route variables
            // Runs any function triggered on the route.
            Broadcast: function (name, ngParams) {
                if(_eventStack[name] !== undefined) {                    
                                        
                    var promises = [];
                    var resloved = {}
                    var globalResolved = {};
                    var handler = function (data, status, headers, config, name, eventIndex) {
                        if (typeof (globalResolved[name]) != 'undefined') {
                            console.log("Warning: multiple resolvers have target the same name: " + name);
                        }
                        
                        resloved[name] = resloved[name] || {};
                        globalResolved[name] = resloved[name][eventIndex] = {
                            'data': data,
                            'status': status,
                            'headers': headers,
                            'config': config
                        };
                    };

                    var z = function(resolver, arg, ngParams) {
                        if (typeof (resolver[arg]) != 'undefined') {
                                return resolver[arg](ngParams);
                            }
                            return undefined

                    }

                     var y = function (resolved, arg, index) {
                         if (typeof (resloved[arg]) != 'undefined' && typeof ([index]) != 'undefined') {
                             return resloved[arg][index] || undefined;
                         }
                         return undefined;
                    };
                    var x = function (event, index, resolver) {
                        var result = [];
                        angular.forEach(event.annotation, function (arg, index) {
                            var injectable = ngParams[arg] || y(resloved,arg,index) || globalResolved[arg] || z(resolver, arg, ngParams) ||  $injector.get(arg);
                            result.push(injectable);
                        });
                        return result;
                    };
                                                                
                    angular.forEach(_eventStack[name], function (event, index) {                                            
                        
                        //find all resolve elements across the fired event.
                        angular.forEach(event.resolve, function (object, name) {
                            var injectable = object(ngParams);                           
                            if (typeof (injectable.success) == 'function' && typeof (injectable.error) == 'function') {
                                promises.push(injectable.
                                    success(function (data, status, headers, config) { 
                                        handler(data, status, headers, config, name, index); 
                                    }).
                                    error(function (data, status, headers, config) { 
                                        handler(data, status, headers, config, name, index); 
                                    }));
                            }
                        });                                                
                        
                        // apply the init function
                        event.init.func.apply(undefined, x(event.init, index, event.resolve));                                                                                                
                    });                    

                    // apply the resolved function
                    $q.all(promises).then(function (requestResult) {                            
                        angular.forEach(_eventStack[name], function (event, index) {
                            event.resolved.func.apply(undefined, x(event.resolved, index, event.resolve));
                        });
                    });                                            
                }
            }            
        };
    }).    
    // Provides a registering mechanism angular routeProvider    
    factory('reRouter', function (reRouteStack, routeProvider) {         
        return {
            // Register event and generate 
            When: function (event : string, args, resolve) {                
                routeProvider.when(event, {
                    controller: 'ctrlRouting',
                    template: '<div style="display:none;"></div>',
                    resolve: { 'routeName': function () { return event; } }                    
                });
                return reRouteStack.Push(event, args , resolve);                
            }
        };        
    }).
    // Controller which process the routing elements and generates a notification event.
    controller('ctrlRouting', function ($route, routeName, reRouteStack) {
        reRouteStack.Broadcast(routeName, $route.current.params);          
    });    
}



