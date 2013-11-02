'use strict';

angular.module('AngularProxyApp')
  .controller('MainCtrl', function ($scope, $location, dynamicproxy) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];


    $scope.pathString = $location.path();
	dynamicproxy.RegisterHook('logHook');
    $scope.pathString = dynamicproxy.CreateClassProxy('$location').path();
  });
