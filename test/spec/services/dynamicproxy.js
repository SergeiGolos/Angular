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

  it("it has a create function exposed.", function() {    
    expect(Dynamicproxy.create).not.toBe(null);
    expect(typeof(Dynamicproxy.create)).toBe("function");
  });

  it("creates a proxy object when create is called", function() {   
    var proxy = Dynamicproxy.create('$http');
    expect(typeof(proxy)).toBe("object");
    expect(typeof(proxy.post)).toBe("function");
  });

  it("proxy object is loaded with interceptor",function(){
    
    var size = dynlog.length();    
    Dynamicproxy.create('$location', 'logIntercept').path()
    expect(dynlog.length() - size).toBe(2);
  });

});
