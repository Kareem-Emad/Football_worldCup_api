const _data = require('./data');
const _url = require('url');
const util = require('util');
const crypto = require('crypto');
const http = require('http');
const StringDecoder = require('string_decoder').StringDecoder;

var handlers = {};



handlers.getAllMatches = function(data,callback){

  var token = data.headers['authorization']
  if(token)
    token = token.split(" ")[1]

  var name = ''
  var sd = data.queryStringObject.start_date ? data.queryStringObject.start_date  : null
  var ed = data.queryStringObject.end_date ? data.queryStringObject.end_date : null
  console.log("heeer")
  console.log(data.payload)
  if(!validateToken(token)){
    callback(401,{})
    return
  }
  gam(callback,sd,ed)
};

gam = function(callback,sd,ed){
  console.log(sd)
  console.log(ed)

  var requestDetails = {
    'protocol' : 'http:',
    'hostname' : 'worldcup.sfg.io',
    'method' : 'GET',
    'path' :  sd && ed ? ('/matches'+'?start_date='+sd+'&end_date='+ed) : ('/matches'),
    'timeout' : 100* 1000
  };
  var req = http.request(requestDetails,function(res){
    //console.log(res.headers)
    res.setEncoding('utf8');
    var decoder = new StringDecoder('utf-8');
    var buffer = '';

    res.on('data', (chunk) => {
      buffer += decoder.write(chunk);
      console.log('wait')
      //console.log(`BODY: ${chunk}`);
    });
    res.on('end', () => {
      buffer += decoder.end();
      tmp = JSON.parse(buffer)
      out = new Array(tmp.length )
      console.log(tmp.length)
      
      for (var i = tmp.length - 1; i >= 0; i--) {
        out[i]={}
        out[i]['away_team_statistics'] = tmp[i]['away_team_statistics']
        out[i]['home_team_statistics'] = tmp[i]['home_team_statistics']
      }
      

      callback(200,out);
      //console.log(typeof(buffer))
      console.log('No more data in response.');
    });
  });
  req.end();

}

///matches/country?fifa_code=ISL
handlers.getMatchesForTeam = function(data,callback){


  var token = data.headers['authorization']
  if(token)
    token = token.split(" ")[1]
  

  var name = data.payload.name
  var fc = data.queryStringObject.fifa_code

  if(!validateToken(token)){
    callback(401,{})
    return
  }
  gmt(callback,fc)

};

gmt = function(callback,data){
  console.log(data)
  var requestDetails = {
    'protocol' : 'http:',
    'hostname' : 'worldcup.sfg.io',
    'method' : 'GET',
    'path' : '/matches/country?fifa_code='+data,
    'timeout' : 100* 1000
  };
  var req = http.request(requestDetails,function(res){
    //console.log(res.headers)
    res.setEncoding('utf8');
    var decoder = new StringDecoder('utf-8');
    var buffer = '';

    res.on('data', (chunk) => {
      buffer += decoder.write(chunk);
      //console.log('wait')
      //console.log(`BODY: ${chunk}`);
    });
    res.on('end', () => {
      buffer += decoder.end();
      try{
        pbf = JSON.parse(buffer)
        callback(200, pbf);
      }
      catch(err){
        callback(400,{"error":"invalid query"})
      }
      //console.log(typeof(buffer))
      console.log('No more data in response.');
    });
  });
  req.end();
}

// teams/group_results
handlers.getGroupResults = function(data,callback){


  var token = data.headers['authorization']
  if(token)
    token = token.split(" ")[1]
  

  var name = data.payload.name
  var fc = data.queryStringObject.group_id

  if(!validateToken(token)){
    callback(401,{})
    return
  }
  ggr(callback,fc)

};


ggr = function(callback,fc){
  var requestDetails = {
    'protocol' : 'http:',
    'hostname' : 'worldcup.sfg.io',
    'method' : 'GET',
    'path' : '/teams/group_results?group_id='+ fc,
    'timeout' : 100* 1000
  };
  var req = http.request(requestDetails,function(res){
    //console.log(res.headers)

    res.setEncoding('utf8');
    var decoder = new StringDecoder('utf-8');
    var buffer = '';

    res.on('data', (chunk) => {
      buffer += decoder.write(chunk);
      //console.log('wait')
      //console.log(`BODY: ${chunk}`);
    });
    res.on('end', () => {
      buffer += decoder.end();
      callback(200,JSON.parse(buffer));
      //console.log(typeof(buffer))
      console.log('No more data in response.');
    });
  });
  req.end();

}


/// matches/today/
handlers.getTodayMatch = function(data,callback){

  var token = data.headers['authorization']
  if(token)
    token = token.split(" ")[1]
  
  var name = data.payload.name


  if(!validateToken(token)){
    callback(401,{})
    return
  }
  gtm(callback)


};


gtm = function(callback){
  var requestDetails = {
    'protocol' : 'http:',
    'hostname' : 'worldcup.sfg.io',
    'method' : 'GET',
    'path' : '/matches/today',
    'timeout' : 100* 1000
  };
  var req = http.request(requestDetails,function(res){
    //console.log(res.headers)
    res.setEncoding('utf8');
    var decoder = new StringDecoder('utf-8');
    var buffer = '';

    res.on('data', (chunk) => {
      buffer += decoder.write(chunk);
      //console.log('wait')
      //console.log(`BODY: ${chunk}`);
    });
    res.on('end', () => {
      buffer += decoder.end();
      callback(200,JSON.parse(buffer));
      //console.log(typeof(buffer))
      console.log('No more data in response.');
    });
  });
  req.end();

}


//matches?start_date=2018-06-19&end_date=2018-06-21

handlers.createUser = function(data,callback){
  var name = typeof(data.payload.name) == 'string' && data.payload.name.trim().length > 0 ? data.payload.name.trim() : false;
  var password = typeof(data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;

  if(name && password){

    var hashedPassword =  hash(password) 
    var hashedName = hash(name)

    _data.read('users',name,function(err,data){

      if(err){     
        if(hashedPassword){
          token = issueToken(name)

          var userObject = {
            'name' : hashedName,
            'hashedPassword' : hashedPassword
          };          
          _data.create('users',hashedName,userObject,function(err){
            if(!err){

              callback(200,{'Authorization':"Bearer " + token});
            } else {
              callback(500,{'Error' : 'Could not create the new user'});
            }
          });
        } else {
          callback(500,{'Error' : 'Could not hash the user\'s password.'});
        }
      } else {
        // User alread exists
        callback(400,{'Error' : 'A user with that name already exists'});
      }
    });
  } else {
    callback(400,{'Error' : 'Missing required fields'});
  }
}



handlers.login = function(data,callback){

  var name = typeof(data.payload.name) == 'string' && data.payload.name.trim().length > 0 ? data.payload.name.trim() : false;
  var password = typeof(data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;
  
  if(name && password){ 
    var hashedPassword =  hash(password) 
    var hashedName = hash(name)

    _data.read('users',hashedName,function(err,data){
      if(!err && data && data.hashedPassword == hash(password) ){
        data.token = issueToken(name)
        rd = {}
        rd["Authorization"] = "Bearer "+data.token
        callback(200,rd);
      } else {
        callback(401);
      }
    });

  } else {
    callback(401,{'Error' : 'Missing required field'})
  }
};

issueToken = function(str){


  let header = new Buffer(JSON.stringify({"alg": "HS256","typ": "JWT"})).toString("base64")
  let payload = new Buffer(JSON.stringify({"name": str})).toString("base64")
  console.log(header, payload)
  let code = header + "." + payload

  let signature = crypto.createHmac('sha256', 'secret');    
  signature.write(code); // write in to the stream
  signature.end();       // can't read from the stream until you call end()
  signature = signature.read().toString('base64');  
  return code + "." + signature;
    

}

validateToken = function(token){
  if(!token)
    return false
  let code = token.split(".")[0] + "." + token.split(".")[1]

  let signature = crypto.createHmac('sha256', 'secret');    
  signature.write(code); // write in to the stream
  signature.end();       // can't read from the stream until you call end()
  signature = signature.read().toString('base64');  

  if(signature!= token.split('.')[2]){
    console.log("not matched")
    return false
  }
  else{
    console.log("matched")
    return true
  }
}



hash = function(str){
  if(typeof(str) == 'string' && str.length > 0){
    var hash = crypto.createHmac('sha256', "Secret Awi!").update(str).digest('hex');
    return hash;
  } else {
    return false;
  }
}




 // Ping
 handlers.wing = function(data,callback){
  callback(200,{ 'hi':'welcome' });
};

 // Ping
 handlers.ping = function(data,callback){
     callback(200);
 };

 handlers.notFound = function(data,callback){
  callback(404)
 }

module.exports = handlers;




