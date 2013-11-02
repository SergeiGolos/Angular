'use strict';

describe('Service: Dynlog', function () {

  // load the service's module
  beforeEach(module('dynProxy'));

  // instantiate service
  var Dynlog;
  beforeEach(inject(function (_dynlog_) {
    Dynlog = _dynlog_;
  }));

  it('should do something', function () {
    expect(!!Dynlog).toBe(true);
  });

});
