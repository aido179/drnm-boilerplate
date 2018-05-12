const verifyJWTToken = require('./jwt.js').verifyJWTToken;
const createJWToken = require('./jwt.js').createJWToken;

var verifyJWT = function(req, res, next){

  let token = (req.method === 'POST') ? req.body.token : req.query.token
  verifyJWTToken(token)
  .then((decodedToken) => {
    req.userID = decodedToken.data
    next()
  })
  .catch((err) => {
    res.status(401)
      .json({message: "Invalid auth token provided."});
  });
}

var login = function(userID, age = 3600){
  return createJWToken({
    sessionData: userID,
    maxAge: age
  })
}

module.exports = {
  verifyJWT:verifyJWT,
  login:login
}
