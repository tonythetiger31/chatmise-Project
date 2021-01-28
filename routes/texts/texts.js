"use strict"
const
   chatDb = require('../../database/chat-data'),
   userDb = require('../../database/user-data'),
   methods = require('../../methods'),
   textsMethods = require('./methods');
//===============================================================SOCKETS
exports.sockets = function sockets(socket) {
   var sender
   //===================ON CONNECTION 
   var tokenSecurity = (() => {
      //checks that token is valid
      return new Promise((resolve) => {
         var cookie = socket.handshake.headers.cookie;
         methods.handleCookie(cookie).then((data) => {
            if (data === null) {
               socket.emit("allTexts", 'invalid credentials');
               socket.disconnect(true)
               resolve(null)
            } else {
               sender = data.username
               resolve(data)
            };
         });
      })
   })()
      .then(data => {
         //get user chat and text info
         return new Promise((resolve) => {
            userDb.users.findOne({
               username: data.username
            }).then((data2) => {
               textsMethods.grabAllThisUserChats(data2)
                  .then(data3 => {
                     resolve({
                        texts: data3,
                        user: data
                     });
                  });
            });
         });
      })
      .then(data => {
         //join socket rooms
         return new Promise((resolve) => {
            data.texts.collections.forEach(element => {
               socket.join(element);

               let allRooms = Array.from(socket.adapter.rooms)
               allRooms.forEach((element1, i) => {
                  let allRooms = Array.from(socket.adapter.rooms)
                  if (allRooms[i].includes(element)) {
                     socket.to(element).emit('userCount', {
                        chat: element,
                        userCount: allRooms[i][1].size
                     });
                  }
               })
            });
            resolve(data);
         });
      })
      .then(data => {
         //send data to user
         var userCount = []
         data.texts.collections.forEach(element => {
            let allRooms = Array.from(socket.adapter.rooms)
            allRooms.forEach((element1, i) => {
               if (allRooms[i].includes(element)) {
                  userCount.push({ chat: element, count: allRooms[i][1].size })
               }
            })
         })
         socket.emit("allTexts", {
            userCount: userCount,
            collections: data.texts.collections,
            data: data.texts.allTextsWithinThisChat,
            username: data.user.username
         });
      });
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