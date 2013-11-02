'use strict';

describe('Service: Dynamicproxy', function () {

  // load the service's module
  beforeEach(module('dynProxy'));

  // instantiate service
  var Dynamicproxy, dynlog;
  beforeEach(inject(function (_dynamicproxy_, _dynlog_){
      
      Dynamicproxy = _dynamicproxy_;      
      dynlog = _dynlog_;
  }));

  it('should exist', function () {
    expect(!!Dynamicproxy).toBe(true);
  });

  it("it has a CreateClassProxy function exposed.", function() {    
    expect(Dynamicproxy.CreateClassProxy).not.toBe(null);
    expect(typeof(Dynamicproxy.CreateClassProxy)).toBe("function");
  });

  it("creates a proxy object when CreateClassProxy is called", function() {   
    var proxy = Dynamicproxy.CreateClassProxy('$http');
    expect(typeof(proxy)).toBe("object");
    expect(typeof(proxy.post)).toBe("function");
  });

  it("proxy object is loaded with interceptor",function(){
    
    var size = dynlog.length();    
    Dynamicproxy.CreateClassProxy('$location', 'logIntercept').path()
    expect(dynlog.length() - size).toBe(2);
  });

});
