'use strict';
const userDb = require('../database/user-data');
const methods = require('../methods');
var path = require('path');
function main(req, res) {
	try {
		var reactApp = __dirname + '/../views/resources/build/index.html';
		methods.handleCookie(req.headers.cookie).then(data => {
			sendPage(data);
		});
		function sendPage(data) {
			data === null
				? res.redirect('/home')
				: res.sendFile(path.join(reactApp));
		}
	} catch (err) {
		console.log(err);
		res.status(500).send('error 500');
	}
}
module.exports = main;
