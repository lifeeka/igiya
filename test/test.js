let chai = require("chai");
let expect = chai.expect;
let assert = chai.assert;
chai.config.includeStack = true;
let igiya = require('../index');

it('should respond with redirect on get', function(done) {

    this.timeout(5000);

        igiya.initialize("http://apple.dev/ajax/map/search?type=place", {}, 'igiya', function (error, response, body) {

            let result = igiya.search('name', null,{
                'is_stop': true,
            });

            expect(result).to.be.an('array');
            console.log(result);
            done();

        });


});


