'use strict';

angular.module('AngularProxyApp')
  .controller('MainCtrl', function ($scope, $location, dynamicproxy) {
    $scope.pathString = $location.path();
	  dynamicproxy.register('logHook');
    $scope.pathString = dynamicproxy.create('$location').path();
  });
