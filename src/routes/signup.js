const userDb = require('../database/user-data');
const users = userDb.users;
var path = require('path');
const methods = require('../methods');
exports.get = function (req, res) {
	try {
		var clientHtml = __dirname + '/../views/resources/auth/signup.html';
		methods.handleCookie(req.headers.cookie).then(data => {
			sendPage(data);
		});
		function sendPage(data) {
			if (data === null) {
				res.sendFile(path.join(clientHtml));
			} else {
				res.status(307);
				res.redirect('/');
			}
		}
	} catch (err) {
		console.log(err);
		res.status(500).send('error 500');
	}
};
