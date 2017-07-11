import React, { Component } from 'react';
import { Text, View } from 'react-native';
import LoginButton from './LoginButton';
import LogoutButton from './LogoutButton';

/**
 * If logged out:
 *  - display invitation to login and LoginButton
 *
 * If logged in:
 *  - display invitation to login and LoginButton
 **/
class Login extends Component {

  constructor(props) {
    super(props);

    this.handleLoginClick = this.handleLoginClick.bind(this);
    this.handleLogoutClick = this.handleLogoutClick.bind(this);
  }

  handleLoginClick() {
    this.props.onLogin();
  }

  handleLogoutClick() {
    this.props.onLogout();
  }

  render() {
    const isLoggedIn = this.props.isLoggedIn;
    const name = this.props.name;
    let button = null;

    if (isLoggedIn) {
      button = <LogoutButton onClick={this.handleLogoutClick} />;
    } else {
      button = <LoginButton onClick={this.handleLoginClick} />;
    }

    return (
      <View>
        {isLoggedIn ? (<Text>Logged in as {name}</Text>) : (<Text>Not logged in</Text>)}
        {button}
      </View>
    )
  }
}

export default Login;
