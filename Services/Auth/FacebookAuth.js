import Expo from 'expo';
import { facebookConfig } from '../../config';

const Facebook = {
  login: (permissions) => {
    console.log('About to call FB login');
    return new Promise((resolve, reject) => {
      Expo.Facebook.logInWithReadPermissionsAsync(facebookConfig.appId, {
        permissions: permissions || ['email'],
      }).then((response) => {
        console.log("Login response: ", response);
          if (response.type === 'success') {
            resolve(response.token);
          } else {
            reject();
          }
      });
    });
  }
}

const Auth = {Facebook};

export default Auth;
