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
    }).factory('reRouteStack', function ($injector, $q) {
        var _eventStack = {
        }, _id = 0;
        var events;
        return {
            List: function () {
                return _eventStack;
            },
            Push: function (event, args, resolve) {
                var id = _id++;
                args = typeof (args) == 'function' ? {
                    'resolved': args
                } : args;
                args.init = args.init && typeof (args.init) == 'function' ? args.init : function () {
                };
                args.resolved = args.resolved && typeof (args.resolved) == 'function' ? args.resolved : function () {
                };
                args.resolve = args.resolve && typeof (args.resolve) == 'object' ? args.resolve : resolve || {
                };
                angular.forEach(args, function (item, index) {
                    if(typeof (item) == 'function') {
                        args[index] = {
                            func: item,
                            annotation: $injector.annotate(item),
                            params: {
                            }
                        };
                    }
                });
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
                if(_eventStack[name] !== undefined) {
                    var promises = [];
                    var resloved = {
                    };
                    var globalResolved = {
                    };
                    var handler = function (data, status, headers, config, name, eventIndex) {
                        if(typeof (globalResolved[name]) != 'undefined') {
                            console.log("Warning: multiple resolvers have target the same name: " + name);
                        }
                        resloved[name] = resloved[name] || {
                        };
                        globalResolved[name] = resloved[name][eventIndex] = {
                            'data': data,
                            'status': status,
                            'headers': headers,
                            'config': config
                        };
                    };
                    var z = function (resolver, arg, ngParams) {
                        if(typeof (resolver[arg]) != 'undefined') {
                            return resolver[arg](ngParams);
                        }
                        return undefined;
                    };
                    var y = function (resolved, arg, index) {
                        if(typeof (resloved[arg]) != 'undefined' && typeof ([
                            index
                        ]) != 'undefined') {
                            return resloved[arg][index] || undefined;
                        }
                        return undefined;
                    };
                    var x = function (event, index, resolver) {
                        var result = [];
                        angular.forEach(event.annotation, function (arg, index) {
                            var injectable = ngParams[arg] || y(resloved, arg, index) || globalResolved[arg] || z(resolver, arg, ngParams) || $injector.get(arg);
                            result.push(injectable);
                        });
                        return result;
                    };
                    angular.forEach(_eventStack[name], function (event, index) {
                        angular.forEach(event.resolve, function (object, name) {
                            var injectable = object(ngParams);
                            if(typeof (injectable.success) == 'function' && typeof (injectable.error) == 'function') {
                                promises.push(injectable.success(function (data, status, headers, config) {
                                    handler(data, status, headers, config, name, index);
                                }).error(function (data, status, headers, config) {
                                    handler(data, status, headers, config, name, index);
                                }));
                            }
                        });
                        event.init.func.apply(undefined, x(event.init, index, event.resolve));
                    });
                    $q.all(promises).then(function (requestResult) {
                        angular.forEach(_eventStack[name], function (event, index) {
                            event.resolved.func.apply(undefined, x(event.resolved, index, event.resolve));
                        });
                    });
                }
            }
        };
    }).factory('reRouter', function (reRouteStack, routeProvider) {
        return {
            When: function (event, args, resolve) {
                routeProvider.when(event, {
                    controller: 'ctrlRouting',
                    template: '<div style="display:none;"></div>',
                    resolve: {
                        'routeName': function () {
                            return event;
                        }
                    }
                });
                return reRouteStack.Push(event, args, resolve);
            }
        };
    }).controller('ctrlRouting', function ($route, routeName, reRouteStack) {
        reRouteStack.Broadcast(routeName, $route.current.params);
    });
})(RoutingEvents || (RoutingEvents = {}));
