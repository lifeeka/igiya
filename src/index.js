let _store = require('store');
let axios = require('axios');

let _filter = require('lodash/filter');
let _matches = require('lodash/matches');

class Igiya {


    static merge(main_data, data_merge, data_merge_element) {

        let data = main_data;


        for (let e = 0; e < data_merge.length; e++) {

            let is_found = false;
            for (let i = 0; i < main_data.length; i++) {
                if (main_data[i][data_merge_element] === data_merge[e][data_merge_element]) {
                    is_found = true;
                }
            }
            if (!is_found) {
                data.push(data_merge[e]);
            }
        }

        return data;
    }

    initialize(url, param = [], store_name = 'igiya', refetch_limit = 10, refetch_keyword = 'q', data_merge_element = 'id', callback = function () {
    }) {


        this.url = url;
        this.param = url;
        this.store_name = store_name;

        //refetch
        this.refetch_limit = refetch_limit;
        this.refetch_keyword = refetch_keyword;
        this.data_merge_element = data_merge_element;

        this.list_refetch_keyword = [];


        let self = this;
        this.data = _store.get(self[store_name]);


        if (this.data !== undefined) {
            callback(false, true, []);
            return true;
        }


        this.fetch(function (error, body) {
            callback(error, self.data);
        });

    }

    fetch(callback = function () {
    }, keyword = false) {

        let self = this;
        let data = {};

        if (this.busy) {
            callback(null, self.data);
            return self.data;
        }

        if (self.list_refetch_keyword.includes(keyword)) {
            callback(null, self.data);
            return self.data;
        }

        if (keyword) {
            self.list_refetch_keyword.push(keyword);
            data[self.refetch_keyword] = keyword;
        }



        self.busy = true;


        const request = axios.get(self.url, {params: data});

        return request.then(response => {
                self.busy = false;

                try {
                    if (self.data !== undefined) {
                        self.data = Igiya.merge(self.data, response.data, self.data_merge_element);
                    }
                    else
                        self.data = response.data;


                    _store.set(self.store_name, self.data);
                    callback(false, self.data);
                }
                catch (e) {
                    callback(e.message, self.data);
                }
            },
            (error) => {
                callback(true, error.response);
            });


    }

    search(callback, attribute, keyword, matches = false, refetch = true) {

        let self = this;
        let filter_list = _store.get(self.store_name);

        if (matches)
            filter_list = _filter(filter_list, _matches(matches));

        if (keyword) {
            filter_list = _filter(filter_list, function (data_array) {
                return data_array[attribute].toUpperCase().includes(keyword.toUpperCase());
            });
        }

        if (filter_list.length < this.refetch_limit && refetch) {//if there are less suggestion refetch the server

            self.fetch(function (error, body) {
                console.log(body);

                self.search(function (result) {
                    callback(result);
                }, attribute, keyword, matches, false);

            }, keyword)
        }
        else {
            callback(filter_list);
        }

    }

}


module.exports = Igiya;