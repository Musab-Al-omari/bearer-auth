'use strict';

// Start up DB Server
require('dotenv').config();

const mongoose = require('mongoose');
const options = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
};
mongoose.connect(process.env.MONGODB_URI, options, () => console.log('db working'));

// Start the web server
require('./src/server.js').start(process.env.PORT);