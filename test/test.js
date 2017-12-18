let chai = require("chai");
let expect = chai.expect;
let assert = chai.assert;
chai.config.includeStack = true;
let Igiya = require('../src/index');
let IgiyaClass = new Igiya();


it('should respond with redirect on get', function(done) {

    this.timeout(5000);

    IgiyaClass.initialize("http://apple.d/ajax/map/search/place", {}, 'igiya', 10, 'q', 'id', function (error, response) {
          IgiyaClass.search(function (result) {


              expect(result).to.be.an('array');
              console.log(result);
              done();

            },'name', "Male");




        });


});


