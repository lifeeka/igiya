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
                    data[i] = data_merge[e];
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
    }, forced = true, nestedAttribute = false, removeOld = false) {

        this.url = url;
        this.param = param;
        this.store_name = store_name;
        this.nestedAttribute = nestedAttribute;

        //refetch
        this.refetch_limit = refetch_limit;
        this.refetch_keyword = refetch_keyword;
        this.data_merge_element = data_merge_element;

        this.list_refetch_keyword = [];
        this.removeOld = removeOld;

        //remove existing data
        if (this.removeOld) {
            _store.set(this.store_name, []);
            this.data = [];
        } else
            this.data = _store.get(this.store_name);

        if (this.data && this.data !== undefined && this.data.length > 0 && !forced) {
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
        let data = this.param;

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

        const request = axios.get(self.url, this.param);

        return request.then(response => {
                self.busy = false;

                try {

                    let responseData = self.nestedAttribute ? responseData[self.nestedAttribute] : response.data;

                    if (self.data !== undefined)
                        self.data = Igiya.merge(self.data, responseData, self.data_merge_element);
                    else
                        self.data = responseData;


                    _store.set(self.store_name, self.data);
                    callback(false, self.data);
                } catch (e) {
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

        if (keyword && !Array.isArray(keyword)) {

            keyword = keyword.split(' ');

            filter_list = _filter(filter_list, function (data_array) {
                if (Array.isArray(attribute)) {//if column multiple
                    let found = false;
                    attribute.forEach(function (attr) {
                        if (data_array[attr] !== undefined) {
                            keyword.forEach(function (keywordItem) {
                                if (data_array[attr].toUpperCase().includes(keywordItem.toUpperCase())) found = true;
                            });
                        }
                    });
                    return found;

                } else {
                    let found = false;
                    if (data_array[attribute] !== undefined) {
                        keyword.forEach(function (keywardItem) {
                            if (data_array[attribute].toUpperCase().includes(keywardItem.toUpperCase())) found = true;
                        });
                        return found;
                    }
                }
            });
        }

        if (filter_list && filter_list.length < this.refetch_limit && refetch) {//if there are less suggestion refetch the server

            self.fetch(function (error, body) {
                self.search(function (result) {
                    callback(result);
                }, attribute, keyword, matches, false);

            }, keyword)
        } else {
            callback(filter_list);
        }

    }

}


module.exports = Igiya;
