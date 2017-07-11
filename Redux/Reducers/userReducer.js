import { PENDING, FULFILLED, REJECTED } from 'redux-promise-middleware'
import { ONLINE_USERS, ONLINE_USERS_UPDATED } from '../Actions/userActions';

const initialState = {
  isOnlineUsersLoading: true,
  onlineUsers: []
};

export function userReducer(state = initialState, action) {
  switch (action.type) {

    case ONLINE_USERS + '_' + PENDING:
      return Object.assign({}, state, {
        isOnlineUsersLoading: true,
        onlineUsers: []
      })
      break;

    case ONLINE_USERS + '_' + FULFILLED:
      return Object.assign({}, state, {
        isOnlineUsersLoading: false,
        onlineUsers: action.payload
      })
      break;

    case ONLINE_USERS_UPDATED:
      return Object.assign({}, state, {
        onlineUsers: action.onlineUsers
      })
      break;

    default:
      return state;
  }
}
