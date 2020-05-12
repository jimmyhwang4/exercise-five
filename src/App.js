import React, { useEffect, useState } from "react";
import { Route, BrowserRouter as Router, Redirect } from "react-router-dom";
import * as firebase from "firebase/app";
import "firebase/auth";
//Pages
import CreateAccount from "./pages/CreateAccount";
import Login from "./pages/Login";
import UserProfile from "./pages/UserProfile";
import Header from "./components/Header";
// Styles
import './App.css';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [userInformation, setUserInformation] = useState({});

  const firebaseConfig = {
    apiKey: "AIzaSyAxhZmP8r_xWt10R8uZEgfxfAsXh7ej4ls",
    authDomain: "exercise-five-de17a.firebaseapp.com",
    databaseURL: "https://exercise-five-de17a.firebaseio.com",
    projectId: "exercise-five-de17a",
    storageBucket: "exercise-five-de17a.appspot.com",
    messagingSenderId: "628039473087",
    appId: "1:628039473087:web:f19d1a0541d218f7e6b30a"
  };

  // Ensure app is initialized when it is ready to be
  useEffect(() => {
    // Ensure app is not initialized more than that once
    // Is firebase already initialized?
    if(!firebase.apps.length) {
      // Initialize firebase
      firebase.initializeApp(firebaseConfig);
    }
    // Setting auth to be persistent in SESSION storage, not cookies
    // You can also use cookies with firebase but we're using session
    firebase
      .auth()
      .setPersistence(firebase.auth.Auth.Persistence.SESSION)
      .catch(function(e) {
        console.log("INSTANTIATING AUTH ERROR", e);
      });
  }, [firebaseConfig]);

  // Check to see if User is logged in
  // User loads page, checks their status
  // Set state accordingly
  useEffect(() => {
    firebase.auth().onAuthStateChanged(function(user) {
      if(user) {
        // Logged in
        setUserInformation(user);
        setLoggedIn(true);
      } else {
        // Not logged in
        setUserInformation({});
        setLoggedIn(false);
      }
    });
  }, []);

  // Login
  function LoginFunction(e) {
    e.preventDefault();
      let email = e.currentTarget.loginEmail.value;
      let password = e.currentTarget.loginPassword.value;

    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(function(response) {
        console.log("LOGIN RESPONSE", response);
        setLoggedIn(true);
      })
      .catch(function(error) {
        console.log("LOG ERROR", error);
      });
  }

  // Logout
  function LogoutFunction() {
    firebase
      .auth()
      .signOut()
      .then(function() {
        setLoggedIn(false);
      })
      .catch(function(error) {
        console.log("LOGOUT ERROR", error);
      });
  }

  // Create Account
  function CreateAccountFunction(e) {
    e.preventDefault();
    let email = e.currentTarget.createEmail.value;
    let password = e.currentTarget.createPassword.value;

    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(function(response) {
        console.log("VALID ACCOUNT CREATE", response);
        setLoggedIn(true);
      })
      .catch(function(e) {
        console.log("CREATE ACCOUNT ERROR", e);
      });
  }

  return (
    <div className="App">
      <Header LogoutFunction={LogoutFunction} isLoggedIn={loggedIn} />
      <Router>
        <Route exact path="/">
          {!loggedIn ? (
            <Redirect to="/login" />
          ) : (
            <UserProfile userInformation={userInformation} />
          )}
        </Route>
        <Route exact path="/login">
          {!loggedIn ? (
            <Login LoginFunction={LoginFunction} /> 
          ) : ( 
            <Redirect to="/" />
          )}
        </Route>
        <Route exact path="/create-account">
          {!loggedIn ? (
            <CreateAccount CreateAccountFunction={CreateAccountFunction} />
          ) : (
            <Redirect to="/" />
          )}
        </Route>
      </Router>
    </div>
  );
}

export default App;
