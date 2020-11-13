"use strict"
//module decleration
const { users } = require('../../database/db_userdata'),
    userdb = require('../../database/db_userdata'),
    methods = require('../../methods');
module.exports = { chat, grabAllThisUserChats }
//funtions
function grabAllThisUserChats(data) {//grabs all chat names and texts within those chats pertaining to the user.
    var collections = [],//names of the chats that user is in
        allTextsWithinThisChat = [];//all texts within those chats
    return new Promise((resolve) => {
        data[0].chats.forEach((element) => {//runs through the chats that that user is in
            userdb.chat[element].find({}).then((data2) => {
                collections.push(element)
                allTextsWithinThisChat.push(data2)
                return ({
                    collections: collections,
                    allTextsWithinThisChat: allTextsWithinThisChat
                })
            }).then(() => {
                if (collections.length === data[0].chats.length) {
                    resolve({
                        collections: collections,
                        allTextsWithinThisChat: allTextsWithinThisChat
                    });
                }
            })
        })
    })
}
var chat = {
    documentCount: null,
    countDocumentsInterval: function () {
        choose.countDocuments(function (err, count) {
            if (err) {
                console.log("there was a err at texts-methods/ chat.countDocument")
            } else {
                this.documentCount = count
            }
        })
    }
    
}