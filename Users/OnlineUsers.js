import React, {Component} from 'react';
import { Text, View, FlatList } from 'react-native';
import Message from '../Generic/Message';
import Loading from '../Generic/Loading';
import { connect } from 'react-redux';
import { onlineUsers, onlineUsersUpdated, cancelOnlineUsersSearch } from '../Redux/Actions/userActions'

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

    const isOnlineUsersLoading = this.props.isOnlineUsersLoading;

    if (isOnlineUsersLoading) {
      return (<Loading />);
    }

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
  const { userLocationPin } = state.loginReducer;
  const { isOnlineUsersLoading, onlineUsers } = state.userReducer;

  return {
    userLocationPin,
    isOnlineUsersLoading,
    onlineUsers
  }
}

export default connect(mapStateToProps)(OnlineUsers)
