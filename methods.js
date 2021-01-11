//module declaration
const { response } = require('express');
const userDb = require('./database/user-data')
const bcrypt = require('bcryptjs')
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
    securityPhase1 = (sender, typeOfHTTPMethod) => {
        if (sender == undefined || sender == null || sender == '') {
            console.log('texts ', typeOfHTTPMethod, ' denial phase 1')
            return (false)
        } else {
            return (true)
        }
    },
    securityPhase2 = (sender, typeOfHTTPMethod) => {
        if (sender == undefined || sender == null || sender == '') {
            console.log('texts ', typeOfHTTPMethod, ' denial phase 2')
            return (false)
        } else {
            return (true)
        }
    },
    securityPhase3 = async (sender, typeOfHTTPMethod) => {
        return new Promise((resolve) => {
            cSender = sender
            userDb.userToken.findOne({
                token: sender
            })
                .then((data) => {
                    if (data === null) {
                        console.log('texts ', typeOfHTTPMethod, ' denial phase 3')
                        resolve(false)
                    } else {
                        resolve(data)

                    }
                })
        })
    },
    securityCheck3Phase = (sender, typeOfHTTPMethod) => {
        return new Promise((resolve) => {
            //security phase 1    
            if (securityPhase1(sender, typeOfHTTPMethod)) {
                //security phase 2    
                sender = cookieParse(sender, 'userId')
                if (securityPhase2(sender, typeOfHTTPMethod)) {
                    //security phase 3
                    securityPhase3(sender, typeOfHTTPMethod).then((data) => {

                        resolve({ userInfo: data, sender: sender })
                    })
                } else {
                    resolve(false)
                }
            } else {
                resolve(false)
            }
        })
    },
    hashComparison = (normPw, dbPw) => {
        return new Promise((resolve) => {
            bcrypt.compare(normPw, dbPw, (err, result) => { resolve(result) })
        })
    },
    sanitize = (arr, maxLength) => {
        try {
            var bool
            arr.forEach((element)=>{
                if (element.length > maxLength || typeof element !== 'string') {
                    bool = true
                }
            });
            if (bool) {
                return false
            }
            return true
        } catch (err) {
            return false
        }
    }
module.exports = { hashComparison, securityCheck3Phase, cookieParse, securityPhase1, securityPhase2, securityPhase3, sanitize }
