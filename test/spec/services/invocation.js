'use strict';

describe('Service: Invocation', function () {

  // load the service's module
  beforeEach(module('dynProxy'));

  // instantiate service
  var Invocation;
  beforeEach(inject(function (_invocation_) {
    Invocation = _invocation_;
  }));

  it('should do something', function () {
    expect(!!Invocation).toBe(true);
  });

});
