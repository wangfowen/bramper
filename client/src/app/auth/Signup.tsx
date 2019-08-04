import React, {Component} from 'react';
import { connect } from 'react-redux';
import {Link, RouteComponentProps} from 'react-router-dom';
import { toast } from 'react-toastify';

import {signup} from "./duck/actions";
import {NewUser} from "app/models/user";
import SignupForm from "./SignupForm";
import {ReduxState} from "reducers";
import {AuthState} from "./duck/reducers";
import styles from "./Auth.module.css";

interface StateProps {
  auth: AuthState
}

interface DispatchProps {
  signup: (newUser: NewUser) => void
}

type Props = StateProps & DispatchProps & RouteComponentProps

class Signup extends Component<Props> {
  componentDidMount() {
    if (this.props.auth.currentUser !== null) {
      this.props.history.push("/app")
    }
  }

  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.auth.currentUser !== null) {
      toast.success("Successfully signed up!");
      this.props.history.push("/app")
    }

    if (nextProps.auth.errors.length > 0 && nextProps.auth.errors !== this.props.auth.errors) {
      nextProps.auth.errors.forEach((error) => {
        toast.error(error);
      })
    }
  }

  handleSubmit = (form: NewUser) => {
    this.props.signup(form)
  }

  render() {
    const {auth} = this.props;

    return <div className={styles.form}>
      {auth.isAuthenticating ? <div>Signing up...</div> : null}
      <SignupForm onSubmit={this.handleSubmit} disabled={auth.isAuthenticating || auth.currentUser !== null} />
      <p>Have an account? <Link to={"/login"}>Login</Link></p>
    </div>
  }
}

const mapStateToProps = (state: ReduxState) => {
  return {
    auth: state.auth
  }
};

export default connect(mapStateToProps, {signup})(Signup);
