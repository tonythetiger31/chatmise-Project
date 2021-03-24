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
      const handleCookieLogic = (() => {
         var cookie = socket.handshake.headers.cookie;
         methods.handleCookie(cookie).then((user) => {
            if (user === null) {
               socket.emit("allTexts", 'invalid credentials');
               socket.disconnect(true)
            } else {
               sender = user.username
               findUserInfo(user)
            };
         });
      })()
      function findUserInfo(user) {
         userDb.users.findOne({
            username: user.username
         }).then((userInfo) => {
            getAllChatsTexts(userInfo)
         })
      }
      function getAllChatsTexts(user) {
         methods.grabAllThisUserChats(user.chats)
            .then(data => {
               joinSocketRooms({
                  "allChatsTexts": data.allChatsTexts,
                  "chatName": data.chatNames,
                  "members": data.members,
                  "admins": data.admins
               }, user)
            });
      }
      function joinSocketRooms(chatInfo, user) {
         var roomUserCount = []
         user.chats.forEach(element => {
            socket.join(element);
            var allRooms = Array.from(socket.adapter.rooms)
            allRooms.forEach((_, i) => {
               if (allRooms[i].includes(element)) {
                  roomUserCount.push(allRooms[i][1].size)
                  socket.to(element).emit('userCount', {
                     chat: element,
                     userCount: allRooms[i][1].size
                  });
               }
            })
         });
         sendDataToUser(chatInfo, user, roomUserCount);
      }
      function sendDataToUser(chatInfo, user, roomUserCount) {
         console.log(roomUserCount, "--------------")
         var allRoomUserCount = []
         user.chats.forEach((element, i) => {
            allRoomUserCount.push({
               chat: element,
               count: roomUserCount[i]
            })
         });
         socket.emit("allTexts", {
            "chatNames": chatInfo.chatName,
            "data": chatInfo.allChatsTexts,
            "members": chatInfo.members,
            "admins": chatInfo.admins,
            "chatIds": user.chats,
            "username": user.username,
            "settings": user.settings,
            "userCount": allRoomUserCount
         });
      }
   })()
   //===================SOCKET EVENTS  
   socket.on('disconnecting', () => {
      var userRooms = Array.from(socket.rooms)
      var allRooms = Array.from(socket.adapter.rooms)
      userRooms.forEach((element) => {
         allRooms.forEach((element1, i) => {
            if (allRooms[i].includes(element)) {
               socket.to(element).emit('userCount', {
                  chat: element,
                  userCount: allRooms[i][1].size - 1
               });
            }
         })
      })
   })

   socket.on('settings', (body) => {
      userDb.users.findOneAndUpdate({
         username: sender
      }, {
         settings: body.settings
      }, (err) => {
         if (err) {
            console.log(ERR_MSG);
         }
      })
   })

   socket.on('invite', (body) => {
      try {
         const validate = (() => {
            (validator.isMongoId(body.chatId + '')
               && validator.isAlphanumeric(body.invitee + '')
               && validator.isLength(body.invitee + '', { min: 0, max: 10 })
               && !validator.equals(sender, body.invitee + ''))
               ? checkIfSenderIsAdmin()
               : socket.emit('invite', 400)
         })()
         function checkIfSenderIsAdmin() {
            chatDb.chats.findOne({ _id: body.chatId })
               .then(data => {
                  (!data || data.admin !== sender) ?
                     socket.emit('invite', 400) :
                     (data.admin === sender) &&
                     pushInviteToInvitee();
               })
         }
         function pushInviteToInvitee() {
            userDb.users.updateOne({ "username": body.invitee },
               { $addToSet: { "invites": body.chatId } },
               (err, docs) => {
                  (err) ?
                     socket.emit('invite', 500) :
                     (docs.n === 0) ? //not found
                     socket.emit('invite', 404) :
                     (docs.nModified === 0) ? //aleady invited
                     socket.emit('invite', 409) :
                     socket.emit('invite', 200)
               }
            )
         }
      } catch (err) {
         socket.emit('invite',500)
         console.error(err)
      }
   })

   //new chat endpoint
   socket.on('newChat', (body) => {
      const findIfAllowedToCreateMoreChats = (() => {
         userDb.users.findOne({ username: sender })
            .then(data => {
               if (data.chatsCreated >= 5) {
                  socket.emit("newChat", 400)
               } else {
                  validate(data.chatsCreated)
               }
            })
      })()
      function validate(chatsCreated) {
         var chatNameIsValid = methods.validate.input([body.chatName], 10, "string")
         if (chatNameIsValid) {
            createNewChat(body.chatName, chatsCreated)
         }
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
               console.log('something happened with the db')
               socket.emit("newChat", 500)
            } else {
               addChatToUserProfile(createdChat._id, chatsCreated)
            }
         })
      }
      function addChatToUserProfile(chatId, chatsCreated) {
         userDb.users.updateOne({
            username: sender
         }, {
            $push: {
               chats: chatId,
            },
            chatsCreated: chatsCreated + 1
         }, err => {
            if (err) {
               console.log('something happened with the db')
               socket.emit("newChat", 500)
            } else {
               socket.emit("newChat", 200)
            }
         })
      }
   })


   socket.on('texts', (body) => {
      var textInfo = {
         text: body.text,
         time: body.time,
         sender: sender
      }
      const validate = (() => {
         var textIsValid = methods.validate.input([body.text], 170, "string")
         var chatIsValid = methods.validate.input([body.chat], 40, "string")
         var timeIsValid = methods.validate.input([body.time.toString()], 14, "string")
         if (textIsValid && chatIsValid && timeIsValid) {
            console.log('new transmission', sender, body)
            checkIfChatRoomIsValid()
         } else {
            console.log("someone tryna hack")
            socket.disconnect(true)
         }
      })()
      function checkIfChatRoomIsValid() {
         var validChatRoom
         const chatRoomFound = () => {
            var wsRooms = Array.from(socket.adapter.rooms)
            for (var element of wsRooms) {
               if (element.toString().includes(body.chat)) {
                  validChatRoom = element
                  return true
               }
            }
            return false
         }
         if (chatRoomFound()) {
            checkIfUserHasAccessToChatRoom(validChatRoom)
         } else {
            console.log("someone tryna hack2")
            socket.disconnect(true)
         }
      }
      function checkIfUserHasAccessToChatRoom(validChatRoom) {
         var specificWsRoom = Array.from(validChatRoom[1])
         if (specificWsRoom.includes(socket.id)) {
            saveTextToDB()
         } else {
            console.log("someone tryna hack3")
            socket.disconnect(true)
         }
      }
      function saveTextToDB() {
         chatDb.chats.updateOne({
            _id: body.chat
         }, { $push: { messages: textInfo } }, (err) => {
            if (err) {
               console.log('something happened with the db -texts');
            } else {
               console.log('text saved')
               sendSocketMessageToAll()
            }
         })
      }
      function sendSocketMessageToAll() {
         textInfo.chat = body.chat
         socket.to(body.chat).emit('text', textInfo);
      }
   });
};