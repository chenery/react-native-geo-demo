import React, {Component} from 'react';
import { Text, View, FlatList } from 'react-native';
import Message from '../Generic/Message';
import { connect } from 'react-redux';
import { onlineUsers, onlineUsersUpdated, cancelOnlineUsersSearch } from '../Redux/Actions/user-actions'

class OnlineUsers extends Component {
  constructor(props) {
    super(props);
    this.usersUpdated = this.usersUpdated.bind(this);
  }

  componentDidMount() {
    console.log('OnlineUsers did mount');
    this.props.dispatch(onlineUsers(this.props.userLocationPin, this.usersUpdated));
  }

  componentWillUnmount() {
    console.log('OnlineUsers component will unmount');
    this.props.dispatch(cancelOnlineUsersSearch());
  }

  usersUpdated(onlineUsers) {
    console.log('Online Users detected updated users, now size %d', onlineUsers.length);
    this.props.dispatch(onlineUsersUpdated(onlineUsers));
  }

  render() {
    const onlineUsers = this.props.onlineUsers;
    const noUsersFound = this.props.onlineUsers.length === 0;
    const listItems = onlineUsers.map((user) => {
      return { key: user.name }
    });

    return (
      <View>
        {noUsersFound && <Message message="No users found"/>}
        <FlatList
          data={listItems}
          renderItem={({item}) => <Text>{item.key}</Text>}
        />
      </View>
    );
  }
}

function mapStateToProps(state) {
  const { userLocationPin, onlineUsers } = state.userReducer

  return {
    userLocationPin,
    onlineUsers
  }
}

export default connect(mapStateToProps)(OnlineUsers)
