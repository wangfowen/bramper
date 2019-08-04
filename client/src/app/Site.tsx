import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

import NotFound from 'NotFound'
import Signup from "./auth/Signup";
import Login from "./auth/Login";
import SettingsPage from "./settings/SettingsPage";
import LandingPage from "./LandingPage";
import AppIndex from "./AppIndex";
import AppShell from "./common/AppShell";

export default class Site extends Component {
  render () {
    return <Router>
      <Switch>
        <Route path='/' exact component={LandingPage} />

        <AppShell path='/login' component={Login} />
        <AppShell path='/signup' component={Signup} />
        <AppShell path='/settings' component={SettingsPage} />

        <AppShell path='/app' component={AppIndex} />

        <Route component={NotFound} />
      </Switch>
    </Router>
  }
}
