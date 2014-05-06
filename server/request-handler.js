/* You should implement your request handler function in this file.
 * And hey! This is already getting passed to http.createServer()
 * in basic-server.js. But it won't work as is.
 * You'll have to figure out a way to export this function from
 * this file and include it in basic-server.js so that it actually works.
 * *Hint* Check out the node module documentation at http://nodejs.org/api/modules.html. */

var results = [];
var msg = {};



exports.handler = function(request, response) {
  /* the 'request' argument comes from nodes http module. It includes info about the
  request - such as what URL the browser is requesting. */

  /* Documentation for both request and response can be found at
   * http://nodemanual.org/0.8.14/nodejs_ref_guide/http.html */

  // console.log("Serving request type " + request.method + " for url " + request.url);
  console.log("Serving request type " + request.method + " for url " + request.url);

  //message storage

  var statusCode = 200;

  /* Without this line, this server wouldn't work. See the note
   * below about CORS. */
  var headers = defaultCorsHeaders;

  headers['Content-Type'] = "text/plain";
  var getUID = function(){
    return 'xxxxxx'.replace(/[x]/g, function(){
      var r = Math.random()*16|0;
      return r.toString(16);
    });
  };
  var writeMessage = function(request, response, callback){
    response.writeHead(200, headers);
    response.end(JSON.stringify("OK"));
  };

  var saveMessage = function(request, response, callback){
    request.on("data", function(data){
      msg = JSON.parse(data.toString());
      msg.createdAt = new Date();
      msg.objectId = getUID();
      results.push(msg);
      console.log(results);
      response.writeHead(200, headers);
      response.end(JSON.stringify(msg));
    });
  };

  var readMessage = function(request, response, callback){
    response.writeHead(200, headers);
    response.end(JSON.stringify({'results':results}));
  };

  var requestHandler = {
    'OPTIONS' : writeMessage,
    'POST': saveMessage,
    'GET': readMessage,
  };

  requestHandler[request.method](request,response);

  // if (request.method === 'OPTIONS'){
  //   statusCode = 200;
  // }else if(request.method === 'POST'){
  //   saveMessage();

  //   // console.log("POST",request);
  //   // request.on("data", function(data){
  //   //   msg = JSON.parse(data.toString());
  //   //   msg.createdAt = new Date();
  //   //   results.push(msg);
  //   //   console.log(results);
  //   // });
  //   // storage.push(data);


  // }else if(request.method === 'GET'){
  //   // console.log("GET",request);
  //   writeMessage();
  // }

  // /* .writeHead() tells our server what HTTP status code to send back */
  // response.writeHead(statusCode, headers);

  // /* Make sure to always call response.end() - Node will not send
  //  * anything back to the client until you do. The string you pass to
  //  * response.end() will be the body of the response - i.e. what shows
  //  * up in the browser.*/
  // response.end("Hello, World!");
};

/* These headers will allow Cross-Origin Resource Sharing (CORS).
 * This CRUCIAL code allows this server to talk to websites that
 * are on different domains. (Your chat client is running from a url
 * like file://your/chat/client/index.html, which is considered a
 * different domain.) */
var defaultCorsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10 // Seconds.
};
