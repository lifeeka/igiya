<p align="center"><img src="https://raw.githubusercontent.com/lifeeka/igiya/master/src/image/logo.png"></p>

[![npm version](https://badge.fury.io/js/igiya.svg)](https://badge.fury.io/js/igiya)

## Igiya
igiya is a suggestion engine that use local storage. igiya is flexible and lightweight.

## Installation

    npm install igiya

## Example

	var Igiya = require('igiya');
	IgiyaInstance = new Igiya();
	
    //initialize igiya when page load
    IgiyaInstance.initialize("http://example.come/data.json");
	
	//trigger search	
	$(document).on("keyup", ".seach", function (e) {//using jquery
		 IgiyaInstance.search(function (data) {
			 console.log(data);
		 }, 'column_name', $(this).val());
	 });  

### json example
json array must be  nested

        [
		    {
		    "id": "217",
		    "value": null,
		    "lat": "44.016521",
		    "lng": "21.005859",
		    "name": "Serbia",
		    "description": null,
		    "type": "Place",
		    "is_stop": false,
		    "stop_type": true
		    },
		    {
		    "id": "221",
		    "value": null,
		    "lat": "-4.6728013",
		    "lng": "55.5185991",
		    "name": "Seychelles",
		    "description": null,
		    "type": "Place",
		    "is_stop": false,
		    "stop_type": true
		    },
	    ]

## API

### initialize

    initialize(url, param = [], store_name = 'igiya', refetch_limit = 10, refetch_keyword = 'q', data_merge_element = 'id', callback)

 - **url:** `string` Json url
 - **param:** `object` url parameters ex: [type:'animals']
 - **store_name:**`string` local storage variable name
 - **refetch_limit:** `integer` when to refetch, (for example if *`refetch_limit`* is 10 and search result came with less than 10 result igiya will refetch from the server) 
 - **refetch_keyword:** `string` refetch name  (if you have put `q`  for `refetch_keyword` request be like `http://example.come/data.json?q=sometext`
 - **data_merge_element:**`string` after re fetched igiya will recheck with `data_merge_element`with local storage and re fetched data and merge.
 - **callback:**`function` callback function
 - 
### search
 

    search(callback, attribute, keyword, matches = false, refetch = true)

 - **callback:** `function` callback function 
 -  **attribute:** `string` search column name
 -  **keyword:** `string` keyword to search
 -  **matches:** `array` should match exact word in json array
 - **refetch:**  `boolean` should refetch or not

## Contributing
Thank for using (or visiting :D) igiya. This is my first open source package and I really really need contributions and I'm really appreciate it.
