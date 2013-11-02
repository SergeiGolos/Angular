Angular Proxy (v0.1)
============
Inspired by the Castle Dynamic Proxy project, Angular Proxy enables a visualization layer over your inject-able factory objects.  One way to think about this: multiple directives can change the behavior of a single DOM element, multiple interceptors allow you to change the behavior of your factory object.

#Why do I care?
Separation of concerns.  Take for example a save function a REST API, generally we create some type of wrapper, provider or repository around the actual call to our back end. We need this to create validation and trap server error events.  Something we often call ceremony code.

Instead, we can create a proxy object of the rest call and a group of interceptors that prevent or augment the result of the function.  This also allows to seamlessly add behavior to your application.  A new interceptor factory can be injected on  proxy creation.



