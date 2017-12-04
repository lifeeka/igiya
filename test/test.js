let chai = require("chai");
let expect = chai.expect;
let assert = chai.assert;
chai.config.includeStack = true;
let Igiya = require('../index');
let IgiyaClass = new Igiya();


it('should respond with redirect on get', function(done) {

    this.timeout(5000);

    IgiyaClass.initialize("http://apple.dev/ajax/map/search?type=place", {}, 'igiya', function (error, response, body) {

            var result = IgiyaClass.search('name', null,{
                'is_stop': true,
            });

            expect(result).to.be.an('array');
            console.log(result);
            done();

        });


});


