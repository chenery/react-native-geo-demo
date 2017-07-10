import {FirebaseAuth} from '../Repository/Firebase';
import {UserStore} from '../Repository/Firebase';
import {LocationStore} from '../Repository/Firebase';
import Auth from '../Auth/FacebookAuth';

export const REQUEST_SOCIAL_USER = 'REQUEST_SOCIAL_USER';
export const REQUEST_LOCATION = 'REQUEST_LOCATION';

export const FACEBOOK_LOG_IN = 'FACEBOOK_LOG_IN';
export const GEO_LOCATION = 'GEO_LOCATION';
export const LOG_IN = 'LOG_IN';
export const ANON_LOG_IN = 'ANON_LOG_IN';
export const LOG_OUT = 'LOG_OUT';
export const ONLINE = 'ONLINE';
export const OFFLINE = 'OFFLINE';

/**
  FLOW:
  Init app "loading"
  checkForNewLogin  -> FB Login Found -> Save User -> login state
                    -> OR FB login not found -> Wait for Firebase Login -> login state

*/

/**
  Commands: something we want to happen
*/

export function requestSocialUser() {
  return {
    type: REQUEST_SOCIAL_USER
  }
};

export function requestLocation(userId) {
  return {
    type: REQUEST_LOCATION,
    userId: userId
  }
};

/**
  Events: something happened
*/

export function login(user) {
  return {
    type: LOG_IN,
    user: user
  }
};

export function online(userLocationPin) {
  return {
    type: ONLINE,
    userLocationPin: userLocationPin
  }
};

// TODO handle error states
export function facebookLogin() {
  return (dispatch) => {
    dispatch({
      type: FACEBOOK_LOG_IN,
      payload: fbLoginFlow()
    });
  };
};

function fbLoginFlow() {
  return new Promise((resolve, reject) => {
    fbLogin()
      .then(firebaseSignIn)
      .then(saveUser)
      .then((user) => resolve(user))
      .catch((err) => {
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
  return a promise resolving the firebase user
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

/**
  Determine if the user is currently logged into Firebase.
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

function initLogin(user) {
  return (dispatch) => {
    dispatch(login(user));
    // TODO is this bad practice - two dispatch in a row?
    dispatch(initOnlineCheck(user.id));
  };
};

// init APP state (isOnline) from the DB
function initOnlineCheck(userId) {
  return (dispatch) => {
    dispatch(requestLocation(userId));
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
