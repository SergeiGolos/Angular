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
    expect(typeof(Dynamicproxy.CreateClassProxy('empty'))).toBe("object");
  });

  it("proxy object is loaded",function(){
    expect(Dynamicproxy.CreateClassProxy('empty').self()).toBe(undefined);
  });

  it("proxy object is loaded with interceptor",function(){
    
    var size = dynlog.length();    
    Dynamicproxy.CreateClassProxy('empty', 'logIntercept').self()
    expect(dynlog.length() - size).toBe(2);
  });
});
