var jwt = require('jsonwebtoken');

//set jwt secret + max_age from env variables if set.
const SECRET = process.env.JWT_SECRET || "somesecretphrase";
const MAX_AGE = process.env.JWT_MAX_AGE || 3600;


var verifyJWTToken = function(token){
  return new Promise((resolve, reject) => {
    jwt.verify(token, SECRET, (err, decodedToken) => {
      if (err || !decodedToken){
        return reject(err)
      }
      resolve(decodedToken)
    });
  });
}

var createJWToken = function(details){
  //check details is an object
  if (typeof details !== 'object'){
    details = {}
  }
  //sign the token.
  let token = jwt.sign({
     data: details.sessionData
   }, SECRET, {
      expiresIn: MAX_AGE,
      algorithm: 'HS256'
  })

  return token
}

module.exports = {
  verifyJWTToken:verifyJWTToken,
  createJWToken:createJWToken
}
