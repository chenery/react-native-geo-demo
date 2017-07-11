import React, {Component} from 'react';
import { Button, View } from 'react-native';
import {LocationStore} from '../Repository/Firebase';
import {online, initOffline, initMoveOnline} from '../Redux/actions';
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

// TODO is there a nicer way of doing this per component?
function mapStateToProps(state) {
  const { isOnline, user } = state.loginReducer

  return {
    isOnline,
    user
  }
}

export default connect(mapStateToProps)(Location)
