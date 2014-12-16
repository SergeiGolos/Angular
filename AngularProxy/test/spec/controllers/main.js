'use strict';

describe('Controller: MainCtrl', function () {

  // load the controller's module
  beforeEach(module('AngularProxyApp'));

  var MainCtrl,
    scope,
    _location;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, $location) {
    scope = $rootScope.$new();
    _location = $location;
    MainCtrl = $controller('MainCtrl', {
      $scope: scope      
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.pathString).toBe(_location.path());
  });
});
