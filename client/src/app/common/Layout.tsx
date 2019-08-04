import React, {Component} from 'react';
import Header from "./Header";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import styles from "./Layout.module.css";

class Layout extends Component {
  render() {
    return <div>
      <Header />
      <main className={styles.main}>
        {this.props.children}
      </main>
      <ToastContainer />
    </div>
  }
}

export default Layout;
