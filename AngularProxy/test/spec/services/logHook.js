'use strict';

describe('Service: Loghook', function () {

  // load the service's module
  beforeEach(module('dynProxy'));

  // instantiate service
  var Loghook;
  beforeEach(inject(function (_logHook_) {
    Loghook = _logHook_;
  }));

  it('should do something', function () {
    expect(!!Loghook).toBe(true);
  });

});
