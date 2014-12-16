(function() {
    'use strict';
    var defaultInjector;
    var interceptors = [];
    var hooks = [];
    var annonCounter = 0;

    function Hook(val) {

        this.val = val;

        this.val.targets = this.val.targets || [];
        this.val.conditions = this.val.conditions || [];
        this.val.interceptors = this.val.interceptors || [];

        return this;
    }
    Hook.prototype.for = function (target) {
        this.val.targets.push(target);
        return this;
    };
    Hook.prototype.if = function (condition) {
        var fn = condition;
        if (!angular.isFunction(condition) && angular.isString(condition)) {
            fn = function (invocation) {
                return invocation.name == condition;
            }
        }
        this.val.conditions.push(fn);

        return this;
    }
    Hook.prototype.with = function (interceptor) {
        var self = this;
        if (!angular.isArray(interceptor)) {
            interceptor = [interceptor];
        }
        angular.forEach(interceptor, function (fn) {
            var name = fn;
            self.val.interceptors.push(name);
        });

        return this;
    }
    Hook.prototype.validate = function (invocation) {
        var result = true;
        angular.forEach(this.val.conditions, function (condition) {
            result = result && condition(invocation);
        });
        return result;
    }
    
    function Invocation(_name, _args, _interceptors, _object) {

        var depth = _interceptors.length;
        var self = undefined;

        function invoke(name, args) {
            return _object[name || _name].apply(_object, args || _args);
        }

        function process() {
            var intercepter = null;
            while (intercepter == null && depth > 0) {
                intercepter = _interceptors[_interceptors.length - depth];
                depth--;
                if (intercepter.hook && !intercepter.hook.validate(self)) {
                    intercepter = null;
                }

                if (intercepter && typeof(intercepter.intercept) != "function") {
                    intercepter = null;
                }                
            }

            if (intercepter != null) {
                var result = intercepter.intercept(self);
                return result;
            }

            return invoke();
        }        

        self = {
            'name': _name,
            'args': _args,
            'interceptors ': _interceptors,
            'process': process,
            'invoke': invoke
        };

        return self;
    }

   
    function createClassProxy(type) {
        var response = {};
        var object = defaultInjector(type);
        var registredInterceptors = [];

        for (var i = 1; i < arguments.length; i++) {            
            registredInterceptors.push(angular.isFunction(arguments[i]) ? { intercept: arguments[i] } : defaultInjector(arguments[i]));
        }               

        angular.forEach(hooks, function(hook) {
            if (hook.val.targets.indexOf(type) > -1 ) {
                for (var intercept in hook.val.interceptors) {
                    var current = hook.val.interceptors[intercept];
                    var obj = angular.isFunction(current) ? { intercept: current } : defaultInjector(current);
                    obj.hook = hook;
                    registredInterceptors.push(obj);                        
                }
            }
        });

        if (registredInterceptors.length == 0) {
            return object;
        }

        for (var propertyName in object) {
            if (angular.isFunction(object[propertyName])) {
                response[propertyName] = function() {
                    var name = propertyName;
                    return function() {
                        return Invocation(name, arguments, registredInterceptors, object).process();
                    }
                }();
            } else {
                response[propertyName] = object[propertyName];
            }
        }

        return response;
    }

    var proxy = angular.module('dynProxy', []);
    
    proxy.run(function ($injector) {
        defaultInjector = $injector.get;        
        $injector.get = function () {
            return createClassProxy.apply(this, arguments);
        }
        $injector.invoke = function (fn, self, locals) {
                var args = [],
                    $inject = $injector.annotate(fn),
                    length, i,
                    key;

                for (i = 0, length = $inject.length; i < length; i++) {
                    key = $inject[i];
                    if (typeof key !== 'string') {
                        throw $injectorMinErr('itkn',
                                'Incorrect injection token! Expected service name as string, got {0}', key);
                    }
                    args.push(
                      locals && locals.hasOwnProperty(key)
                      ? locals[key]
                      : $injector.get(key)
                    );
                }
                if (!fn.$inject) {
                    // this means that we must be an array.
                    fn = fn[length];
                }

                // http://jsperf.com/angularjs-invoke-apply-vs-switch
                // #5388
                return fn.apply(self, args);
            }

        $injector.instantiate = function (Type, locals) {
            var Constructor = function() {},
                instance, returnedValue;

            // Check if Type is annotated and use just the given function at n-1 as parameter
            // e.g. someModule.factory('greeter', ['$window', function(renamed$window) {}]);
            Constructor.prototype = (angular.isArray(Type) ? Type[Type.length - 1] : Type).prototype;
            instance = new Constructor();
            returnedValue = $injector.invoke(Type, instance, locals);

            return angular.isObject(returnedValue) || angular.isFunction(returnedValue) ? returnedValue : instance;
        }
    });  
    proxy.factory('proxyhook', function() {
        return { register : function (arg) {
            if (!angular.isArray(arg)) {
                arg = [arg];
            }
            angular.forEach(arg, function(h) {
                if (!angular.isFunction(h)) {
                    throw("Unable to register");
                }
                hooks.push(h(new Hook({})));
            });
            
        }};
    });
}());