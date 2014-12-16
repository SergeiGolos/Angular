'use strict';

describe('Service: Logintercept', function () {

  // load the service's module
  beforeEach(module('dynProxy'));

  // instantiate service
  var Logintercept;
  beforeEach(inject(function (_logIntercept_) {
    Logintercept = _logIntercept_;
  }));

  it('should do something', function () {
    expect(!!Logintercept).toBe(true);
  });

});
