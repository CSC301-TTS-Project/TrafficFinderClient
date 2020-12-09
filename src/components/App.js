import React from 'react';
import './App.css';
import Map from "../features/map/Map"
import SignIn from "../features/signin/SignIn.js"
import { Route, Switch, BrowserRouter } from "react-router-dom";

const TITLE = "TrafficFinder"

class App extends React.Component {

  componentDidMount() {
    document.title = TITLE;
  }

  render() {
    return (
      <div className="App">
        <BrowserRouter>
         <Switch>
           <Route exact path="/signin" component={SignIn}/>
           <Route path="/map" component={Map}/>
         </Switch>
        </BrowserRouter>
      </div>
  );
  }
}

export default App;
