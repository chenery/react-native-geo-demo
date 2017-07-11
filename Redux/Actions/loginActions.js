/**
* Actions relating to login/logout/online/offline
*/

import {FirebaseAuth} from '../../Services/Firebase';
import {UserStore} from '../../Services/Firebase';
import {LocationStore} from '../../Services/Firebase';
import Auth from '../../Services/Auth/FacebookAuth';

/**
* Action names published for use in reducers
*/

export const FACEBOOK_LOG_IN = 'FACEBOOK_LOG_IN';
export const LOG_IN = 'LOG_IN';
export const ANON_LOG_IN = 'ANON_LOG_IN';
export const LOG_OUT = 'LOG_OUT';
export const ONLINE = 'ONLINE';
export const OFFLINE = 'OFFLINE';

/**
* Exported action functions, to be dispatched by conponents
*   can be:
*   (i) dispatch functions with a promise payload (redux-promise-middleware)
*   (ii) thunks (redux-thunk middleware)
*   (iii) regular Redux action objects
*/



/**
* Determine if the user is currently logged into Firebase. If so log then into app
*/
export function initFirebaseLogin() {
  return (dispatch) => {
    FirebaseAuth().onAuthStateChanged((user) => {
      if (user) {
        // User is signed in, "login without save"
        var userToAutoLogin = {
            "id": user.uid,
            "email": user.email,
            "name": user.displayName,
            "photoURL": user.photoURL
        };

        console.log("Already logged in as %s", userToAutoLogin.id);
        dispatch(initLogin(userToAutoLogin));
      } else {
        dispatch({
          type: ANON_LOG_IN,
          user: user
        });
      }
    });
  };
}

export function facebookLogin() {
  return (dispatch) => {
    dispatch({
      type: FACEBOOK_LOG_IN,
      payload: fbLoginFlow()
    });
  };
};

export function initMoveOnline(userId) {
  return (dispatch) => {
    dispatch({
      type: ONLINE,
      payload: new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
          console.error('Geolocation is not supported by this browser');
          reject();
        }

        navigator.geolocation.getCurrentPosition((position) => {
          var latitude = position.coords.latitude;
          var longitude = position.coords.longitude;
          console.log("User is located at lat: " + latitude + " lng: " + longitude);

          LocationStore.saveLocation(userId, latitude, longitude)
            .then(() => resolve([latitude, longitude]));
        });
      })
    });
  };
};

export function initOffline(userId) {
  return (dispatch) => {
    dispatch({
      type: OFFLINE,
      payload: LocationStore.removeLocation(userId)
    });
  };
};

export function initLogout(userId) {
  return (dispatch) => {
    dispatch({
      type: LOG_OUT,
      payload: new Promise((resolve, reject) => {
        // first go offline
        LocationStore.removeLocation(userId)
          .then(() => {
            // then actually logout
            FirebaseAuth().signOut()
              .then(() => resolve());
          });
      })
    });
  };
};

/**
* Supporting functions
* TODO consider moving to separate modules
*/

function fbLoginFlow() {
  return new Promise((resolve, reject) => {
    fbLogin()
      .then(firebaseSignIn)
      .then(saveUser)
      .then((user) => resolve(user))
      .catch((err) => {
        // TODO handle error states
        console.error('Failed fbLoginFlow: ', err);
        reject(err);
      });
  });
}

/**
  return a promise resolving the Facebook token
*/
function fbLogin() {
  return new Promise((resolve, reject) => {
    Auth.Facebook.login(['public_profile', 'user_friends', 'email'])
      .then((token) => {
        console.log('Received Facebook access token %s', token);
        resolve(token);
      })
      .catch((err) => reject(err));
  });
}

/**
* Sign into Firebase Auth using Facebook token.
*
* return a promise resolving the firebase user
*/
function firebaseSignIn(token) {
  return new Promise((resolve, reject) => {
    FirebaseAuth().signInWithCredential(
      FirebaseAuth.FacebookAuthProvider.credential(token))
        .then((user) => {
          console.log("*** Logged in as user: " + user.displayName + " ***");
          resolve(user);
        })
      .catch((err) => reject(err));
  });
}

function saveUser(user) {
  return new Promise((resolve, reject) => {
    UserStore.saveUser(user.uid, user.email, user.displayName, user.photoURL)
      .then(resolve(user));
  });
}

function initLogin(user) {
  return (dispatch) => {
    dispatch(login(user));
    // TODO is this bad practice - two dispatch in a row?
    dispatch(initOnlineCheck(user.id));
  };
};

function login(user) {
  return {
    type: LOG_IN,
    user: user
  }
};

// init APP state (isOnline) from the DB
function initOnlineCheck(userId) {
  return (dispatch) => {
    dispatch(lookupLocation(userId));
    LocationStore.getLocation(userId)
      .then((userLocationPin) => {
        if (userLocationPin) {
          console.log("User is already online at %s", userLocationPin);
          dispatch(online(userLocationPin));
        } else {
          dispatch({
            type: OFFLINE
          });
        }
      });
  };
}

function online(userLocationPin) {
  return {
    type: ONLINE,
    userLocationPin: userLocationPin
  }
};

function lookupLocation(userId) {
  return {
    type: 'LOOKUP_LOCATION',
    userId: userId
  }
};
