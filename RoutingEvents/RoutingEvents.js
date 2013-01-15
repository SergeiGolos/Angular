/*      The MIT License (MIT)
		Copyright (c) 2013 Sergei Golos

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.*/
var RoutingEvents;
(function (RoutingEvents) {
    var _rp;
    var RoutingEvents = angular.module("RoutingEvents", [], function ($routeProvider) {
        _rp = $routeProvider;
    }).factory('routeProvider', function () {
        return _rp;
    }).factory('reRouteStack', function ($injector) {
        var _eventStack = {
        }, _id = 0;
        return {
            List: function () {
                return _eventStack;
            },
            Push: function (event, args) {
                var id = _id++;
                _eventStack[event] = _eventStack[event] || {
                };
                _eventStack[event][id] = args;
                return {
                    Break: function () {
                        delete _eventStack[event][id];
                    }
                };
            },
            Broadcast: function (name, ngParams) {
                if(_eventStack[name] != undefined) {
                    angular.forEach(_eventStack[name], function (data, index) {
                        var event = typeof (data) == "function" ? data : data.event, resolver = data.resolve && typeof (data.resolve) == "object" ? data.resolve : {
                        }, func = typeof (event) == "function" ? event : event[data.event.length], argList = $injector.annotate(func), params = [];
                        angular.forEach(argList, function (arg, index) {
                            params.push(ngParams[arg] || resolver[arg](ngParams) || $injector.get(arg));
                        });
                        func.apply(undefined, params);
                    });
                }
            }
        };
    }).factory('reRouter', function (reRouteStack, routeProvider) {
        return {
            When: function (event, args) {
                routeProvider.when(event, {
                    controller: 'ctrlRouting',
                    template: '<div style="display:none;"></div>',
                    resolve: {
                        'routeName': function () {
                            return event;
                        }
                    }
                });
                return reRouteStack.Push(event, args);
            }
        };
    }).controller('ctrlRouting', function ($route, routeName, reRouteStack) {
        reRouteStack.Broadcast(routeName, $route.current.params);
    });
})(RoutingEvents || (RoutingEvents = {}));
