'use strict';

class AuthModel {

  constructor() {
  }

  login(email, password) {
    return new Promise( function(resolve, reject) {
      let adminMail = SystemSettings.get('admin', 'email');
      let adminPassword = SystemSettings.get('admin', 'password');
      if (!adminMail || !adminPassword) {
        console.error("SystemSettings need admin's email && password".red);
        return reject("SystemSettings need admin's email && password");
      }

      if (email === adminMail && password === adminPassword) {
        return resolve({
          name:'administrator',
          token: 'abcdefghijklimnentuvwxyz'
        });
      }
      return reject('Authenticate error');
    });
  }
}

module.exports = AuthModel;
