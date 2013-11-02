describe("DynamicProxy module", function() {
  var dynamicProxy, dpLog;

  beforeEach(module('dynProxy'));
  beforeEach(inject(function(_DynamicProxy_, _dpLog_){
      
      dynamicProxy = _DynamicProxy_;      
      dpLog = _dpLog_;
  }));

  afterEach(function(){
  	dynamicProxy = null;
  });

  it("can be created.", function() {    
    expect(dynamicProxy).not.toBe(null);
  });

  it("it has a CreateClassProxy function exposed.", function() {    
    expect(dynamicProxy.CreateClassProxy).not.toBe(null);
    expect(typeof(dynamicProxy.CreateClassProxy)).toBe("function");
  });

  it("creates a proxy object when CreateClassProxy is called", function() {		


		expect(typeof(dynamicProxy.CreateClassProxy('Empty'))).toBe("object");
  });

  it("proxy object is loaded",function(){
		expect(dynamicProxy.CreateClassProxy('Empty').self()).toBe(undefined);

  });

  it("proxy object is loaded with interceptor",function(){
		var size = dpLog.length();    
    dynamicProxy.CreateClassProxy('Empty', 'LogIntercept').self()
    expect(dpLog.length() - size).toBe(2);

  });
  
});


describe("app module", function() {
  var dynamicProxy;

  beforeEach(module('app'));
  beforeEach(inject(function(_DynamicProxy_){
      
      dynamicProxy = _DynamicProxy_;      
  }));

  it("can create dynamicProxy.", function() {    
    expect(dynamicProxy).not.toBe(undefined)
    expect(dynamicProxy).not.toBe(null);
  });

  it("proxy object is loaded with interceptor",function(){
   
    var proxy = dynamicProxy.CreateClassProxy('Empty', 'LogIntercept', 'ModifyIntercept','LogIntercept');
    expect(proxy.self()).toBe(undefined);
    expect(proxy.value()).toBe(2);
   

  });
  /*it("",function(){

    
  });
  it("",function(){

    
  });
  it("",function(){

    
  });
  it("",function(){

    
  });
  it("",function(){

    
  });
  it("",function(){

    
  });*/

});