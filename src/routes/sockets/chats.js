const validator = require('validator'),
   chatDb = require('../../database/chat-data'),
   userDb = require('../../database/user-data');

function acceptInvite(socket, sender) {
	socket.on('acceptInvite', body => {
		try {
			const validate = (_ => {
				validator.isMongoId(body.chatId + '') &&
				validator.isBoolean(body.isAccepted + '')
					? handleRequest()
					: socket.emit('acceptInvite', 400);
			})();
			function handleRequest() {
				body.isAccepted ? pushSenderToChat() : updateUser(false);
			}
			function pushSenderToChat() {
				chatDb.chats.updateOne(
					{ _id: body.chatId },
					{ $addToSet: { members: sender } },
					(err, docs) => {
						err
							? socket.emit('acceptInvite', 500)
							: docs.n === 0 //not found
							? socket.emit('acceptInvite', 404)
							: docs.nModified === 0 //aready updated
							? socket.emit('acceptInvite', 409)
							: updateUser(true);
					}
				);
			}
			function updateUser(isAccepted) {
				var toUpdate = { $pull: { invites: body.chatId } };
				isAccepted && (toUpdate.$addToSet = { chats: body.chatId });
				userDb.users.updateOne(
					{ username: sender },
					toUpdate,
					(err, docs) => {
						err
							? socket.emit('acceptInvite', 500)
							: docs.n === 0 //not found
							? socket.emit('acceptInvite', 404)
							: docs.nModified === 0 //aready updated
							? socket.emit('acceptInvite', 409)
							: socket.emit('acceptInvite', 200);
					}
				);
			}
		} catch (err) {
			socket.emit('acceptInvite', 500);
			console.error(err);
		}
	});
}
function invite(socket, sender) {
	socket.on('invite', body => {
		try {
			const validate = (() => {
				validator.isMongoId(body.chatId + '') &&
				validator.isAlphanumeric(body.invitee + '') &&
				validator.isLength(body.invitee + '', { min: 0, max: 10 }) &&
				!validator.equals(sender, body.invitee + '')
					? checkChatInfo()
					: socket.emit('invite', 400);
			})();
			function checkChatInfo() {
				//checks if sender is admin and if invitee is not already in chat
				chatDb.chats.findOne({ _id: body.chatId }).then(data => {
					!data || data.admin !== sender
						? socket.emit('invite', 400)
						: data.members.includes(body.invitee)
						? socket.emit('invite', 409)
						: pushInviteToInvitee();
				});
			}
			function pushInviteToInvitee() {
				userDb.users.updateOne(
					{ username: body.invitee },
					{ $addToSet: { invites: body.chatId } },
					(err, docs) => {
						err
							? socket.emit('invite', 500)
							: docs.n === 0 //not found
							? socket.emit('invite', 404)
							: docs.nModified === 0 //aleady invited
							? socket.emit('invite', 409)
							: socket.emit('invite', 200);
					}
				);
			}
		} catch (err) {
			socket.emit('invite', 500);
			console.error(err);
		}
	});
}

function newChat(socket, sender) {
	socket.on('newChat', body => {
		try {
			const validate = (() => {
				validator.isAlphanumeric(body.chatName + '') &&
				validator.isLength(body.chatName + '', { min: 4, max: 10 })
					? findIfAllowedToCreateMoreChats()
					: socket.emit('newChat', 400);
			})();
			function findIfAllowedToCreateMoreChats() {
				userDb.users.findOne({ username: sender }).then(data => {
					data.chatsCreated >= 5
						? socket.emit('newChat', 403)
						: createNewChat(body.chatName, data.chatsCreated);
				});
			}
			function createNewChat(chatName, chatsCreated) {
				var chat = {
					chatName: chatName,
					members: [],
					admin: sender,
				};
				var newChat = new chatDb.chats(chat);
				newChat.save((err, createdChat) => {
					if (err) {
						socket.emit('newChat', 500);
					} else {
						addChatToUserProfile(
							createdChat._id.toString(),
							chatsCreated
						);
					}
				});
			}
			function addChatToUserProfile(chatId, chatsCreated) {
				userDb.users.updateOne(
					{
						username: sender,
					},
					{
						$addToSet: {
							chats: chatId,
						},
						chatsCreated: chatsCreated + 1,
					},
					err => {
						if (err) {
							socket.emit('newChat', 500);
						} else {
							socket.emit('newChat', 200);
						}
					}
				);
			}
		} catch (err) {
			socket.emit('newChat', 500);
			console.error(err);
		}
	});
}

module.exports = { acceptInvite, invite, newChat };
