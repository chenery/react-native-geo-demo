/**
* Actions relating to online users
*/

import { UserStore } from '../../Repository/Firebase';


/**
* Action names published for use in reducers
*/

export const ONLINE_USERS = 'ONLINE_USERS';
export const ONLINE_USERS_UPDATED = 'ONLINE_USERS_UPDATED';

/**
* Action functions, can be:
*   (i) dispatch functions with a promise payload (redux-promise-middleware)
*   (ii) thunks (redux-thunk middleware)
*   (iii) regular Redux action objects
*/

export function onlineUsers(userLocationPin, usersUpdated) {
  return (dispatch) => {
    dispatch({
      type: ONLINE_USERS,
      payload: UserStore.findUsers(userLocationPin, usersUpdated)
    });
  };
};

export function onlineUsersUpdated(onlineUsers) {
  return {
    type: ONLINE_USERS_UPDATED,
    onlineUsers: onlineUsers
  }
};

export function cancelOnlineUsersSearch() {
  try {
    UserStore.cancelFindUsers();
  } catch (error) {
    console.error('Failed to cancel online users', error);
  }
  return {
    type: 'ONLINE_USERS_CANCELLED'
  }
};
