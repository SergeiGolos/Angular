/// <reference path="../../Scripts/angular.js" />
/// <reference path="../../Scripts/angular-mocks.js" />
/// <reference path="../src/app.js" />

(function () {
    'use strict';
    
    describe('Contracts Exists', function() {
        var isType, toString;

        beforeEach(module('Contracts'));
        beforeEach(inject(function(_isType_, _toString_) {
                isType = _isType_;
                toString = _toString_;
        }));

        it('verfies angular can bootstrap the applciation', function () {
            expect(true).toBe(true);
        });

        describe('isType', function() {

            it('verifies isType is defined', function() {
                expect(isType).toBeDefined();
            });
          
            describe('string', function() {              

                it('isType can verify string', function() {
                    var value = "test";
                    var isString = isType('String');
                    expect(isString(value)).toBe(value);
                });

                it('isType can verify not string', function() {
                    var value = 0;
                    var isString = isType('String');
                    expect(function() { isString(value); }).toThrow("Exptected String");
                });
            });
            describe('number', function () {

                it('isType can verify int', function () {
                    var value = 0;
                    var isString = isType('Number');
                    expect(isString(value)).toBe(value);
                });

                it('isType can verify not int', function () {
                    var value = "test";
                    var isString = isType('Number');
                    expect(function () { isString(value); }).toThrow("Exptected Number");
                });
            });
            describe('function', function () {

                it('isType can verify function', function () {
                    var value = function () { return this; };
                    var isString = isType('Function');
                    expect(isString(value)).toBe(value);
                });

                it('isType can verify not string', function () {
                    var value = "test";
                    var isString = isType('Function');
                    expect(function () { isString(value); }).toThrow("Exptected Function");
                });
            });

        });

        describe('toString', function() {
            it('verifies toString is defined', function() {
                expect(toString).toBeDefined();
            });

            it('verfies to string results in number', function() {
                expect(toString(2)).toBe('[object Number]');
            });
        });
    });
})();