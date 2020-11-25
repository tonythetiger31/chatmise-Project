//module declaration
const { response } = require('express');
const userDb = require('./database/user-data')
const bcrypt = require('bcryptjs')
module.exports = {hashComparison, securityCheck3Phase, cookieParse, securityPhase1, securityPhase2, securityPhase3 }
//functions
function cookieParse(cookie, key) {
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
}
function securityPhase1(sender, typeOfHTTPMethod) {
    if (sender == undefined || sender == null || sender == '') {
        console.log('texts ', typeOfHTTPMethod, ' denial phase 1')
        return (false)
    } else {
        return (true)
    }
}
function securityPhase2(sender, typeOfHTTPMethod) {
    if (sender == undefined || sender == null || sender == '') {
        console.log('texts ', typeOfHTTPMethod, ' denial phase 2')
        return (false)
    } else {
        return (true)
    }
}
async function securityPhase3(sender, typeOfHTTPMethod) {
    return new Promise((resolve) => {
        cSender = sender
        userDb.userToken.find({
            token: sender
        })
            .then((data) => {
                if (data == '') {
                    console.log('texts ', typeOfHTTPMethod, ' denial phase 3')
                    resolve(false)
                } else {
                    resolve(data)

                }
            })
    })
}
function securityCheck3Phase(sender, typeOfHTTPMethod) {
    return new Promise((resolve) => {
    //security phase 1    
    if (securityPhase1(sender, typeOfHTTPMethod)) {
        //security phase 2    
             sender = cookieParse(sender, 'userId')
        if (securityPhase2(sender, typeOfHTTPMethod)) {
            //security phase 3
            securityPhase3(sender, typeOfHTTPMethod).then((data)=>{
                
                resolve({ userInfo: data, sender: sender})
            })
        } else {
            resolve (false)
        }
    } else {
        resolve (false)
    }
})
}
function hashComparison(normPw, dbPw) {
    return new Promise((resolve) => {
         bcrypt.compare(normPw, dbPw, (err, result) => { resolve (result)})
    })
}