/// <reference path="../reference.js" />
(function (angular) {
    'use strict';
    var app = angular.module('Contracts', []);

    app.factory('toString', [
        function() {
            return function(arg) {
                return {}.toString.call(arg);
            }
        }
    ]);    

    app.factory('isType', [
        'toString',
        function(toString) {
            return function(type) {
                return function(arg) {
                    if (toString(arg) === '[object ' + type + ']') {
                        return arg;
                    }
                    throw ('Exptected ' + type);
                };
            };
        }
    ]);      
})(angular);