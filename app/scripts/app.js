'use strict';

var app = angular.module('AngularProxyApp', ['dynProxy', 'ngRoute' ]);

  app.config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  })

  app.run(function (proxyhook) {
    proxyhook.register(function (hook) {
        return hook.for('$location').with('logIntercept');
    });

    proxyhook.register(function (hook) {
        return hook.for('$injector').with('callIntercept');
    });
  });  