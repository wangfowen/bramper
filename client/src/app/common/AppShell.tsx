import React from 'react';
import {Route} from "react-router";

import Layout from "./Layout";

const AppShell = ({component: Component, ...rest}) => {
  return (
    <Route {...rest} render={matchProps => (
      <Layout>
        <Component {...matchProps} />
      </Layout>
    )}/>
  )
};

export default AppShell;