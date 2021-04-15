'use strict';
const validator = require('validator');
const { verifyGoogleToken } = require('../methods');
const userDb = require('../database/user-data');

exports.auth = (req, res) => {
	const encryptedToken = req.body.token;
	const CLIENT_ID =
		'407415747373-v23ak1k7kp37k3s986mu5qh9cpqh9bdh.apps.googleusercontent.com';
	const validate = (() => {
		validator.isLength(encryptedToken, { min: 0, max: 2000 }) &&
		!validator.contains(encryptedToken, '\\')
			? handleVerification()
			: res.send(400);
	})();
	async function handleVerification() {
		const userid = await verifyGoogleToken(encryptedToken);
      !userid
         ? res.send(400)
         : checkDbForUserId(userid)
   }
	async function checkDbForUserId(userid) {
		console.log(userid);
		var user = await userDb.users.findOne({ googleId: userid });
		!user ? res.redirect('/new-account') : res.redirect('/');
	}
};
