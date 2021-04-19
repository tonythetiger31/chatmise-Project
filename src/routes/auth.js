'use strict';
const validator = require('validator');
const { verifyGoogleToken, tokenAuth } = require('../methods');
const userDb = require('../database/user-data');

exports.auth = (req, res) => {
	const encryptedToken = req.body.token;
	tokenAuth(encryptedToken).then(data => {
		!data.status
			? res.sendStatus(400)
			: data.status === 300
			? res.sendStatus(300)
			: data.status === 200 && res.sendStatus(200);
	});
};
