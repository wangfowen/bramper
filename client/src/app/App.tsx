import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

import NotFound from '../NotFound'
import Signup from "./auth/Signup";
import Login from "./auth/Login";
import Layout from "./common/Layout";
import SettingsPage from "./settings/SettingsPage";

export default class App extends Component {
  render () {
    return <Router>
      <Layout>
        <Switch>
          <Route path='/' exact component={Login} />
          <Route path='/login' exact component={Login} />
          <Route path='/signup' exact component={Signup} />
          <Route path='/settings' exact component={SettingsPage} />
          <Route component={NotFound} />
        </Switch>
      </Layout>
    </Router>
  }
}
