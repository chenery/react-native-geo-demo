import React, { Component } from 'react';
import { Text, View } from 'react-native';
import { connect } from 'react-redux';
import {initFirebaseLogin, facebookLogin, initLogout, initOffline} from '../Redux/actions';
import Login from '../Login/Login';
import Location from '../Location/Location';
import OnlineUsers from "../Users/OnlineUsers"
import {FirebaseAuth} from '../Repository/Firebase';
import {LocationStore} from '../Repository/Firebase';
import Loading from '../Generic/Loading';

class AppPanel extends Component {

  constructor(props) {
    super(props);

    this.componentDidMount = this.componentDidMount.bind(this);
    this.onLogin = this.onLogin.bind(this);
    this.onLogout = this.onLogout.bind(this);
    this.offLine = this.offLine.bind(this);
  }

  componentDidMount() {
    console.log('AppPanel did mount');
    this.props.dispatch(initFirebaseLogin());
  }

  onLogin() {
    this.props.dispatch(facebookLogin());
  }

  onLogout() {
    this.props.dispatch(initLogout(this.props.user.id));
  }

  offLine(userId) {
    this.props.dispatch(initOffline(this.props.user.id));
  }

  render() {

    const isLoading = this.props.isLoading;
    if (isLoading) {
      return (<Loading />);
    }

    const isLoggedIn = this.props.isLoggedIn;
    const isOnline = this.props.isLoggedIn && this.props.isOnline;
    const user = this.props.user;
    const name = this.props.user ? this.props.user.name : "Unknown";
    const userLocationPin = this.props.userLocationPin;

    let locationComponent = null;
    if (isLoggedIn) {
      locationComponent = <Location userId={user.id} isOnline={isOnline} offLine={this.offLine} />
    } else {
      locationComponent = <Text>No location set</Text>
    }

    return (
      <View>
        <Login name={name} isLoggedIn={isLoggedIn} onLogin={this.onLogin} onLogout={this.onLogout}/>
        <View>{locationComponent}</View>
        {isOnline && <OnlineUsers userLocationPin={userLocationPin} />}
      </View>
    );
  }
}

function mapStateToProps(state) {
  const { isLoading, isLoggedIn, isOnline, user, userLocationPin } = state.userReducer

  return {
    isLoading,
    isLoggedIn,
    isOnline,
    user,
    userLocationPin
  }
}

export default connect(mapStateToProps)(AppPanel)
