var mongoose = require('mongoose');
var User = require('./user');

var assert = require('assert');

/*
Import env variables from pm2 ecosystem.config file
*/
var env = require('../../ecosystem.config.js').apps[0].env;

describe('User controller', function() {
  before(function() {
    // runs before all tests in this block
    //connect to db
    const DB_HOST = env.DB_HOST;
    const DB_USER = env.DB_USER;
    const DB_PASS = env.DB_PASS;
    mongoose.connect("mongodb://"+DB_USER+":"+DB_PASS+"@"+DB_HOST);
    var db = mongoose.connection;
    db.on('error', function(){
      throw new Error("Error connecting to database.");
    });
  });

  describe('#create()', function() {
    /*
    Failures
    */
    it('should reject an empty user.', function(done) {
      //note assert.rejects is not supported in node v8.
      //but it would be nice to use it here.
      User.create({})
      .then(function(data){
        done(new Error("Empty user created."));
      })
      .catch(function(err){
        assert.equal(err.status, "Error");
        assert.equal(err.message, "Error creating user");
        done();
      });
    });
    it('should reject a user without a username.', function(done) {
      User.create({
        username:"",
        password:"test",
        email:"test@test.com"
      })
      .then(function(data){
        done(new Error("User created in error."));
      })
      .catch(function(err){
        assert.equal(err.status, "Error");
        assert.equal(err.message, "Error creating user");
        done();
      });
    });
    it('should reject a user without a password.', function(done) {
      User.create({
        username:"test",
        password:"",
        email:"test@test.com"
      })
      .then(function(data){
        done(new Error("User created in error."));
      })
      .catch(function(err){
        assert.equal(err.status, "Error");
        assert.equal(err.message, "Error creating user");
        done();
      });
    });
    it('should reject a user without a email.', function(done) {
      User.create({
        username:"test",
        password:"test",
        email:""
      })
      .then(function(data){
        done(new Error("User created in error."));
      })
      .catch(function(err){
        assert.equal(err.status, "Error");
        assert.equal(err.message, "Error creating user");
        done();
      });
    });
    /*
    Successes
    */
    it('should resolve with a token when a user is created.', function(done) {
      User.create({
        username:"test",
        password:"test",
        email:"test@test.com"
      })
      .then(function(data){
        assert.equal(data.status, "Success");
        assert.equal(data.message, "User created successfully");
        assert.ok(data.token);
        done();
      })
      .catch(function(err){
        done(new Error(err));
      });
    });
    //TODO:
    // - test user is created successfully
    // - test password is hashed correctly
  });
});

/*

// create a user a new user
var testUser = new User({
    username: jmar777,
    password: Password;
});

// save user to database
testUser.save(function(err) {
    if (err) throw err;

// fetch user and test password verification
User.findOne({ username: 'jmar777' }, function(err, user) {
    if (err) throw err;

    // test a matching password
    user.comparePassword('Password123', function(err, isMatch) {
        if (err) throw err;
        console.log('Password123:', isMatch); // -> Password123: true
    });

    // test a failing password
    user.comparePassword('123Password', function(err, isMatch) {
        if (err) throw err;
        console.log('123Password:', isMatch); // -> 123Password: false
    });
});
*/
