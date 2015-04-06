'use strict';

var _ = require('lodash');
var Mail = require('./mail.model');

// Get list of mails
exports.index = function(req, res) {
  Mail.find(function (err, mails) {
    if(err) { return handleError(res, err); }
    return res.json(200, mails);
  });
};

// Get a single mail
exports.show = function(req, res) {
  Mail.findById(req.params.id, function (err, mail) {
    if(err) { return handleError(res, err); }
    if(!mail) { return res.send(404); }
    return res.json(mail);
  });
};

// Creates a new mail in the DB.
exports.create = function(req, res) {
  Mail.create(req.body, function(err, mail) {
    if(err) { return handleError(res, err); }
    return res.json(201, mail);
  });
};

// Updates an existing mail in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Mail.findById(req.params.id, function (err, mail) {
    if (err) { return handleError(res, err); }
    if(!mail) { return res.send(404); }
    var updated = _.merge(mail, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, mail);
    });
  });
};

// Deletes a mail from the DB.
exports.destroy = function(req, res) {
  Mail.findById(req.params.id, function (err, mail) {
    if(err) { return handleError(res, err); }
    if(!mail) { return res.send(404); }
    mail.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}