'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var MailSchema = new Schema({
  from: String,
  to: Array,
  timestamp: {
  	type: Date,
  	default: Date.now
  },
  data: String,
  remoteAddress: String,
  host: String
});

module.exports = mongoose.model('Mail', MailSchema);