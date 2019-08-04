import React, {Component} from 'react';
import { connect } from 'react-redux';
import {RouteComponentProps} from "react-router";
import {toast} from "react-toastify";

import {ReduxState} from "reducers";
import {Settings} from "app/models/settings";
import SettingsForm from "./SettingsForm";
import {updateSettings, fetchSettings} from "./duck/actions";
import {User} from "app/models/user";

interface StateProps {
  user: User | null
  settings: Settings | null
}

interface DispatchProps {
  updateSettings: (user: User, settings: Settings) => Promise<boolean>
  fetchSettings: () => void
}

type Props = StateProps & DispatchProps & RouteComponentProps

class SettingsPage extends Component<Props> {
  componentDidMount() {
    this.fetchSettings(this.props.user)
  }

  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.user !== null && this.props.user === null) {
      this.fetchSettings(nextProps.user)
    }
  }

  fetchSettings(user: User | null) {
    if (user !== null) {
      this.props.fetchSettings();
    }
  }

  async updateSettings(settings) {
    if (this.props.user !== null) {
      const success = await this.props.updateSettings(this.props.user, settings);
      if (success) {
        toast.success("Successfully updated settings");
      } else {
        toast.error("Error with updating settings, please try again");
      }
    }
  }

  render() {
    if (this.props.user === null) {
      return <div>Please sign in to edit settings</div>
    } else {
      return <SettingsForm onSubmit={this.updateSettings.bind(this)} initialValues={this.props.settings} />
    }
  }
}

const mapStateToProps = (state: ReduxState) => {
  return {
    user: state.auth.currentUser,
    settings: state.settings
  };
};

export default connect(mapStateToProps, {updateSettings, fetchSettings})(SettingsPage);
