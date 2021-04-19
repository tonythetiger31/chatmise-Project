'use strict';
const userDb = require('../database/user-data');
const validator = require('validator');
const { verifyGoogleToken, tokenAuth } = require('../methods');

exports.newAccount = (req, res) => {
	const username = req.body.username,
		token = req.body.token;
	const validateToken = (async () => {
		const data = await tokenAuth(token);
		!data
			? res.sendStatus(401)
			: data.status === 300
			? vaidateUsername(data.userid)
			: data.status === 200 && res.sendStatus(403);
	})();
	function vaidateUsername(userid) {
		const usernameIsValid =
			username &&
			validator.isAlphanumeric(username) &&
			!validator.contains(username + '', '\\') &&
			validator.isLength(username + '', { min: 5, max: 10 });
		usernameIsValid
			? checkIfUsernameAlreadyUsed(userid)
			: res.sendStatus(400);
	}
	async function checkIfUsernameAlreadyUsed(userid) {
		const data = await userDb.users.findOne({ username: username });
		!data ? createUser(userid) : res.sendStatus(409); //409 res means username has already been used
	}
	async function createUser(userid) {
		const user = new userDb.users({
			username: username,
			settings: 1,
			chats: [],
			chatsCreated: 0,
			invites: [],
			googleId: userid,
		});
		try {
			const data = await user.save();
			res.sendStatus(201);
		} catch (e) {
			res.sendStatus(500);
		}
	}
};
//FIGURE OUT HOW TO GET GOOGLE AUTH IN REACT APP