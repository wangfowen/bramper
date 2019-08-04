import React, {Component} from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { toast } from 'react-toastify';

import {authenticate} from "./duck/actions";
import {NewUser} from "app/models/user";
import LoginForm from './LoginForm';
import {ReduxState} from "reducers";
import {AuthState} from "./duck/reducers";
import styles from "./Auth.module.css";

interface StateProps {
  auth: AuthState
}

interface DispatchProps {
  authenticate: (newUser: NewUser) => void
}

type Props = StateProps & DispatchProps & RouteComponentProps

class Login extends Component<Props> {
  componentDidMount() {
    if (this.props.auth.currentUser !== null) {
      this.props.history.push("/")
    }
  }

  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.auth.currentUser !== null) {
      toast.success("Successfully signed in!");
      this.props.history.push("/")
    }

    if (nextProps.auth.errors.length > 0 && nextProps.auth.errors !== this.props.auth.errors) {
      nextProps.auth.errors.forEach((error) => {
        toast.error(error)
      })
    }
  }

  handleSubmit = (form: NewUser) => {
    this.props.authenticate(form)
  }

  render() {
    const {auth} = this.props;

    return <div className={styles.form}>
      {auth.isAuthenticating ? <div>Logging in...</div> : null}
      <LoginForm onSubmit={this.handleSubmit} disabled={auth.isAuthenticating || auth.currentUser !== null} />
      <p>Don't have an account? <Link to={"/signup"}>Sign up</Link></p>
    </div>
  }
}

const mapStateToProps = (state: ReduxState) => {
  return {
    auth: state.auth
  }
};

export default connect(mapStateToProps, {authenticate})(Login);
