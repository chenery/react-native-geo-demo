import React, { Component } from 'react';
import { Button } from 'react-native';

function LoginButton(props) {
  return (
    <Button onPress={props.onClick} title="Login with Facebook"/>
  );
}

export default LoginButton;
