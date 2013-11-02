describe("DynamicProxy module", function() {
  var dynamicProxy;

  beforeEach(module('dynProxy'));
  beforeEach(inject(function(_DynamicProxy_){
      
      dynamicProxy = _DynamicProxy_;      
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
		expect(dynamicProxy.CreateClassProxy('Empty', 'LogIntercept').self()).toBe(undefined);

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
});