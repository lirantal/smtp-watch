/**
 * SimpleSMTP server configuration
 */

'use strict';

// Fetch configuration
var config = require('./environment');

// Setup SMTP server
var simplesmtp = require('simplesmtp');
var smtpServer = simplesmtp.createServer();

smtpServer.listen(config.smtp.port, function(err) {
	if (err)
		throw err;
});