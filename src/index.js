var promise_request = require("clientside-request");
promise_request.request = function(options){return this.then((request)=>{ return request(options)}) }


var Api = function(requested_host){
    if(typeof requested_host == "undefined") throw new Error("host is not defined");
    this.host = this.normalize_host(requested_host);

}

Api.prototype = {
    /*
        meta methods
    */
    normalize_host : function(requested_host){
        /*
            normalize protocol - relative paths do not exist in our context so assume that if no protocol was defined this is http
        */
        var valid_protocol_not_defined = requested_host.indexOf("http://") !== 0 && requested_host.indexOf("https://") !== 0;
        if(valid_protocol_not_defined) requested_host = "http://" + requested_host; // if not http or https, default to http

        /*
            extract formal protocol, hostname, and port and build host string
        */
        var a = document.createElement('a');
        a.href = requested_host; // defaults to host of page called from
        var protocol = a.protocol;
        var hostname = a.hostname;
        var port = (a.port)? ":"+a.port : ""; // default to empty string
        var host = protocol + "//" + hostname + port + "/"; // protocol, hostname, and port from url provided

        /*
            return host string
        */
        return host;
    },

    /*
        functionality
    */

    post : function(route, data, bool_json){
        if(typeof bool_json == "undefined") bool_json = false; // default to false
        return promise_request.request({
                method : "POST",
                uri : this.convert_route_to_uri(route),
                json : bool_json,
                data : data,
            }).catch(this.basic_error_handler)
    },

    get : function(route, data){
        console.log(promise_request);
        return promise_request.request({
                method : "GET",
                uri : this.convert_route_to_uri(route),
                data : data,
            }).catch(this.basic_error_handler)
    },

    /*
        helpers
    */
    basic_error_handler : function(error){
        console.log("error was returned!");
        if(error.type == "NO_RESPONSE"){
            alert("Server response not received. Are you sure you're connected to the internet?");
            throw ({type : "CONNECTION"}); // pass the error down further after alerting user
        } else if(error.type == "UNK"){
            alert("An unknown error has occured. Please reload the page or contact us for help!");
            throw ({type : "CONNECTION"}); // pass the error down further after alerting user
        } else {
            throw error; // 4** error, simply pass it along
        }
    },
    convert_route_to_uri : function(route){
        if(route[0] == "/") route = route.substring(1);
        var uri = this.host + route;;
        return uri;
    },
}

module.exports = Api;
