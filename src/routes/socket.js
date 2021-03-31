"use strict"
const
   validator = require('validator'),
   chatDb = require('../database/chat-data'),
   userDb = require('../database/user-data'),
   methods = require('../methods')
const ERR_MSG = "Something wrong when updating theme data!"
//===============================================================SOCKETS
exports.sockets = function sockets(socket) {
   var sender //userName
   //===================ON CONNECTION
   const connectToSocket = (() => {
      try {
         const handleCookieLogic = (async () => {
            var cookie = socket.handshake.headers.cookie;
            var user = await methods.handleCookie(cookie)
            if (user === null) {
               socket.emit("allTexts", 'invalid credentials');
               socket.disconnect(true)
            } else {
               sender = user.username
               findUserInfo(user)
            };
         })()
         async function findUserInfo(user) {
            var data = await userDb.users.findOne({ username: user.username })
            getAllChatsTexts(data)
         }
         async function getAllChatsTexts(user) {
            var data = await methods.grabAllThisUserChats(user.chats)
            getChatInviteData(data, user)
         }
         async function getChatInviteData(chatInfo, user) {
            var invitedChatData = []
            for (var element of user.invites) {
               var data = await chatDb.chats.findById(element, 'chatName admin _id');
               (data) && invitedChatData.push(data);
            }
            chatInfo.invitesData = invitedChatData
            joinSocketRooms(chatInfo, user)
         }
         function joinSocketRooms(chatInfo, user) {
            var roomUserCount = []
            chatInfo.chatIds.forEach(element => {
               socket.join(element);
               var allRooms = Array.from(socket.adapter.rooms)
               allRooms.forEach((_, i) => {
                  if (allRooms[i].includes(element)) {
                     roomUserCount.push(allRooms[i][1].size)
                     // socket.to(element).emit('userCount', {
                     //    chat: element,
                     //    userCount: allRooms[i][1].size
                     // });
                  }
               })
            });
            sendDataToUser(chatInfo, user, roomUserCount);
         }
         function sendDataToUser(chatInfo, user, roomUserCount) {
            console.log(roomUserCount, "--------------")
            var allRoomUserCount = []
            chatInfo.chatIds.forEach((element, i) => {
               allRoomUserCount.push({
                  chat: element,
                  count: roomUserCount[i]
               })
            });
            socket.emit("allTexts", {
               "chatNames": chatInfo.chatNames,
               "texts": chatInfo.allChatsTexts,
               "members": chatInfo.members,
               "admins": chatInfo.admins,
               "invites": chatInfo.invitesData,
               "chatIds": chatInfo.chatIds,
               "username": user.username,
               "settings": user.settings
               // "userCount": allRoomUserCount
            });
         }
      } catch (err) {
         socket.emit('allTexts', 500)
         console.error(err)
      }
   })()

   //===================SOCKET EVENTS  
   socket.on('disconnecting', () => {
      var userRooms = Array.from(socket.rooms)
      var allRooms = Array.from(socket.adapter.rooms)
      userRooms.forEach((element) => {
         allRooms.forEach((element1, i) => {
            // (allRooms[i].includes(element))
            //    && socket.to(element)
            //       .emit('userCount', {
            //          chat: element,
            //          userCount: allRooms[i][1].size - 1
            //       });
         })
      })
   })


   socket.on('acceptInvite', body => {
      try {
         const validate = (_ => {
            (validator.isMongoId(body.chatId + '')
               && validator.isBoolean(body.isAccepted + ''))
               ? handleRequest()
               : socket.emit('acceptInvite', 400)
         })()
         function handleRequest() {
            (body.isAccepted) ? pushSenderToChat() : updateUser(false)
         }
         function pushSenderToChat() {
            chatDb.chats.updateOne({ "_id": body.chatId },
               { $addToSet: { 'members': sender } },
               (err, docs) => {
                  (err)
                     ? socket.emit('acceptInvite', 500)
                     : (docs.n === 0)//not found
                        ? socket.emit('acceptInvite', 404)
                        : (docs.nModified === 0)//aready updated
                           ? socket.emit('acceptInvite', 409)
                           : updateUser(true)
               })
         }
         function updateUser(isAccepted) {
            var toUpdate = { $pull: { "invites": body.chatId } };
            (isAccepted) && (toUpdate.$addToSet = { "chats": body.chatId });
            userDb.users.updateOne(
               { "username": sender }, toUpdate,
               (err, docs) => {
                  (err)
                     ? socket.emit('acceptInvite', 500)
                     : (docs.n === 0)//not found
                        ? socket.emit('acceptInvite', 404)
                        : (docs.nModified === 0)//aready updated
                           ? socket.emit('acceptInvite', 409)
                           : socket.emit('acceptInvite', 200)
               })
         }
      } catch (err) {
         socket.emit('acceptInvite', 500)
         console.error(err)
      }
   })


   socket.on('settings', body => {
      try {
         const validate = (() => {
            (validator.isInt(body.settings)
               && validator.isLength(body.settings, { min: 0, max: 10 }))
               ? updateSettings()
               : socket.emit('settings', 400)
         })()
         function updateSettings() {
            userDb.users.findOneAndUpdate(
               { username: sender },
               { settings: body.settings },
               (err, docs) => {
                  (err)
                     ? socket.emit('settings', 500)
                     : (docs.n === 0)
                        ? socket.emit('settings', 500)
                        : socket.emit('settings', 200)
               })
         }
      } catch (err) {
         socket.emit(500)
         console.error(err)
      }
   })


   socket.on('invite', body => {
      try {
         const validate = (() => {
            (validator.isMongoId(body.chatId + '')
               && validator.isAlphanumeric(body.invitee + '')
               && validator.isLength(body.invitee + '', { min: 0, max: 10 })
               && !validator.equals(sender, body.invitee + ''))
               ? checkChatInfo()
               : socket.emit('invite', 400)
         })()
         function checkChatInfo() {//checks if sender is admin and if invitee is not already in chat
            chatDb.chats.findOne({ _id: body.chatId })
               .then(data => {
                  (!data || data.admin !== sender)
                     ? socket.emit('invite', 400)
                     : (data.members.includes(body.invitee))
                        ? socket.emit('invite', 409)
                        : pushInviteToInvitee()
               })
         }
         function pushInviteToInvitee() {
            userDb.users.updateOne({ "username": body.invitee },
               { $addToSet: { "invites": body.chatId } },
               (err, docs) => {
                  (err)
                     ? socket.emit('invite', 500)
                     : (docs.n === 0)  //not found
                        ? socket.emit('invite', 404)
                        : (docs.nModified === 0)  //aleady invited
                           ? socket.emit('invite', 409)
                           : socket.emit('invite', 200)
               }
            )
         }
      } catch (err) {
         socket.emit('invite', 500)
         console.error(err)
      }
   })


   socket.on('newChat', body => {
      try {
         const validate = (() => {
            (validator.isAlphanumeric(body.chatName + '')
               && validator.isLength(body.chatName + '', { min: 4, max: 10 }))
               ? findIfAllowedToCreateMoreChats()
               : socket.emit('newChat', 400)
         })()
         function findIfAllowedToCreateMoreChats() {
            userDb.users.findOne({ username: sender })
               .then(data => {
                  (data.chatsCreated >= 5)
                     ? socket.emit("newChat", 403)
                     : createNewChat(body.chatName, data.chatsCreated)
               })
         }
         function createNewChat(chatName, chatsCreated) {
            var chat = {
               chatName: chatName,
               members: [],
               admin: sender
            }
            var newChat = new chatDb.chats(chat)
            newChat.save((err, createdChat) => {
               if (err) {
                  socket.emit("newChat", 500)
               } else {
                  addChatToUserProfile(createdChat._id.toString(), chatsCreated)
               }
            })
         }
         function addChatToUserProfile(chatId, chatsCreated) {
            userDb.users.updateOne({
               username: sender
            }, {
               $addToSet: {
                  chats: chatId,
               },
               chatsCreated: chatsCreated + 1
            }, err => {
               if (err) {
                  socket.emit("newChat", 500)
               } else {
                  socket.emit("newChat", 200)
               }
            })
         }
      } catch (err) {
         socket.emit("newChat", 500)
         console.error(err)
      }
   })


   socket.on('texts', body => {
      try {
         var dbInfo = {
            text: body.text,
            time: body.time,
            sender: sender
         }
         const validate = (() => {
            (
               !validator.contains(body.text, '\\')
               && validator.isLength(body.text + '', { min: 0, max: 170 })
               && validator.isMongoId(body.chatId + '')
               && validator.isLength(body.time + '', { min: 0, max: 14 })
               && validator.isInt(body.time + '')
            )
               ? checkIfSenderHasPremitions()
               : socket.emit('textsResponse', 400)
         })()
         function checkIfSenderHasPremitions() {
            chatDb.chats.findOne({ _id: body.chatId })
               .then(data => {
                  var senderHasPremitons = false
                  for (var element of data.members) {
                     (element === sender)
                        && (senderHasPremitons = true);
                  }
                  (data.admin === sender)
                     && (senderHasPremitons = true);

                  (senderHasPremitons)
                     ? saveTextToDB()
                     : socket.emit('textsResponse', 403)
               })
         }
         function saveTextToDB() {
            chatDb.chats.updateOne(
               { _id: body.chatId },
               { $push: { messages: dbInfo } },
               (err, docs) => {
                  (err)
                     ? socket.emit('textsResponse', 500)
                     : (docs.n === 0)
                        ? socket.emit('textsResponse', 404)
                        : sendSocketMessageToAll()
               })
         }
         function sendSocketMessageToAll() {
            var socketInfo = Object.assign({}, body)
            socketInfo.sender = sender
            
            socket.emit('textsResponse', 200)
            socket.to(body.chatId)
            .emit('texts', socketInfo);
         }
      } catch (err) {
         socket.emit("textsResponse", 500)
         console.error(err)
      }
   });
};