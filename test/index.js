var assert = require("assert");


// unhandled promisses add details:
process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at: Promise. reason:', reason);
  // application specific logging, throwing an error, or other logic here
});


/*
    setup browser env variables for clientside require
*/
var jsdom = require("jsdom");
var xmlhttprequest = require("xmlhttprequest");
global.window = new jsdom.JSDOM(``,{
    url: "http://test-env.clientside-api-request.localhost",
    resources: "usable", // load iframes and other resources
    runScripts : "dangerously", // enable loading of scripts - dangerously is fine since we are running code we wrote.
}).window;

/*
    define clientside_require
*/
var clientside_require = require("clientside-require");

/*
    define testing vars
*/
var api_path = "/index.js"

/*
    test
*/
describe('syntax', function(){
    it('should load clientside-request', async function(){
        var clientside_request = await clientside_require.asynchronous_require("clientside-request");
        assert.equal(typeof clientside_request, "function", "request should be a function");
    })
    it("should load", async function(){
        var Api = await clientside_require.asynchronous_require(api_path);
        assert.equal(typeof Api, "function", "api should be a function");
    })
})

describe('host_validation', function(){
    it('should find valid host for public domain', async function(){
        var Api = await clientside_require.asynchronous_require(api_path);
        var host = Api.prototype.normalize_host("google.com");
        assert.equal(host, "http://google.com/")
    })
    it('should find valid host for localhost domain', async function(){
        var Api = await clientside_require.asynchronous_require(api_path);
        var host = Api.prototype.normalize_host("localhost:3000");
        assert.equal(host, "http://localhost:3000/")
    })
    it('should throw error for invalid hostname',  async function(){
        var Api = await clientside_require.asynchronous_require(api_path);
        try {
            var host = Api.prototype.normalize_host("http://:3000/");
            throw new Error("should not reach here");
        } catch (error){
            assert.equal(error.reason, "hostname");
        }
    })
})
describe('initialization', function(){
    it('should initialize with valid host', async function(){
        var Api = await clientside_require.asynchronous_require(api_path);
        var test_api = new Api("localhost:3000");
    })
    it('should throw error if host is not defined', async function(){
        var Api = await clientside_require.asynchronous_require(api_path);
        try {
            var test_api = new Api();
            throw new Error("we should never reach here");
        } catch (error){
            assert.equal(error.message, "host is not defined")
        }
    })
    it('should record defaults if they are passed', async function(){
        var Api = await clientside_require.asynchronous_require(api_path);
        var default_options = {cookies:true};
        var test_api = new Api("localhost:3000", default_options);
        assert.equal(test_api.default_options, default_options);
    })
})
describe('requests', function(){
    it('should be able to send get request', async function(){
        var Api = await clientside_require.asynchronous_require(api_path);
        var test_api = new Api("localhost:3000", {cookies:true});
        var response = await test_api.get("/say_hello");
        assert.equal(response, "Hello!");
    })
    it('should be able to send post request', async function(){
        var Api = await clientside_require.asynchronous_require(api_path);
        var test_api = new Api("localhost:3000", {cookies:true});
        var response = await test_api.post("/post_data", {test:true});
    })
})
