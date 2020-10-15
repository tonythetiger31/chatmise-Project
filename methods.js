//module decleration
const { response } = require('express');
const userdb = require('./db_config/db_userdata')
const usertoken = userdb.usertoken
//funcitons
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
        response.status(401)
        response.send({ 'redirect': 'true' })
        return (false)

    } else {
        return (true)
    }
}
function sucurityPhase2(sender, typeOfHTTPMethod) {
    if (sender == undefined || sender == null || sender == '') {
        console.log('texts ', typeOfHTTPMethod, ' denial phase 2')
        response.status(401)
        response.send({ 'redirect': 'true' })
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
                    response.status(403)
                    response.send({ 'redirect': 'true' })
                    resolve(false)
                } else {
                    resolve(data)

                }
            })
    })
}
module.exports = { cookieParse, sucurityPhase1, sucurityPhase2, sucurityPhase3 }