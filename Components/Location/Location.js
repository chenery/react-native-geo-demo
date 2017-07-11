import React, { Component } from 'react';
import { Button, View } from 'react-native';
import { LocationStore } from '../../Services/Firebase';
import { initOffline, initMoveOnline } from '../../Redux/Actions/loginActions';
import { connect } from 'react-redux';

class Location extends Component {
  constructor(props) {
    super(props);

    this.handleOnline = this.handleOnline.bind(this);
    this.handleOffline = this.handleOffline.bind(this);
  }

  handleOnline() {
    this.props.dispatch(initMoveOnline(this.props.user.id));
  }

  handleOffline() {
    this.props.dispatch(initOffline(this.props.user.id));
  }

  render() {
    const isOnline = this.props.isOnline;
    let button = null;

    if (isOnline) {
      button = <Button onPress={this.handleOffline} title="Hide your location from other users"/>;
    } else {
      button = <Button onPress={this.handleOnline}title="Show your location to other users"/>;
    }

    return (
      <View>{button}</View>
    )
  }
}

function mapStateToProps(state) {
  const { isOnline, user } = state.loginReducer

  return {
    isOnline,
    user
  }
}

export default connect(mapStateToProps)(Location)
