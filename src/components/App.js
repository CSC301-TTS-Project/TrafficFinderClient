import React from 'react';
import './App.css';
import Map from "../features/map/Map"
import SignIn from "../features/signin/SignIn.js"
import SignUp from "../features/signup/SignUp.js"
import { Route, Switch, BrowserRouter, Redirect } from "react-router-dom";

const TITLE = "TrafficFinder"

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isAuthenticated: false
    }
  }

  loginCallback() {
    this.setState({ isAuthenticated: true })
  }

  logoutCallback() {
    this.setState({isAuthenticated: false})
  }

  componentDidMount() {
    document.title = TITLE;
  }

  render() {
    return (
      <div className="App">
        <BrowserRouter>
          <Switch>
            <Route exact path="/" render={() => { return this.state.isUserAuthenticated ? <Redirect to="/map"/>: <Redirect to="/login"/>}} />
            <Route exact path="/login" component={SignIn}/>
            <Route exact path="/signup" component={SignUp}/>
            <Route exact path="/map" component={Map}/>
            <Route path="*" component={() => { (<h1>Page Not Found</h1>) }} />
          </Switch>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
