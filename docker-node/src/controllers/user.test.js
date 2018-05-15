var mongoose = require('mongoose');
var User = require('./user');
const UserModel = require('../models/user.js').User;

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
    //clear database
    UserModel.remove({});
  });
  after(function(){
    process.exit(0);
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
    it('should resolve with a token and id when a user is created.', function(done) {
      User.create({
        username:"test",
        password:"test",
        email:"test@test.com"
      })
      .then(function(data){
        assert.equal(data.status, "Success");
        assert.equal(data.message, "User created successfully");
        assert.ok(data.userID);
        assert.ok(data.token);
        done();
      })
      .catch(function(err){
        done(new Error(err));
      });
    });

    it('should add the user the database.', function(done) {
      UserModel.findOne({username:"test"}).then(function(data){

        assert.equal(data.username,"test");
        assert.equal(data.email,"test@test.com");
        done();
      }).catch(function(err){
        done(new Error(err));
      });
    });

    it('should not store the password directly.', function(done) {
      UserModel.findOne({username:"test"}).then(function(data){
        assert.notEqual(data.password,"test");
        done();
      }).catch(function(err){
        done(new Error(err));
      });
    });
  });

  describe('#login()', function() {
    before(function(done){
      //start with a clean slate and one test user.
      UserModel.remove({});
      User.create({
        username:"test_username",
        password:"test_password",
        email:"test_email@test.com"
      })
      .then(function(data){
        done();
      })
      .catch(function(err){
        done(new Error(err));
      });
    });
    it('should reject if username and passwords are not valid.', function(done) {
      User.login("test_username", "test_invalid_password")
      .then(function(data){
        done(new Error("User logged in in error."));
      })
      .catch(function(err){
        assert.equal(err.status, "Error");
        assert.equal(err.message, "Password mismatch.");
        done();
      });
    });
    it('should resolve with a user and token if username and passwords are valid.', function(done) {
      User.login("test_username", "test_password")
      .then(function(data){
        assert.equal(data.user.username, "test_username");
        assert.ok(data.token);
        done();
      })
      .catch(function(err){
        done(new Error("User log in failed."));
      });
    });
  });

  describe('#logout()', function() {
    it('should reject (NOT IMPLEMENTED)', function(done) {
      User.logout()
      .then(function(data){
        done(new Error("Logout should reject until implemented."));
      })
      .catch(function(err){
        assert.equal(err.status, "Error");
        assert.equal(err.message, "Logout not implemented");
        done();
      });
    });
  });
  describe('#get(id)', function() {
    var userID;
    before(function(done){
      //start with a clean slate and one test user.
      UserModel.remove({});
      User.create({
        username:"test_username",
        password:"test_password",
        email:"test_email@test.com"
      })
      .then(function(data){
        userID = data.userID;
        done();
      })
      .catch(function(err){
        done(new Error(err));
      });
    });
    it('should reject if user is not found.', function(done) {
      User.get("not_a_real_id")
      .then(function(data){
        done(new Error("fake ID worked."));
      })
      .catch(function(err){
        assert.equal(err.status, "Error");
        assert.equal(err.message, "User not found");
        done();
      });
    });
    it('should return the user with _id "id".', function(done) {
      User.get(userID)
      .then(function(data){
        assert.equal(data.username,"test_username");
        assert.equal(data.email,"test_email@test.com");
        assert.notEqual(data.password, "test_password");
        assert.equal(data._id.toString(),userID.toString());
        done();
      })
      .catch(function(err){
        done(new Error(err));
      });
    });
  });
});
