const User = require('../models/user.js').User;
//authentication
const createJWToken = require('../auth-server/jwt.js').createJWToken;
const auth = require('../auth-server/middleware.js');

const login = function(username, password){
  return new Promise((resolve, reject)=>{
    User.findOne({username:username}, function(err, user){
      if(err){
        reject({"Error":"DB ERr."});
        return;
      }
      if(user === null){
        reject({"Error":"User not found."});
        return;
      }
      user.comparePassword(password, function(err, match){
        if(err || !match){
          reject({
            "status":"Error",
            "message":"Password mismatch."
          });
          return;
        }
        let token = auth.login(user._id);
        resolve({
          user:user,
          token:token
        });
      })
    });
  });
}

//TODO: implement server side logout (JWT invalidation)
const logout = function(username){
  return new Promise((resolve, reject)=>{
    reject({
      "status":"Error",
      "message":"Logout not implemented"
    });
  });
}

//Create a user
const create = function(userObj){
  return new Promise((resolve, reject)=>{
    var user = new User(userObj);
    user.save(function (err, savedUser) {
       if (err){
         reject({
           "status": "Error",
           "message":"Error creating user",
           "error":err
         });
       }else{
         let token = auth.login(savedUser._id);
         resolve({
           "status":"Success",
           "message":"User created successfully",
           "userID":savedUser._id,
           "token":token
         });
       }
    });
  });
}

const get = function(id){
  return new Promise((resolve, reject)=>{
    User.findOne({_id:id},function(err,data){
      if(err){
        reject({
          "status":"Error",
          "message":"User not found"
        });
      }
      resolve(data);
    });
  });
}

module.exports = {
  login: login,
  logout: logout,
  create: create,
  get: get
}
