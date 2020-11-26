/*
WARNING
-if the user is trying to communicate with another tab on the same browser, no data will be sent
-if the user is on two devices, the devices won't be able to communicate
-only different users on separate devices will be able to communicate
*/
"use strict"
const
    chatDb = require('../../database/chat-data'),
    userDb = require('../../database/user-data'),
    methods = require('../../methods'),
    textsMethods = require('./texts-methods');
// const textMethods = require('texts-route')

module.exports = { sockets }

//===============================================================SOCKETS
function sockets(socket) {
    var sender
    //===================ON CONNECTION 
    console.log('made socket connection')
    var tokenSecurity = (() => {
        //checks that token is valid
        return new Promise((resolve) => {
            var cookie = socket.handshake.headers.cookie;
            methods.securityCheck3Phase(cookie, 'GET').then((data) => {
                if (data == false) {
                    socket.emit("allTexts", 'invalid credentials');
                    socket.disconnect(true)
                    resolve(null)
                } else if (data.userInfo[0].token == data.sender) {
                    sender = data.userInfo[0].username
                    resolve(data)
                };
            });
        })
    })()
        .then(data => {
            //get user chat and text info
            return new Promise((resolve) => {
                userDb.users.find({
                    username: data.userInfo[0].username
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
            //send data to user
            return new Promise((resolve) => {
                socket.emit("allTexts", {
                    collections: data.texts.collections,
                    data: data.texts.allTextsWithinThisChat,
                    username: data.user.userInfo[0].username //FIX THIS!!!!!!
                });
                resolve(data);
            });
        })
        .then(data => {
            //join socket rooms
            data.texts.collections.forEach(element => {
                socket.join(element);
            });
        });
    //===================SOCKET EVENTS
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
                            chatName:chat
                      }, {$push: { messages: dataDb }},(err) =>{
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