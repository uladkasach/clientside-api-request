var promise_request = require("clientside-request");
promise_request.request = function(options){return this.then((request)=>{ return request(options)}) }


var Api = function(requested_host, default_options){
    if(typeof requested_host == "undefined") throw new Error("host is not defined");
    this.host = this.normalize_host(requested_host);
    this.default_options = (default_options)?default_options:{}; // enable selection of default options - if null then let defaults be empty object
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
            validate that host is still valid
        */
        if(!hostname){
            var error = new Error("hostname not defined for requested_host given to clientside-request-api (" + requested_host +")")
            error.reason = "hostname";
            throw error;
        }
        if(!protocol){
            var error = new Error("protocol not defined for requested_host given to clientside-request-api (" + requested_host +")")
            error.reason = "protocol";
            throw error;
        }

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

        // define options specific to this request
        var request_specific_options = {
            method : "POST",
            uri : this.convert_route_to_uri(route),
            json : bool_json,
            data : data,
        }

        // merge default and specific options
        var options = Object.assign({}, this.default_options, request_specific_options);  // overwrite defaults with request specifics

        // submit request
        return promise_request.request(options)
    },
    get : function(route, data){
        // define options specific to this request
        var request_specific_options = {
            method : "GET",
            uri : this.convert_route_to_uri(route),
            data : data,
        }

        // merge default and specific options
        var options = Object.assign({}, this.default_options, request_specific_options);  // overwrite defaults with request specifics

        // submit request
        return promise_request.request(options)
    },

    /*
        helpers
    */
    convert_route_to_uri : function(route){
        if(route[0] == "/") route = route.substring(1);
        var uri = this.host + route;;
        return uri;
    },
}

module.exports = Api;
