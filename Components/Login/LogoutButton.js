import React, { Component } from 'react';
import { Button } from 'react-native';

function LogoutButton(props) {
  return (
    <Button onPress={props.onClick} title="Logout"/>
  );
}

export default LogoutButton;
