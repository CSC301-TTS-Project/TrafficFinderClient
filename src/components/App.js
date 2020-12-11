import React, { useEffect, useState } from 'react';
import './App.css';
import Map from "../features/map/Map"
import SignIn from "../features/signin/SignIn.js"
import SignUp from "../features/signup/SignUp.js"
import { Route, Switch, BrowserRouter, Redirect } from "react-router-dom";

const TITLE = "TrafficFinder"

function App() {

  const [isUserAuth, setUserAuth] = useState(false)

  const loginCallback = () => {
    console.log("callback")
    setUserAuth(true)
  }

  const logoutCallback = () => {
    setUserAuth(false)
  }

  useEffect(() => {
    document.title = TITLE;
  }, [])

  return (
    <div className="App">
      <BrowserRouter>
        <Switch>
          <Route exact path="/" render={() => { return isUserAuth ? <Redirect to="/map" /> : <Redirect to="/login" /> }} />
          <Route exact path="/login"><SignIn loginCallbackFn={loginCallback} /></Route>
          <Route exact path="/signup"><SignUp loginCallbackFn={loginCallback} /></Route>
          <Route exact path="/map" component={Map} />
          <Route path="*" component={() => { (<h1>Page Not Found</h1>) }} />
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
