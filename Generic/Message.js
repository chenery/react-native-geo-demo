import React, {Component} from 'react';
import { Text, View } from 'react-native';

class Message extends Component {

  render() {
    return (
      <View>
        <Text>{this.props.message}</Text>
      </View>
    );
  }
}

export default Message;
