
//module declaration
const userDb = require('./database/user-data')
const chatDb = require('./database/chat-data')
const { response } = require('express');
const bcrypt = require('bcryptjs')
var path = require('path');
//functions
const
   cookieParse = (cookie, key) => {
      try {
         str = cookie.replace(/\s+/g, "")
         cA = str.split(/[;=]+/);
         cB = cA.indexOf(key)
         if (cB === -1) {
            return (null)
         } else {
            cB += 1
            cB = cA[cB]
            cB = cB.toString()
            return (cB)
         }
      } catch (err) {
         return (null)
      }
   },
   hashComparison = (normPw, dbPw) => {
      return new Promise((resolve) => {
         bcrypt.compare(normPw, dbPw, (err, result) => { resolve(result) })
      })
   },
   pageNotFound = (req, res) => {
      res.send('<h1>404 Page Not Found :(</h1>').status(404)
   },
   grabAllThisUserChats = (chatIds) => {
      return new Promise((resolve) => {
         var allChatsTexts = [],
            chatNames = []
         findAllChatsAndReturn = (async () => {
            for (let element of chatIds) {
               await chatDb.chats.findOne({ _id: element })
                  .then((data) => {
                     allChatsTexts.push(data.messages)
                     chatNames.push(data.chatName)
                     if (chatNames.length === chatIds.length) {
                        resolve({
                           "allChatsTexts": allChatsTexts,
                           "chatNames": chatNames
                        });
                     }
                  })
            }
         })()
      })
   },
   validate = {
      "cookie": (arg, maxLength) => {
         //limit max length && deny ! string
         try {
            if (typeof arg === 'string' && arg.length < maxLength) {
               return true
            }
            return false
         } catch (err) {
            return false
         }
      },
      "input": (arr, maxLength, type) => {
         try {
            var badInput
            arr.forEach((element) => {
               if (typeof element !== type || element.length > maxLength || element.length < 1) {
                  badInput = true
               }
            });
            if (badInput) {
               return false
            }
            return true
         } catch (err) {
            console.log(err)
            return false
         }
      }
   },
   handleCookie = (cookie) => {
      return new Promise((resolve) => {
         validateWholeCookie()
         function validateWholeCookie() {
            if (cookie === undefined) {
               resolve(null)
            } else if (validate.cookie(cookie, 400)) {
               parseCookie()
            } else {
               resolve(null)
            }
         }
         function parseCookie() {
            cookie = cookieParse(cookie, 'userId')
            validateParsedCookie()
         }
         function validateParsedCookie() {
            if (validate.cookie(cookie, 50)) {
               checkCookie()
            } else {
               resolve(null)
            }
         }
         function checkCookie() {
            userDb.userToken.findOne({
               token: cookie
            })
               .then((data) => {
                  resolve(data)
               })
         }
      })
   }
module.exports = {
   hashComparison, cookieParse, pageNotFound,
   validate, handleCookie, grabAllThisUserChats
}