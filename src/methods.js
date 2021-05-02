//module declaration
const userDb = require('./database/user-data');
const chatDb = require('./database/chat-data');
const { response } = require('express');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const { OAuth2Client } = require('google-auth-library');
var path = require('path');
//functions
const cookieParse = (cookie, key) => {
		try {
			str = cookie.replace(/\s+/g, '');
			cA = str.split(/[;=]+/);
			cB = cA.indexOf(key);
			if (cB === -1) {
				return null;
			} else {
				cB += 1;
				cB = cA[cB];
				cB = cB.toString();
				return cB;
			}
		} catch (err) {
			return null;
		}
	},
	hashComparison = (normPw, dbPw) => {
		return new Promise(resolve => {
			bcrypt.compare(normPw, dbPw, (err, result) => {
				resolve(result);
			});
		});
	},
	pageNotFound = (req, res) => {
		res.send('<h1>404 Page Not Found :(</h1>').status(404);
	},
	grabAllThisUserChats = async chatIds => {
		var dataObj = {
			allChatsTexts: [],
			chatNames: [],
			members: [],
			admins: [],
			chatIds: [],
		};
		for (let element of chatIds) {
			var data = await chatDb.chats.findById(element);
			if (data) {
				dataObj.allChatsTexts.push(data.messages);
				dataObj.chatNames.push(data.chatName);
				dataObj.members.push(data.members);
				dataObj.admins.push(data.admin);
				dataObj.chatIds.push(element);
			}
		}
		return dataObj;
	},
	validate = {
		cookie: (arg, maxLength) => {
			//limit max length && deny ! string
			try {
				if (typeof arg === 'string' && arg.length < maxLength) {
					return true;
				}
				return false;
			} catch (err) {
				return false;
			}
		},
		input: (arr, maxLength, type) => {
			try {
				var badInput;
				arr.forEach(element => {
					if (
						typeof element !== type ||
						element.length > maxLength ||
						element.length < 1
					) {
						badInput = true;
					}
				});
				if (badInput) {
					return false;
				}
				return true;
			} catch (err) {
				console.log(err);
				return false;
			}
		},
	},
	handleCookie = cookie => {
		return new Promise(resolve => {
			validateWholeCookie();
			function validateWholeCookie() {
				if (cookie === undefined) {
					resolve(null);
				} else if (validate.cookie(cookie, 400)) {
					parseCookie();
				} else {
					resolve(null);
				}
			}
			function parseCookie() {
				cookie = cookieParse(cookie, 'userId');
				validateParsedCookie();
			}
			function validateParsedCookie() {
				if (validate.cookie(cookie, 50)) {
					checkCookie();
				} else {
					resolve(null);
				}
			}
			function checkCookie() {
				userDb.userToken
					.findOne({
						token: cookie,
					})
					.then(data => {
						resolve(data);
					});
			}
		});
	},
	verifyGoogleToken = async encryptedToken => {
		const CLIENT_ID =
			'407415747373-v23ak1k7kp37k3s986mu5qh9cpqh9bdh.apps.googleusercontent.com';
		const client = new OAuth2Client(CLIENT_ID);
		async function verify() {
			const ticket = await client.verifyIdToken({
				idToken: encryptedToken,
				audience: CLIENT_ID,
			});
			const payload = ticket.getPayload(); //decrypted token info
			return payload['sub']; //userid
		}
		try {
			return await verify();
      } catch (e) {
			return null;
		}
	},
	tokenAuth = async encryptedToken => {
		// validates & verifys token, & checks if new user
		return await validate();
		async function validate() {
			const tokenIsValid =
				typeof(encryptedToken) === 'string' &&
				validator.isLength(encryptedToken, { min: 0, max: 2000 }) &&
				!validator.contains(encryptedToken, '\\');
			if (tokenIsValid) {
				return await handleVerification();
			}
			return null;
		}
		async function handleVerification() {
			const userid = await verifyGoogleToken(encryptedToken);
			if (userid) {
				return await checkDbForUserId(userid);
			}
			return null;
		}
		async function checkDbForUserId(userid) {
			var user = await userDb.users.findOne({ googleId: userid });
			if (user) {
				return {
					status: 200,
					userid: userid,
				}; //existing user
			}
			return {
				status: 300,
				userid: userid,
			}; //new user
		}
	};
module.exports = {
	hashComparison,
	cookieParse,
	pageNotFound,
	validate,
	handleCookie,
	grabAllThisUserChats,
	verifyGoogleToken,
	tokenAuth,
};
