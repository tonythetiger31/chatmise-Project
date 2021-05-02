const methods = require('../methods'),
	chatDb = require('../database/chat-data'),
	userDb = require('../database/user-data');

exports.onConnect = async socket => {
	var sender;
	try {
		const handleCookieLogic = await (async () => {
         const token = socket.handshake.query.token;
			const data = await methods.tokenAuth(token);
			if (!data || data.status === 300) {
            socket.emit('allTexts', 'invalid credentials');
				socket.disconnect(true);
         } else {
            const user = await userDb.users.findOne({ googleId: data.userid })
            sender = user.username
            getAllChatsTexts(user);
			}
		})();
		async function getAllChatsTexts(user) {
			var data = await methods.grabAllThisUserChats(user.chats);
			getChatInviteData(data, user);
		}
		async function getChatInviteData(chatInfo, user) {
			var invitedChatData = [];
			for (var element of user.invites) {
				var data = await chatDb.chats.findById(
					element,
					'chatName admin _id'
				);
				data && invitedChatData.push(data);
			}
			chatInfo.invitesData = invitedChatData;
			joinSocketRooms(chatInfo, user);
		}
		function joinSocketRooms(chatInfo, user) {
			var roomUserCount = [];
			chatInfo.chatIds.forEach(element => {
				socket.join(element);
				var allRooms = Array.from(socket.adapter.rooms);
				allRooms.forEach((_, i) => {
					if (allRooms[i].includes(element)) {
						roomUserCount.push(allRooms[i][1].size);
						// socket.to(element).emit('userCount', {
						//    chat: element,
						//    userCount: allRooms[i][1].size
						// });
					}
				});
			});
			sendDataToUser(chatInfo, user, roomUserCount);
		}
		function sendDataToUser(chatInfo, user, roomUserCount) {
			console.log({ roomUserCount });
			var allRoomUserCount = [];
			chatInfo.chatIds.forEach((element, i) => {
				allRoomUserCount.push({
					chat: element,
					count: roomUserCount[i],
				});
			});
			const emitData = {
				chatNames: chatInfo.chatNames,
				texts: chatInfo.allChatsTexts,
				members: chatInfo.members,
				admins: chatInfo.admins,
				invites: chatInfo.invitesData,
				chatIds: chatInfo.chatIds,
				username: user.username,
				settings: user.settings,
				// "userCount": allRoomUserCount
			};
			socket.emit('allTexts', emitData);
		}
	} catch (err) {
		socket.emit('allTexts', 500);
		console.error(err);
	}
	return sender;
};
