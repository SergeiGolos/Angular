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
                        arg = "";
                        var notEmpty = function (value) {
                            if(value != null && value != undefined) {
                                return true;
                            }
                            return false;
                        };
                        for(var index in argList) {
                            var arg = argList[index];
                            if(notEmpty(ngParams[arg])) {
                                params.push(ngParams[arg]);
                                continue;
                            }
                            if(notEmpty(resolver[arg]) && notEmpty(resolver[arg](ngParams))) {
                                params.push(resolver[arg](ngParams));
                                continue;
                            }
                            params.push($injector.get(arg));
                        }
                        ; ;
                        func.apply(undefined, params);
                    });
                }
            }
        };
    }).factory('reRouter', function (reRouteStack, routeProvider, $route, $location, $browser, $rootScope) {
        $rootScope.$on("$locationChangeSuccess", function (oldUrl, newUrl) {
            var params, match, routes = reRouteStack.List();
            for(var path in routes) {
                if(!match && (params = switchRouteMatcher($location.path(), path))) {
                    reRouteStack.Broadcast(path, params);
                }
            }
        });
        $rootScope.$on("$routeChangeSuccess", function (sender, x) {
        });
        return {
            When: function (event, args) {
                return reRouteStack.Push(event, args);
            }
        };
    });
})(RoutingEvents || (RoutingEvents = {}));
function switchRouteMatcher(on, when) {
    when = '^' + when.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&") + '$';
    var regex = '', params = [], dst = {
    };
    var re = /:(\w+)/g, paramMatch, lastMatchedIndex = 0;
    while((paramMatch = re.exec(when)) !== null) {
        regex += when.slice(lastMatchedIndex, paramMatch.index);
        regex += '([^\\/]*)';
        params.push(paramMatch[1]);
        lastMatchedIndex = re.lastIndex;
    }
    regex += when.substr(lastMatchedIndex);
    var match = on.match(new RegExp(regex));
    if(match) {
        angular.forEach(params, function (name, index) {
            dst[name] = match[index + 1];
        });
    }
    return match ? dst : null;
}
