(function() {									
	describe('Routing Event Unit Testing', function() {
	  beforeEach(module('RoutingEvents'));	 
	 
	 	describe('RoutingProvider', function(){
	    	var scope, ctrl, rp;
		    beforeEach(inject(function(routeProvider) {
		      rp = routeProvider;
		    }));

		    it('should create an injectable routeProvider which is not null', function() {		    		    		
		    	expect(rp).toBeTruthy();
		    });

		     it('should have a when function', function() {
		       expect(typeof(rp.when)).toEqual('function');
		    });

  		    it('should have a otherwise function', function() {
		       expect(typeof(rp.otherwise)).toEqual('function');
		    });
		});
	});
	 

}());