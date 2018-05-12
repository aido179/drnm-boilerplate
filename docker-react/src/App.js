import React, { Component } from 'react';
import logo from './logo.svg';
import { AuthClient } from './auth-client/auth-client.js';
import './App.css';

const auth = new AuthClient("http://127.0.0.1:3000");

class App extends Component {
  constructor(){
    super();
    this.state={
      uname:"",
      psw:"",
      email:"",
      user:false
    }
  }
  componentWillMount(){
    //Get the logged in user account.
    auth.get('/user')
    .then((response)=>{
      this.setState({
        "user":response.data
      }, function(){
        console.log(this.state)
      });
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  handleUsername=(event)=>{
    return this.setState({
      "uname":event.target.value
    });
  }
  handleEmail=(event)=>{
    return this.setState({
      "email":event.target.value
    });
  }
  handlePassword=(event)=>{
    return this.setState({
      "psw":event.target.value
    });
  }
  submitLogin = (e)=>{
    e.preventDefault();
    this.login();
  }
  login = ()=>{
    auth.login('/login', this.state.uname, this.state.psw)
    .then((data)=>{
      this.setState({
        "user":data.user
      });
    })
    .catch(function (error) {
      console.log(error);
      alert("Login failed.");
    });
  }

  logout = ()=>{
    auth.logout()
    .then((data)=>{
      this.setState({"user":false});
      console.log("logout result:",data);
    })
    .catch(function (error) {
      console.log(error);
    });
  }
  submitCreateUser = (e)=>{
    e.preventDefault();
    this.createUser();
  }
  createUser = ()=>{
    console.log("creating user...");
    auth.post("/user", {
      "username": this.state.uname,
      "password": this.state.psw,
      "email":this.state.email
    }, false)
    .then((response)=>{
      if(response.data.status === "Success"){
        console.log("Logging in...");
        this.login();
      }
    })
    .catch(function (error) {
      console.log(error);
      alert("Error creating user.");
    });
  }
  testSecrets = ()=>{
    auth.post("/secrets", {
      "show me secrets":"please"
    })
    .then(function (response) {
      console.log(response);
      alert(JSON.stringify(response.data));
    })
    .catch(function (error) {
      console.log(error);
      alert(error);
    });
  }
  render() {
    let content = undefined;
    //console.log("rendering...",this.state.user);
    if(this.state.user){
      content = (
        <div className="container">
          <div className="col">
            <h2>Hi there, {this.state.user.username}!</h2>
            <p>You are now logged in.</p>
            <p>
              The test button below will send a test message to the server.
              It should only work if you are logged in. Click the button below to log out.
            </p>
            <button type="button" onClick={this.logout}>logout</button>
          </div>
        </div>
      );
    }else{
      content = (
        <div className="container">
          <div className="col">
            <h2>Login</h2>
            <form onSubmit={this.submitLogin}>
              <label htmlFor="uname">Username</label>
              <input type="text" placeholder="Enter Username" value={this.state.uname} onChange={this.handleUsername} name="uname" required></input>
              <label htmlFor="psw">Password</label>
              <input type="password" placeholder="Enter Password" value={this.state.psw} onChange={this.handlePassword} name="psw" required></input>
              <input type="submit" className="hidden"/>
            </form>
            <button type="submit" onClick={this.login}>Login</button>
          </div>
          <div className="col">
            <h2>New User</h2>
            <form onSubmit={this.submitCreateUser}>
              <label htmlFor="uname">Username</label>
              <input type="text" placeholder="Enter Username" value={this.state.uname} onChange={this.handleUsername} name="uname" required></input>
              <label htmlFor="email">Email</label>
              <input type="email" placeholder="Enter Email" value={this.state.email} onChange={this.handleEmail} name="email" required></input>
              <label htmlFor="psw">Password</label>
              <input type="password" placeholder="Enter Password" value={this.state.psw} onChange={this.handlePassword} name="psw" required></input>
              <input type="submit" className="hidden"/>
            </form>
            <button type="submit" onClick={this.createUser}>Create</button>
          </div>
        </div>
      );
    }
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Boilerplate App</h1>
        </header>
        {content}
        <hr></hr>
        <button type="button" onClick={this.testSecrets}>test</button>
      </div>
    );
  }
}

export default App;
