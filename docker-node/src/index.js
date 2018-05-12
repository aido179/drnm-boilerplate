const express = require('express')
const app = express()
const os = require('os')
const path = require('path');
const cors = require('cors');
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser')
//db imports
const mongoose = require('mongoose');
//controller imports
const User = require('./controllers/user.js');
//authentication
const auth = require('./auth-server/middleware.js');

//console.log("dbhost:",process.env.DB_HOST);
//setup db connection
mongoose.connect("mongodb://root:example@"+process.env.DB_HOST);
var db = mongoose.connection;
db.on('error', function(){
  console.error.bind(console, 'connection error:')
  process.exit(1);
});
db.once('open', function() {
  // we're connected!
  console.log("Successfully connected to db.")
});


//configure middleware
app.use(cors());
app.use(cookieParser());
app.use(bodyParser.json());


//user authentication
app.post('/login', function(req, res, next) {
  User.login(req.body.username, req.body.password)
  .then(function(data){
    res.status(200).json(data);
  })
  .catch(function(err){
    res.status(401).json(err);
  });
});

//user logout
app.post('/logout', function(req, res) {
  User.logout(req.body.username)
  .then(function(data){
    res.status(200).json(data);
  })
  .catch(function(err){
    res.status(400).json(err);
  });
});

app.post('/secrets', auth.verifyJWT, function(req, res){
  res.json({
    secrets:"incredibly amazing"
  });
});

app.post('/user', function(req, res){
  User.create(req.body)
  .then(function(data){
    res.status(200).json(data);
  })
  .catch(function(err){
    res.status(400).json(err);
  });
});

app.get('/user', auth.verifyJWT, function(req,res){
  User.get(req.userID)
  .then(function(data){
    res.status(200).json(data);
  })
  .catch(function(err){
    res.status(400).json(err);
  });
})

app.get('/test', auth.verifyJWT, function(req, res){
  res.json({"Success":"/Test"});
});


app.get('/', function(req, res){
  res.json({"Error":"AUTHENTICATION FAILED"});
});

app.listen(3000, () => console.log('Example app listening on port 3000!'))

//enable graceful shutdown
process.on('SIGINT', function() {
   /*db.stop(function(err) {
     process.exit(err ? 1 : 0);
   });*/
   process.exit(0);
});
