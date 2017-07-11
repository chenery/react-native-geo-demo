import React, {Component} from 'react';
import { Text, View, FlatList } from 'react-native';
import UserListItem from './UserListItem';
import Message from '../Generic/Message';
import {UserStore} from '../Repository/Firebase';

class OnlineUsers extends Component {
  constructor(props) {
    super(props);
    this.usersUpdated = this.usersUpdated.bind(this);
    this.state = {
        users: []
    };
  }

  componentDidMount() {
    console.log('OnlineUsers did mount');
    UserStore.findUsers(this.props.userLocationPin, this.usersUpdated)
      .then((users) => {
        this.setState({users: users});
      });
  }

  componentWillUnmount() {
    console.log('OnlineUsers component will unmount');
    UserStore.cancelFindUsers();
  }

  usersUpdated(users) {
      console.log('Online Users detected updated users, now size %d',
        users.length);
      this.setState({users: users});
  }

  render() {
    const users = this.state.users;
    const noUsersFound = this.state.users.length === 0;
    const listItems = users.map((user) => {
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

  componentDidUpdate() {
    console.log('OnlineUsers component updated');
  }
}

export default OnlineUsers;
