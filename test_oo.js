const crypto = require('crypto');


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




token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiS2FyZWVtIn0=.3pcOLIk4IALauNVf9Cdr7yG+resyj0T/dHNRRuNg3N0="

var playload = JSON.parse(   new Buffer(token.split('.')[1],'base64').toString() )  ;
console.log(playload)
	let code = token.split(".")[0] + "." + token.split(".")[1]

	let signature = crypto.createHmac('sha256', 'secret');    
	signature.write(code); // write in to the stream
	signature.end();       // can't read from the stream until you call end()
	signature = signature.read().toString('base64');  
	console.log(signature)
	console.log( token.split('.')[2]  )

	if(signature!= token.split('.')[2]){
		console.log("not matched")

	}
	else{
		console.log("matched")
	}


console.log(issueToken("Kareem"))
