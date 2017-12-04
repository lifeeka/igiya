var  store = require('store');
var  request = require('request');
var  _ = require('lodash/core');

class Igiya {


    initialize(url, param = [], store_name = 'igiya', callback = function () {
    }) {

        this.url = url;
        this.param = url;
        this.store_name = store_name;

        var  self = this;
        this.data = store.get(self.store_name);

        if (this.data) {
            callback(false, true, []);
            return true;
        }

        request
            .get(self.url, function (error, response, body) {

                self.data = JSON.parse(body);

                self.initialized = true;
                store.set(self.store_name, self.data);
                callback(error, response, self.data);
                return true;
            });
    }

    search(attribute, keyword , matches = false) {

        var  self = this;
        var  data = store.get(self.store_name);

        var  filter_list = data;

         if(matches)
            filter_list = _.filter(filter_list, _.matches(matches));

         if(keyword) {
             filter_list = _.filter(filter_list, function (data_array) {
                 return data_array[attribute].toUpperCase().includes(keyword.toUpperCase());
             });
         }

        return filter_list;

    }

}


module.exports = Igiya;