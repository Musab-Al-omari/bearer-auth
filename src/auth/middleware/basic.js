'use strict';

const base64 = require('base-64');
const User = require('../models/users.js');

module.exports = async(req, res, next) => {
  // console.log('hi basic');

  if (!req.headers.authorization) {
    next('Invalid Login');
    return;
  }


  let basic = req.headers.authorization.split(' ').pop();

  let [user, pass] = base64.decode(basic).split(':');

  try {
    req.user = await User.authenticateBasic(user, pass);
    next();
  } catch (e) {
    res.status(403).send('Invalid Login');
  }

};