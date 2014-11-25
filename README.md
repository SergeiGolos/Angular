## AtScript Playground: Angular 1.3 & Annotation 

This is POC Playground project for using AtScript with angular 1.3.  In addition
there is an implementation of a helper annotation lib which enables automated
angular binding to annotated classes.


### Initial setup

```bash
# Clone the repo...
git clone https://github.com/vojtajina/atscript-playground.git
cd atscript-playground

# Then, you need to install all the dependencies...
npm install

# If you want to be able to use global commands `karma` and `gulp`...
npm install -g karma-cli gulp
```

### What are all the pieces involved?

#### [Traceur]
Transpiles AtScript code into regular ES5 (today's JavaScript) so that it can be run in a current browser.

#### [RequireJS]
Traceur is configured to transpile AtScript modules into AMD syntax and we use RequireJS to load the code in the browser.

#### [Assert] library
When `typeAssertions: true` option is used, Traceur generates run-time type assertions such as `assert.type(x, Object)`. The assert library does the actual run-time check. Of course, you can use your own assert library.

The idea with type assertions is that you only use them during the development/testing and when deploying, you use `typeAssertions: false`.

#### [Karma]
Test runner that runs the tests in specified browsers, every time that you change a file.

#### [Gulp]
Task runner to make defining and running the tasks simpler.

[AtScript]: http://atscript.org
[Traceur]: https://github.com/google/traceur-compiler
[RequireJS]: http://requirejs.org
[Assert]: https://github.com/angular/assert
[Karma]: http://karma-runner.github.io/
[Gulp]: http://gulpjs.com