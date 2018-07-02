/*
 * API Tests
 *
*/

// Dependencies
var app = require('./../index');
var assert = require('assert');
var http = require('http');
const StringDecoder = require('string_decoder').StringDecoder;

//var config = require('./../lib/config');

// Holder for Tests
var api = {};

// Helpers
var helpers = {};
helpers.makeGetRequest = function(path,callback){
  // Configure the request details
  var requestDetails = {
    'protocol' : 'http:',
    'hostname' : 'localhost',
    'port' : 3000,
    'method' : 'GET',
    'path' : path,
    'headers' : {
      'Content-Type' : 'application/json'
    }
  };

  // Send the request
  var req = http.request(requestDetails,function(res){
      callback(res);
  });
  req.end();
};









//req.write(postData);

api['A random path should respond to GET with 404'] = function(done){
  helpers.makeGetRequest('/this/path/shouldnt/exist',function(res){
    assert.equal(res.statusCode,404);
    done();
  });
};


api['getAllMatches should return unauthorized on sending request with no token'] = function(done){
  helpers.makeGetRequest('/matches',function(res){
    assert.equal(res.statusCode,401);
    done();
  });  
};

api['getMatchesForTeam should return unauthorized on sending request with no token'] = function(done){
  helpers.makeGetRequest('/team_matches',function(res){
    assert.equal(res.statusCode,401);
    done();
  });
};


api['getGroupResults should return unauthorized on sending request with no token'] = function(done){
  helpers.makeGetRequest('/group_results',function(res){
    assert.equal(res.statusCode,401);
    done();
  });
};




api['getTodayMatch should return unauthorized on sending request with no token'] = function(done){
  helpers.makeGetRequest('/matches/today',function(res){
    assert.equal(res.statusCode,401);
    done();
  });
};



api['should return '] = function(done){
  helpers.makeGetRequest('/matches/today',function(res){
    assert.equal(res.statusCode,401);
    done();
  });
};



/*

api['getAllMatches should return 200 with data on sending request with valid token'] = function(done){
    helpers.makePostRequest('/matches',function(res){
      assert.equal(res.statusCode,200);
      done()
    })
};

api['getMatchesForTeam should return 200 with data on sending request with valid token'] = function(done){
    helpers.makePostRequest('/team_matches?fifa_code=ISL',function(res){
      assert.equal(res.statusCode,200);
      done()
    })
};

api['getGroupResults should return 200 with data on sending request with valid token'] = function(done){
    helpers.makePostRequest('/group_results?group_id=A',function(res){
      assert.equal(res.statusCode,200);
      done()
    })
};


api['getTodayMatch should return 200 with data on sending request with valid token'] = function(done){
    helpers.makePostRequest('/matches/today',function(res){
      assert.equal(res.statusCode,200);
      done()
    })
};



api['login should return 200 with valid name,password'] = function(done){
    helpers.makePostRequest('/login',function(res){
      assert.equal(res.statusCode,200,{'name':'Kareem','password': '87654321'});
      done()
    })

};
*/








// Export the tests to the runner
module.exports = api;
