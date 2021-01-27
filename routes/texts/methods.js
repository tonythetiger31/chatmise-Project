"use strict"
//module declaration
const chatDb = require('../../database/chat-data')
module.exports = { grabAllThisUserChats }
//functions

function grabAllThisUserChats(data) {//grabs all chat names and texts within those chats pertaining to the user.
  var collections = [],//names of the chats that user is in
    allTextsWithinThisChat = [];//all texts within those chats
  return new Promise((resolve) => {
    data.chats.forEach((element) => {//runs through the chats that that user is in
      chatDb.chats.find({ chatName: element }).then((data2) => {
        collections.push(element)
        allTextsWithinThisChat.push(data2[0].messages)
        return ({
          collections: collections,
          allTextsWithinThisChat: allTextsWithinThisChat
        })
      }).then(() => {
        if (collections.length === data.chats.length) {
          resolve({
            collections: collections,
            allTextsWithinThisChat: allTextsWithinThisChat
          });
        }
      })
    })
  })
}