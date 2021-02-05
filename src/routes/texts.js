"use strict"
const
   chatDb = require('../database/chat-data'),
   userDb = require('../database/user-data'),
   methods = require('../methods')
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
               console.log(allChatsTexts, "allChatsTexts")
               joinSocketRooms(allChatsTexts, user)
            });
      }
      function joinSocketRooms(allChatsTexts, user) {
         var roomUserCount = []
         user.chats.forEach(element => {
            socket.join(element);
            var allRooms = Array.from(socket.adapter.rooms)
            allRooms.forEach((element1, i) => {
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
            username: user.username
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
socket.on('texts', (body) => { 
   if (Object.keys(body).length !== 0) {
      var chat = body.chat
      console.log('new transmission', sender, body)
      if (chat != '' || chat != undefined || chat != null) {
         let wsRooms = Array.from(socket.adapter.rooms)
         wsRooms.forEach((element, i) => {
            if (wsRooms[i].includes(chat)) {
               let specificWsRoom = Array.from(wsRooms[i][1])
               if (specificWsRoom.includes(socket.id)) {
                  //start
                  var dataDb = {
                     text: body.text,
                     time: body.time,
                     sender: sender
                  },
                  socketSend = {
                     text: body.text,
                     time: body.time,
                     sender: sender,
                     chat: chat
                  }
                  socket.to(chat).emit('text', socketSend);
                  chatDb.chats.updateOne({
                     chatName: chat
                  }, { $push: { messages: dataDb } }, (err) => {
                     if (err) {
                        console.log('something happened with the db -texts');
                     } else {
                        console.log('text saved')
                     }

                  })
                  //end
               }
            }
         })

      }
   }
});

};
