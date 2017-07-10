import Expo from 'expo';

const Facebook = {
  login: (permissions) => {
    console.log('About to call FB login');
    return new Promise((resolve, reject) => {

      Expo.Facebook.logInWithReadPermissionsAsync('290526404722897', {
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
