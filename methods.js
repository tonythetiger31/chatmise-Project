//module decleration
const { response } = require('express');
const userdb = require('./database/db_userdata')
const usertoken = userdb.secure.usertoken
module.exports = { sucurityCheck3Phase, cookieParse, sucurityPhase1, sucurityPhase2, sucurityPhase3 }
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
function sucurityPhase1(sender, typeOfHTTPMethod) {
    if (sender == undefined || sender == null || sender == '') {
        console.log('texts ', typeOfHTTPMethod, ' denial phase 1')
        return (false)
    } else {
        return (true)
    }
}
function sucurityPhase2(sender, typeOfHTTPMethod) {
    if (sender == undefined || sender == null || sender == '') {
        console.log('texts ', typeOfHTTPMethod, ' denial phase 2')
        return (false)
    } else {
        return (true)
    }
}
async function sucurityPhase3(sender, typeOfHTTPMethod) {
    return new Promise((resolve) => {
        cSender = sender
        usertoken.find({
            usertoken: sender
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
function sucurityCheck3Phase(sender, typeOfHTTPMethod) {
    return new Promise((resolve) => {
    //sucurity phase 1    
    if (sucurityPhase1(sender, typeOfHTTPMethod)) {
        //sucurity phase 2    
             sender = cookieParse(sender, 'userId')
        if (sucurityPhase2(sender, typeOfHTTPMethod)) {
            //sucurity phase 3
            sucurityPhase3(sender, typeOfHTTPMethod).then((data)=>{
                
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