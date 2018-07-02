const server = require('./server');
const http = require('http');
const StringDecoder = require('string_decoder').StringDecoder;

var app = {};


real_time_init = function(){
  bf=''
  setInterval(function(){ 
      console.log('updating')
      var requestDetails = {
        'protocol' : 'http:',
        'hostname' : 'worldcup.sfg.io',
        'method' : 'GET',
        'path' : '/matches/today',
        'timeout' : 9* 1000
      };
      var req = http.request(requestDetails,function(res){
        //console.log(res.headers)
        res.setEncoding('utf8');
        var decoder = new StringDecoder('utf-8');
        var buffer = '';

        res.on('data', (chunk) => {
          buffer += decoder.write(chunk);
          console.log('wait')
        });
        res.on('end', () => {
          buffer += decoder.end();
          //console.log('No more data in response.');
          if(bf != buffer){
            console.log('data changed!');
            bf = buffer;
          }
          else{
            console.log('nothing changed')
          }
        });
      });
      req.end();
   }, 10*1000);

}

app.init = function(){
  server.init();
  //real_time_init()

};

app.init();

module.exports = app;
