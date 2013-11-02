'use strict';

describe('Service: Empty', function () {

  // load the service's module
  beforeEach(module('dynProxy'));

  // instantiate service
  var Empty;
  beforeEach(inject(function (_empty_) {
    Empty = _empty_;
  }));

  it('should do something', function () {
    expect(!!Empty).toBe(true);
  });

});
