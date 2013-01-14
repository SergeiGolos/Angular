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
