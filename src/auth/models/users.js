'use strict';
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const SECRET = process.env.SECRET;

const users = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

// Adds a virtual field to the schema. We can see it, but it never persists
// So, on every user object ... this.token is now readable!

users.virtual('token').get(function() {
  let tokenObject = {
    username: this.username,
    exp: Math.floor(Date.now() / 1000) + (20 * 60),
  };
  return jwt.sign(tokenObject, SECRET);
});

// Pre-Save Hook
users.pre('save', async function() {
  if (this.isModified('password')) {
    // console.log('pass before', this.password);
    this.password = await bcrypt.hash(this.password, 10);
    // console.log('pass after', this.password);
  }
});

// BASIC AUTH
users.statics.authenticateBasic = async function(username, password) {
  const user = await this.findOne({ username });
  const valid = await bcrypt.compare(password, user.password);
  if (valid) { return user; }
  throw new Error('Invalid User');
};

// BEARER AUTH
users.statics.authenticateWithToken = async function(token) {
  try {
    // console.log('token', token);
    const parsedToken = jwt.verify(token, SECRET);
    // console.log('parsedToken', parsedToken);

    const user = await this.findOne({ username: parsedToken.username });


    if (user) {


      return user;
    }
    throw new Error('User Not Found');
  } catch (e) {
    throw new Error(e.message);
  }

};



module.exports = mongoose.model('users', users);