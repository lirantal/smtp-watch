/**
 * SimpleSMTP server configuration
 */

'use strict';

// Require restler for API calls
var rest = require('restler');

// Fetch configuration
var config = require('./environment');

// Setup SMTP server
var simplesmtp = require('simplesmtp');
var mailMessages = {};

var smtpServer = simplesmtp.createServer(
	{
		SMTPBanner: "Liran's NodeJS SMTP Watch Server", 
		requireAuthentication: false,
		enableAuthentication: false,
		disableDNSValidation: true,
		validate: false
	},
	function(req) {
		req.accept();
	}
);

smtpServer.listen(config.smtp.port, function(err) {
	if (err)
		throw err;
});

smtpServer.on("data", function(envelope, chunk) {
	var messageKey = envelope.date.getTime() + "-" + envelope.from;
	var messageKeyEntry = mailMessages[messageKey];
	messageKeyEntry.chunk = messageKeyEntry.chunk + chunk;
	mailMessages[messageKey] = messageKeyEntry;
});

smtpServer.on("startData", function(envelope) {
	var messageKey = envelope.date.getTime() + "-" + envelope.from;
	mailMessages[messageKey] = { 'envelope':envelope, 'chunk': ''};
});

smtpServer.on("dataReady", function(envelope, callback) {
	var messageKey = envelope.date.getTime() + "-" + envelope.from;
	var message = mailMessages[messageKey];

	var mailsAPI = "http://" + config.ip + ":" + config.port + "/api/mails";
	rest.post(mailsAPI, {
		data: {
			'from': message.envelope.from,
			'to': JSON.stringify(message.envelope.to),
			'date': message.envelope.date,
			'data': message.chunk,
			'remoteAddress': message.envelope.remoteAddress,
			'host': message.envelope.host
		}
	}).on("complete", function(data) {
		delete mailMessages[messageKey];
	});

	callback(null);
});