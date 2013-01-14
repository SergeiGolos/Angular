(function() {									
	Object.prototype.keys = function ()
	{
	  var keys = [];
	  for(var i in this) if (this.hasOwnProperty(i))
	  {
	    keys.push(i);
	  }
	  return keys;
	}

	describe('Routing Event Unit Testing', function() {
	  beforeEach(module('RoutingEvents'));	 
	 
	 	describe('RoutingProvider: provides access to the angularjs default RoutingProvider', function(){
	    	var rp;
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

		describe('reRouteStack: provides access to the event stack object', function(){
	    	var rs, rp;
		    beforeEach(inject(function(reRouteStack, routeProvider) {
		      rs = reRouteStack;
		      rp = routeProvider;
		    }));

		    it('should be available to DI, resulting in a not null', function() {		    		    		
		    	expect(rs).toBeTruthy();		    	
		    });			

		    it('should be created with an empty list', function() {		    		    						
		    	expect(rs.List().keys().length).toEqual(0);
			});

			it('when a route is pushed, the handler needs to register', function() {		    		    		
				var route = '/home';						    	
		    	rs.Push(route, function() {});
		    			    	
		    	expect(rs.List()[route]).toBeTruthy();		    	
		    	expect(rs.List().keys().length).toEqual(1);
		    	expect(rs.List()[route].keys().length).toEqual(1);

		    	expect(rp).toBeTruthy();
		    });
		    
		    it('should push multiple events on the same route', function() {		    		    		
				var route = '/home';						    	
		    	rs.Push(route, function() {});
		    	rs.Push(route, function() {});
		    			    	
		    	expect(rs.List()[route]).toBeTruthy();		    	
		    	expect(rs.List().keys().length).toEqual(1);
		    	expect(rs.List()[route].keys().length).toEqual(2);
		    });
		    
		    it('should push multiple routes', function() {		    		    		
				var route = '/home',
					route2 = '/home2';						    	
		    	rs.Push(route, function() {});
		    	rs.Push(route2, function() {});
		    			    	
		    	expect(rs.List().keys().length).toEqual(2);

		    	expect(rs.List()[route]).toBeTruthy();		    			    	
		    	expect(rs.List()[route].keys().length).toEqual(1);
		    	
		    	expect(rs.List()[route2]).toBeTruthy();		    			    	
		    	expect(rs.List()[route2].keys().length).toEqual(1);
		    });
		});
	});
	 

}());