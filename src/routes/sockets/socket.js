'use strict';
const validator = require('validator'),
	chatDb = require('../../database/chat-data'),
	userDb = require('../../database/user-data'),
	{ acceptInvite, invite, newChat } = require('./chats'),
	{ onConnect } = require('./onConnect');
const ERR_MSG = 'Something wrong when updating theme data!';

exports.sockets = async socket => {
	var sender = await onConnect(socket); //onConnect returns username of person connecting
   console.log(sender)
	//SOCKET EVENTS
	acceptInvite(socket, sender);
	invite(socket, sender);
	newChat(socket, sender);

	socket.on('settings', body => {
		try {
			const validate = (() => {
				validator.isInt(body.settings) &&
				validator.isLength(body.settings, { min: 0, max: 10 })
					? updateSettings()
					: socket.emit('settings', 400);
			})();
			async function updateSettings() {
				var docs = await userDb.users.updateOne(
					{ username: sender },
					{ settings: body.settings }
				);
				!docs
					? socket.emit('settings', 500)
					: docs.n === 0
					? socket.emit('settings', 500)
					: socket.emit('settings', 200);
			}
		} catch (err) {
			socket.emit('settings', 500);
			console.error(err);
		}
	});

	socket.on('texts', body => {
		try {
			var dbInfo = {
				text: body.text,
				time: body.time,
				sender: sender,
			};
			const validate = (() => {
				!validator.contains(body.text, '\\') &&
				validator.isLength(body.text + '', { min: 0, max: 170 }) &&
				validator.isMongoId(body.chatId + '') &&
				validator.isLength(body.time + '', { min: 0, max: 14 }) &&
				validator.isInt(body.time + '')
					? checkIfSenderHasPremitions()
					: socket.emit('textsResponse', 400);
			})();
			async function checkIfSenderHasPremitions() {
				const data = await chatDb.chats.findOne(
					{ _id: body.chatId },
					'members admin'
				);
				var senderHasPremitons = false;
				for (var element of data.members) {
					element === sender && (senderHasPremitons = true);
				}
				data.admin === sender && (senderHasPremitons = true);
				senderHasPremitons
					? saveTextToDB()
					: socket.emit('textsResponse', 403);
			}
			async function saveTextToDB() {
				const docs = await chatDb.chats.updateOne(
					{ _id: body.chatId },
					{ $push: { messages: dbInfo } }
				);
				!docs
					? socket.emit('textsResponse', 500)
					: docs.n === 0
					? socket.emit('textsResponse', 404)
					: sendSocketMessageToAll();
			}
			function sendSocketMessageToAll() {
				var socketInfo = Object.assign({}, body);
				socketInfo.sender = sender;

				socket.emit('textsResponse', 200);
				socket.to(body.chatId).emit('texts', socketInfo);
			}
		} catch (err) {
			socket.emit('textsResponse', 500);
			console.error(err);
		}
	});
};
