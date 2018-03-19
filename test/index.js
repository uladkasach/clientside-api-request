var assert = require("assert");


/*
    setup browser env variables for clientside require
*/
var jsdom = require("jsdom");
var xmlhttprequest = require("xmlhttprequest");
global.window = new jsdom.JSDOM(``,{
    url: "file:///",
    resources: "usable", // load iframes and other resources
    runScripts : "dangerously", // enable loading of scripts - dangerously is fine since we are running code we wrote.
}).window;
window.XMLHttpRequest = xmlhttprequest.XMLHttpRequest; // append XMLHttpRequest to window

/*
    define clientside_require
*/
var clientside_require = require("clientside-require");


/*
    test
*/
describe('basic', function(){
    it("should load", async function(){
        var Api = await clientside_require.asynchronous_require("/var/www/git/More/clientside-api-request/src/index.js");
        assert.equal(typeof Api, "function", "api should be a function");
    })
})
