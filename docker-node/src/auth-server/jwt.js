var jwt = require('jsonwebtoken');

//replace hardcoded secret with env variable for production.
//const secret = process.env.JWT_SECRET;
const secret = "super secret";

var verifyJWTToken = function(token){
  return new Promise((resolve, reject) => {
    jwt.verify(token, secret, (err, decodedToken) => {
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
  //ensure a maxAge is set and is a number.
  if (!details.maxAge || typeof details.maxAge !== 'number'){
    details.maxAge = 3600
  }
  //sign the token.
  let token = jwt.sign({
     data: details.sessionData
   }, secret, {
      expiresIn: details.maxAge,
      algorithm: 'HS256'
  })

  return token
}

module.exports = {
  verifyJWTToken:verifyJWTToken,
  createJWToken:createJWToken
}
