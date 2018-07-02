 const http = require('http');
 const url = require('url');
 const StringDecoder = require('string_decoder').StringDecoder;
 const fs = require('fs');
 const handlers = require('./lib/handlers');
 const path = require('path');

var server = {};

server.httpServer = http.createServer(function(req,res){
   server.unifiedServer(req,res);
 });



parseJsonToObject = function(str){
  try{
    var obj = JSON.parse(str);
    return obj;
  } catch(e){
    return {};
  }
};

server.unifiedServer = function(req,res){
   var parsedUrl = url.parse(req.url, true);
   var path = parsedUrl.pathname;
   var trimmedPath = path.replace(/^\/+|\/+$/g, '');
   var queryStringObject = parsedUrl.query;
   var method = req.method.toLowerCase();
   var headers = req.headers;
   var decoder = new StringDecoder('utf-8');
   var buffer = '';
   req.on('data', function(data) {
       buffer += decoder.write(data);
   });
   req.on('end', function() {
       buffer += decoder.end();
       var chosenHandler = typeof(server.router[trimmedPath]) !== 'undefined' ? server.router[trimmedPath] : handlers.notFound;
       var data = {
         'trimmedPath' : trimmedPath,
         'queryStringObject' : queryStringObject,
         'method' : method,
         'headers' : headers,
         'payload' :  parseJsonToObject(buffer)
       };
       try{
         chosenHandler(data,function(statusCode,payload,contentType){
           server.processHandlerResponse(res,method,trimmedPath,statusCode,payload,contentType);
         });
       }catch(e){
          console.log(e)
         server.processHandlerResponse(res,method,trimmedPath,500,{'Error' : 'An unknown error has occured'},'json');
       }
   });
 };

 server.processHandlerResponse = function(res,method,trimmedPath,statusCode,payload,contentType){
   contentType = typeof(contentType) == 'string' ? contentType : 'json';
   statusCode = typeof(statusCode) == 'number' ? statusCode : 200;
   if(payload && payload["Authorization"]){
      res.setHeader("Authorization",payload["Authorization"])
      delete payload["Authorization"]
   }
   var payloadString = '';
   res.setHeader('Content-Type', 'application/json');
   payload = typeof(payload) == 'object'? payload : {};
   payloadString = JSON.stringify(payload);
   res.writeHead(statusCode);
   res.end(payloadString);
 };

server.router = {
  'ping' : handlers.ping,
  'wing' : handlers.wing,
  'matches' : handlers.getAllMatches,
  'team_matches' : handlers.getMatchesForTeam,
  'group_results' : handlers.getGroupResults,
  'matches/today' : handlers.getTodayMatch,
  'register' : handlers.createUser,
  'login' : handlers.login
};

server.init = function(){
  server.httpServer.listen(3000,function(){
    console.log('\x1b[36m%s\x1b[0m','The HTTP server is running on port 3000');
  });
};
module.exports = server;
