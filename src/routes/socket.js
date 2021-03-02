"use strict"
const
   chatDb = require('../database/chat-data'),
   userDb = require('../database/user-data'),
   methods = require('../methods')
   const ERR_MSG = "Something wrong when updating theme data!"
//===============================================================SOCKETS
exports.sockets = function sockets(socket) {
   var sender
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
            .then(allChatsTexts => {
               joinSocketRooms(allChatsTexts, user)
            });
      }
      function joinSocketRooms(allChatsTexts, user) {
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
         sendDataToUser(allChatsTexts, user, roomUserCount);
      }
      function sendDataToUser(allChatsTexts, user, roomUserCount) {
         console.log(roomUserCount, "--------------")
         var allRoomUserCount = []
         user.chats.forEach((element, i) => {
            allRoomUserCount.push({
               chat: element,
               count: roomUserCount[i]
            })
         });
         socket.emit("allTexts", {
            userCount: allRoomUserCount,
            collections: user.chats,
            data: allChatsTexts,
            username: user.username,
            settings: user.settings
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
               socket.to(element).emit('userCount', { chat: element, userCount: allRooms[i][1].size - 1 });
            }
         })
      })
   })
   socket.on('settings',(body)=>{
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
   socket.on('texts', (body) => {
      var textInfo = {
         text: body.text,
         time: body.time,
         sender: sender
      }
      const validate = (() => {
         var textIsValid = methods.validate.input([body.text], 170, "string")
         var chatIsValid = methods.validate.input([body.chat], 20, "string")
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
               if (element.includes(body.chat)) {
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
            chatName: body.chat
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