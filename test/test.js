'use strict';

let expect = require('chai').expect;
let igiya = require('../index');

igiya.initialize("http://apple.dev/ajax/map/search?type=place",{},function (error, response, body) {
    console.log(body);
});
