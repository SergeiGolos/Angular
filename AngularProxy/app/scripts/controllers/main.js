'use strict';

angular.module('AngularProxyApp')
  .controller('MainCtrl', function ($scope, $location) {    
    $scope.pathString = $location.path();
  });
