Angular Proxy (v0.2)
============
Inspired by the Castle Dynamic Proxy project, Angular Proxy enables a visualization layer over your inject-able factory objects.  One way to think about this: multiple directives can change the behavior of a single DOM element, multiple interceptors allow you to change the behavior of your injectable object.

# Why do I care?
Separation of concerns.  Take for example a save function a REST API, generally we create some type of wrapper, provider or repository around the actual call to our back end. We need this to create validation and trap server error events.  Something we often call ceremony code.

Instead, we can create a proxy object of the rest call and a group of interceptors that prevent or augment the result of the function.  This also allows to seamlessly add behavior to your application.  A new interceptor factory can be injected on proxy creation.

# How it works
Proxy object is hidden behind a number of interceptors, any of which can prevent and change behavior of the call before getting to and after resolving the real factory object.  So what are interceptors.  They are function which are aware of the context of execution context of the function.  The name of the function on the object being executed, the arguments and the object being worked on.  Think of an intercepter function as a wrapper around the actual call.  

In an interceptor you are expected to call the next level in the wrapper stack and return the result.  But since you are incharge of executing the proxied object, you are in control how it gets executed and how the result of the execution is modified before returning it.


### DI and the Interceptor
Angular Proxy hijacks the default angular $injector object, which means that every time $injector is used in all of angular a proxy could be created.  This is based off the concept of hooks which we will get into a bit later.  For now lets dive into a quick example.

    function myController($injector) {
      var obj = $injector.get('$location');
    }

Here we have example of a controller which gets the Angular injector and pulls the $location object from the contianer.   But once the dynProxy module is loaded this function becomes more powerful.  For one it is now overloaded and can take any number of arguments.  The first argument must always be the object you are trying to resolve, the rest can be any number of interceptors you also wanted loaded on the functions of that proxy object.

    function myController($injector) {
      var obj = $injector.get('$location', function(invocation) { return inovcation.process(); });
    }

This would be an identity interceptor, it simply pushes returns the result of the next interceptor on the stack.  In this case, it is the only interceptor on the stack, so invocation.process() will return underlaying function from $location object.  

The invocation argument:
 -  name : Name of the function being invoked.
 - args : Arguments being passed to the proxy function.
 - interceptors : List of interceptors for this invocation.
 - process() : Moves to the next level of the proxy.  The response builds a recursive stack, so to propagate the base response pass along the result of this function in each instance of the intercept function.    
 - invoke(name, args) : Executes the base function, or any function on the base object.


Since the proxy is driven by DI, it would be wrong not to utilize it here, so the same results can be achived with a registered factory.

    angular.module('app').factory('identityIntercept', function() {
      return {
        interceptor : function(invocation) { return inovcation.process(); }
      }
    });

    function myController($injector) {
      var obj = $injector.get('$location', 'identityIntercept');
    }    

In this case, we create the interceptor and allow the DI system look it up for us.  Anytime an interceptor is defined it can be done with a string name for the injectable factory object or an anonymous function. This object must implement a object with a function on the interceptor property.


### Selling Point: The Hook.
So injecting $injector into your function and creating proxies is great, but it lacks elegance for a clean solution.  If I need an interceptor on an object, chances are this is an application wide requirement, or what they would call a cross cutting concern.  Enter stage the hook.

    angular.module('app', ['dynProxy']).run(function (proxyhook) {
      proxyhook.register(function (hook) {
        return hook.for('$location').with('identityIntercept');
      });
    });

This code creates a permanent requirment to create $location object with an identityIntercept attached to it's functions.  This can even work on the $injector object.  This has a intersting use in debugging, allowing you log the composition of your application.  Some benefits to creating a factory inteceptor, you can utilize angular DI to inject services and factories into your inteceptor so the execution of the inteceptor can be context aware.

The register function takes a function as it's single paramater.  The function has a hook object passed to it.  This object allows a fluid interface for registering targets, interceptors, and conditions.

 - hook.for('') => hook - this function takes name of an injectable object and returns another instance of hook.
 - hook.with() => hook - this fuction can take a single string  or an array of strings with a name(s) of injectabled factory interceptors.  It can also take an interceptor function.
 - hook.if() => hook - this function can take a name of a property which will confine the interceptors to only get executed on defined function names.  Or a condition function which takes an instance of the currenct invocation object and has to return a boolean.  True will execute the current hook and false will skip all inteceptors in the current hook.



### ToDo
 - [ ] Add validation and create a proper manager for hooks.  Be able to remove and modify current hooks.
 - [ ] Improve support for service and refactor the stack creation/excution.
 - [ ] Address processing promise.  Currently this would have to be done manually, by importing $q, but it would be nice to abstract that away behind the invocation object.
 - [x] Integrate dynamic proxy into controller resolving proxy objective for constructor.  
 - [x] Improve hook processing for hook conditions per individual call



