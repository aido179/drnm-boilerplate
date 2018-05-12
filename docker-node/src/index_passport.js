const express = require('express')
const app = express()
const os = require('os')
const path = require('path');
const cors = require('cors');

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var session = require("express-session");
const MongoStore = require('connect-mongo')(session);
var bodyParser = require("body-parser");
const mongoose = require('mongoose');

const Kitten = require('./schemas/kitten.js').Kitten;
const User = require('./schemas/user.js').User;


mongoose.connect('mongodb://root:example@localhost');
var db = mongoose.connection;
db.on('error', function(){
  console.error.bind(console, 'connection error:')
  process.exit(1);
});
db.once('open', function() {
  // we're connected!
  console.log("Successfully connected to db.")
});
app.use(cors({
  credentials:true,
  origin: 'http://localhost:5000',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}));

app.use(session({
  store: new MongoStore({ mongooseConnection: mongoose.connection }),
  secret: "cats",
  resave: true,
  saveUninitialized: true,
  cookie: {
    maxAge: 60000,
    secure: false
  }
}));
app.use(bodyParser.json());

app.use(passport.initialize());
app.use(passport.session());

//configure passport authentication for username/password
passport.use(new LocalStrategy(
  function(username, password, done) {
    console.log("authenticating");
    User.findOne({ username: username }, function (err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (!user.validPassword(password)) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      console.log("user found");
      return done(null, user);
    });
  }
));
passport.serializeUser(function(user, done) {
  console.log("serializing user:",user);
  done(null, user._id);
});
passport.deserializeUser(function(userId, done) {

  console.log("deserializing user:",userId);
  User.findOne({_id:userId}, function(err, data){
      if(err){
        console.log(err);
        return;
      }
      console.log("deserializing user:",data);
      done(null, data);
    });
});

// Custom Middleware to check the user is logged in.
function loggedIn(req, res, next) {
  console.log("checking login",req.user);
  console.log("session:",req.session);
  req.session.save(function(err) {
    if(err) console.log(err);
    // session saved
  });
    if (req.user) {
        next();
    } else {
        res.redirect('/');
    }
}



//user authentication
app.post('/login',
  //passport.authenticate('local', { failureRedirect: '/', session:true }),
  function(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
      if (err) { return next(err); }
      if (!user) { return res.redirect('/'); }
      req.logIn(user, function(err) {
        if (err) { return next(err); }
        return res.json({"Success":"logged in"});
      });
    })(req, res, next);
  });
  //user authentication
app.post('/logout', function(req, res) {
  req.logout();
  res.status(200).json({"Success":"Logged out."});
});

app.post('/secrets', loggedIn,
  function(req, res){
    console.log("/secrets",req.session);
    res.json({
      secrets:"incredibly amazing"
    });
  });

app.post('/user', function(req, res){
  //console.log("[POST] /user", req.body)
  var user = new User(req.body);
  //TODO validate user against schema
  //TODO hash password
  user.save(function (err, silence) {
     if (err){
       res.status(400).json({"Error creating user":err});
     } else{
       res.status(200).json(user);
     }
  });
});


app.get('/test', function(req, res){
  var silence = new Kitten({ name: 'Silence' });
  silence.save(function (err, silence) {
     if (err){
       res.send(err);
     } else{
       res.send("server says hello.");
     }

  });
  //res.send("server says hello.");
});

app.get('/kittens', function(req, res){

  Kitten.find({}, function(err, data){
      if(err){
        console.log(err);
        return;
      }
      let output = {"kittens":[]};
      data.forEach(function(kitten){
        output.kittens.push(kitten);
      });
      res.json(output);
    });
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
