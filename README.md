Angular Proxy (v0.1)
============
Inspired by the Castle Dynamic Proxy project, Angular Proxy enables a visualization layer over your inject-able factory objects.  One way to think about this: multiple directives can change the behavior of a single DOM element, multiple interceptors allow you to change the behavior of your factory object.

# Why do I care?
Separation of concerns.  Take for example a save function a REST API, generally we create some type of wrapper, provider or repository around the actual call to our back end. We need this to create validation and trap server error events.  Something we often call ceremony code.

Instead, we can create a proxy object of the rest call and a group of interceptors that prevent or augment the result of the function.  This also allows to seamlessly add behavior to your application.  A new interceptor factory can be injected on  proxy creation.

# How it works
Proxy object is hidden behind a number of interceptors, any of which can prevent and change behavior of the call before getting to and after resolving the real factory object.

## Interceptor
While creating a empty proxy is not prevented, having 0 interceptors on the proxy defeats the purpose.  So lets start with the interceptor.


    app.factory('logIntercept', [function() {
      return {
        intercept: function (invocation) {
        
          console.log('LogIntercept: ' + invocation.name);
          var result = invocation.process();
          console.log('LogIntercept: ' + result);
              
          return result;
        }
      };
    }]);
  

First thing to notice, since this is all bound to the angular dependency injection system, when creating the factory, your interceptor can have the dependencies it needs.

The factory needs to expose the intercept method, which passes in invocation object.  Here you can write code that reacts to your events both before and after the base object invocation is completed, with the ability to change the responding data at any level of the proxy.

The invocation object currently consist of:
 -  name : Name of the function being invoked.
 - args : Arguments being passed to the proxy function.
 - interceptors : List of interceptors for this invocation.
 - process() : Moves to the next level of the proxy.  The response builds a recursive stack, so to propagate the base response pass along the result of this function in each instance of the intercept function.    
 - invoke(name, args) : Executes the base function, or any function on the base object.

We can now create the our proxy hidden behind a logger:

'''Javascript

     var proxy = dynamicproxy.CreateClassProxy('$location', 'logIntercept');
     proxy.path();

'''

## Hook
Hooks provide fine tuned control over the proxy functions to create on the objects.  Once fully implemented, each call to the proxy object should contextually decided on hook bindings.  Hooks can bind multiple Interceptors and bind to multiple types.

'''Javascript

      app.factory('logHook', function () {    
       return {
         types : ['$location'],
         interceptors : ['logIntercept'],
         condition : function () {
             return true;
         }
       };
      });
  
'''

You can now register the hook to automatically generate the objects with hooked interceptors.

'''Javascript

      dynamicproxy.RegisterHook('logHook');
      var proxy = dynamicproxy.CreateClassProxy('$location');
      proxy.path(); 

'''

# ToDo

 - [ ] Address processing promise.  Currently this would have to be done manually, by importing $q, but it would be nice to abstract that away behind the invocation object.
 - [ ] Integrate dynamic proxy into controller resolving proxy objective for constructor.  
 - [ ] Improve hook processing for hook conditions per individual call



