"use strict"
//module decleration
const { users } = require('../../db_config/db_userdata'),
    userdb = require('../../db_config/db_userdata'),
    flores = userdb.flores,
    theboys = userdb.theboys,
    usertoken = userdb.usertoken,
    methods = require('../../methods');
module.exports = { grabAllUserInfo }
//funtions
function grabAllUserInfo(data) {
    var collections = [],
        allTextsForThisUser = [];
    return new Promise((resolve) => {
        data[0].chats.forEach((element) => {
            eval(element).find({}).then((data2) => {
                collections.push(element)
                allTextsForThisUser.push(data2)
                return ({
                    collections: collections,
                    allTextsForThisUser: allTextsForThisUser
                })
            }).then(() => {
                if (collections.length === data[0].chats.length) {
                    resolve({
                        collections: collections,
                        allTextsForThisUser: allTextsForThisUser
                    });
                }
            })
        })
    })
}
