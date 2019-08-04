import React, {Component} from 'react';
import { connect } from 'react-redux';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import classNames from 'classnames';

import {logout} from "app/auth/duck/actions";
import {ReduxState} from "reducers";
import {User} from "app/models/user";
import {Link} from "react-router-dom";
import styles from "./Header.module.css";

interface StateProps {
  user: User | null
}

interface DispatchProps {
  logout: () => void
}

class Header extends Component<DispatchProps & StateProps & RouteComponentProps> {
  handleLogout(e) {
    e.preventDefault();
    this.props.logout();
    this.props.history.push('/')
  }

  render() {
    let buttons;
    if (this.props.user !== null) {
      buttons = <div className={styles.right}>
        <Link className={styles.link} to={"/settings"}>Settings</Link>
        <button className={classNames("btn btn-link", styles.link)} onClick={this.handleLogout}>Logout</button>
      </div>
    } else {
      buttons = <div className={styles.right}>
        <Link className={styles.link} to={"/login"}>Sign In</Link>
      </div>
    }

    return <header className={styles.header}>
      <Link className={styles.link} to={"/"}>Home</Link>
      {buttons}
    </header>
  }
}

const mapStateToProps = (state: ReduxState) => {
  return {
    user: state.auth.currentUser
  }
};

export default connect(mapStateToProps, {logout})(withRouter(Header));
