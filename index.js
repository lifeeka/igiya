let store = require('store');
let request = require('request');

class Igiya {

    constructor() {

    }
    initialize(url,param = [], callback = function () {}) {

        this.url = url;
        this.param = url;

        let self = this;

        request
            .get(self.url, function(error, response, body) {
                store.set(Igiya,body);
                callback(error, response, body);
            });
    }

}


module.exports = new Igiya();