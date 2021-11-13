import './App.css';
import 'semantic-ui-css/semantic.min.css';
import React from 'react';
import { BrowserRouter as Router, Switch, Route} from "react-router-dom";
import Login from './componenets/Login'
import AuthSpotify from './componenets/AuthSpotify'
import HomePage from './componenets/HomePage';
import AccountSettings from './componenets/AccountSettings';
import SpotifySuccess from './componenets/Spotify/SpotifySuccess';

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route exact path="/">
            <Login/>
          </Route>
          <Route exact path="/spotify">
            <AuthSpotify/>
          </Route>
          <Route exact path ='/spotify/success'>
            <SpotifySuccess/>
          </Route>
          <Route exact path="/account">
            <AccountSettings/>
          </Route>
          <Route exact path="/HomePage">
            <HomePage/>
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;