import React, {Component} from 'react';
import {Link} from "react-router-dom";
import {RouteComponentProps} from "react-router";
import {connect} from "react-redux";

import {User} from "./models/user";
import {ReduxState} from "reducers";

interface StateProps {
  user: User | null
}

type Props = StateProps & RouteComponentProps

class LandingPage extends Component<Props> {
  componentDidMount() {
    if (this.props.user !== null) {
      this.props.history.push("/app")
    }
  }

  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.user !== null) {
      this.props.history.push("/app")
    }
  }

  render() {
    return <div>
      <header>
        <Link to={"/login"}>Sign In</Link>
      </header>
      <h1>Landing Page</h1>
      <div>Info about the app</div>
      <Link to="/login" className="btn btn-primary">Get started</Link>
    </div>
  }
}

const mapStateToProps = (state: ReduxState) => {
  return {
    user: state.auth.currentUser
  }
};

export default connect(mapStateToProps, {})(LandingPage);
