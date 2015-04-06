/**
 * SimpleSMTP server configuration
 */

'use strict';

// Fetch configuration
var config = require('./environment');

// Setup SMTP server
var simplesmtp = require('simplesmtp');
var mailMessages = {};

var smtpServer = simplesmtp.createServer({SMTPBanner: "Liran's NodeJS SMTP Watch Server", 
	requireAuthentication: false, enableAuthentication: false, disableDNSValidation: true, validate: false},
	function(req) {
		req.accept();
	}
);

smtpServer.listen(config.smtp.port, function(err){
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
	mailMessages[messageKey] = { 'envelope':envelope, 'chunk': ''} ;
});