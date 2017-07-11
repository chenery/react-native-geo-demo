import { PENDING, FULFILLED, REJECTED } from 'redux-promise-middleware'
import { FACEBOOK_LOG_IN, LOG_IN, ANON_LOG_IN, LOG_OUT, ONLINE, OFFLINE } from '../Actions/loginActions';

const initialState = {
  isLoading: true,
  isLoggedIn: false,
  isOnline: false,
  user: null,
  userLocationPin: null
};

export function loginReducer(state = initialState, action) {
  switch (action.type) {

    case FACEBOOK_LOG_IN + '_' + PENDING:
      return Object.assign({}, state, {
        isLoading: true
      })
      break;

    case LOG_IN:
      return Object.assign({}, state, {
        isLoggedIn: true,
        user: action.user
      })
      break;

    case ANON_LOG_IN:
      return Object.assign({}, state, {
        isLoading: false,
        isLoggedIn: false,
        isOnline: false,
        user: null,
        userLocationPin: null
      })
      break;

    case LOG_OUT + '_' + FULFILLED:
      return Object.assign({}, state, {
        isLoggedIn: false,
        isOnline: false,
        user: null,
        userLocationPin: null,
        onlineUsers: []
      })
      break;

    case ONLINE + '_' + PENDING:
      return Object.assign({}, state, {
        isLoading: true
      })
      break;

    case ONLINE + '_' + FULFILLED:
      return Object.assign({}, state, {
        isLoading: false,
        isOnline: true,
        userLocationPin: action.payload
      })
      break;

    case ONLINE:
      return Object.assign({}, state, {
        isLoading: false,
        isOnline: true,
        userLocationPin: action.userLocationPin
      })
      break;

    case OFFLINE + '_' + PENDING:
      return Object.assign({}, state, {
        isLoading: true
      })
      break;

    case OFFLINE + '_' + FULFILLED:
      return Object.assign({}, state, {
        isLoading: false,
        isOnline: false,
        userLocationPin: null,
        onlineUsers: []
      })
      break;

    case OFFLINE:
      return Object.assign({}, state, {
        isLoading: false,
        isOnline: false,
        userLocationPin: null,
        onlineUsers: []
      })
      break;

    default:
      return state;
  }
}
