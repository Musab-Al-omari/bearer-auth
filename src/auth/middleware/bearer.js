'use strict';

const users = require('../models/users.js');

module.exports = async(req, res, next) => {

  // a token in the req headers 
  // Authorization header value will be "Bearer token"
  if (!req.headers.authorization) {
    next('Invalid Login');
  } else {
    try {
      // get the token from headers
      const token = req.headers.authorization.split(' ').pop();

      const validUser = await users.authenticateWithToken(token);
      console.log('validUser', validUser);
      if (validUser) {
        req.user = validUser;
        req.token = validUser.token;
        next();
      } else {
        next('Invalid Token!!!!');
      }


    } catch (e) {
      res.status(403).send('Invalid Login');
    }
  }
};