/*      The MIT License (MIT)
        Copyright (c) 2013 Sergei Golos

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.*/
///<reference path="AngularTS\angular.d.ts" />
///<reference path="AngulazrTS\angularPublic.d.ts" />
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
    factory('reRouteStack', function($injector) {
        var _eventStack = {}, _id = 0;
        return {            
            // Get the full event stack object
            List : function() { return _eventStack; },
            // Register an event on route argument
            Push : function(event, args) { 
                var id = _id++;
                _eventStack[event] = _eventStack[event] || {};
                _eventStack[event][id] = args;
                return {
                    Break: function () {
                        delete _eventStack[event][id];
                    }
                };
            },            
            // Called with a route name and list of processed route variables
            // Runs any function triggered on the route.
            Broadcast: function (name, ngParams) {
                if(_eventStack[name] != undefined) {
                    angular.forEach(_eventStack[name], function (data, index) {
                        var event = typeof(data) == "function" ? data : data.event,
                            resolver = data.resolve && typeof(data.resolve) == "object" ? data.resolve : {},
                            func = typeof (event) == "function" ? event : event[data.event.length], 
                            argList = $injector.annotate(func), 
                            params = [];
                            arg = "";

                        var notEmpty = function(value) {
                            if (value != null && value != undefined) {
                                return true;
                            }
                            return false;
                        };

                        for(var index in argList) {
                            var arg = argList[index];                                                    
                            if (notEmpty(ngParams[arg])) 
                            {   
                                params.push(ngParams[arg]);
                                continue;
                            }
                            
                            if (notEmpty(resolver[arg]) && notEmpty(resolver[arg](ngParams))) {
                                params.push(resolver[arg](ngParams));
                                continue;
                            }
                            params.push($injector.get(arg));
                        };                        

                        func.apply(undefined, params);
                    });
                }
            }            
        };
    }).    
    // Provides a registering mechanism angular routeProvider    
    factory('reRouter', function (reRouteStack, routeProvider, $route, $location, $browser, $rootScope) {                                
        $rootScope.$on("$locationChangeSuccess", function(oldUrl, newUrl) {            
            var params, match, routes = reRouteStack.List();
            for(var path in routes) {            
                if (!match && (params = switchRouteMatcher($location.path(), path))) {                
                  reRouteStack.Broadcast(path, params);                                  
                }
            }
        });

        $rootScope.$on("$routeChangeSuccess", function(sender, x) { });

        return {
            // Register event and generate 
            When: function (event : string, args) {                
                return reRouteStack.Push(event, args);                
            }
        };        
    });    
}

function switchRouteMatcher(on, when) {
      // TODO(i): this code is convoluted and inefficient, we should construct the route matching
      //   regex only once and then reuse it

      // Escape regexp special characters.
      when = '^' + when.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&") + '$';
      var regex = '',
          params = [],
          dst = {};

      var re = /:(\w+)/g,
          paramMatch,
          lastMatchedIndex = 0;

      while ((paramMatch = re.exec(when)) !== null) {
        // Find each :param in `when` and replace it with a capturing group.
        // Append all other sections of when unchanged.
        regex += when.slice(lastMatchedIndex, paramMatch.index);
        regex += '([^\\/]*)';
        params.push(paramMatch[1]);
        lastMatchedIndex = re.lastIndex;
      }
      // Append trailing path part.
      regex += when.substr(lastMatchedIndex);

      var match = on.match(new RegExp(regex));
      if (match) {
        angular.forEach(params, function(name, index) {
          dst[name] = match[index + 1];
        });
      }
      return match ? dst : null;
    }
