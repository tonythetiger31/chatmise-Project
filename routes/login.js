const userDb = require('../database/user-data')
const users = userDb.users
const methods = require('../methods')
const cryptoRandomString = require('crypto-random-string')
//===============================================================GET
exports.get = function(request, response) {
//var declaration
    var cookie = request.headers.cookie
//redirect phase 1
    if (cookie === undefined || cookie === null || cookie === '') {
        response.render(__dirname + '/../views/resources/login/client.ejs')
    } else {
//redirect phase 2
        if (cookie.length > 400) {
            response.render(__dirname + '/../views/resources/login/client.ejs')
        } else {
//redirect phase 3
            var cookie = methods.cookieParse(request.headers.cookie, 'userId')
            if (cookie === undefined || cookie === null || cookie === '') {
                response.render(__dirname + '/../views/resources/login/client.ejs')
            } else {
//redirect phase 4
userDb.userToken.find({
                        token: cookie
                    })
                    .then((data) => {
                        if (data == '') {
                            response.render(__dirname + '/../views/resources/login/client.ejs')
                        } else if (data[0].token == cookie) {
                            response.status(307)
                            response.redirect('/')
                        }
                    })
            }
        }
    }
}
//===============================================================POST
exports.post = function(request, response) { 
//var declaration
    var username = request.body.username,
        password = request.body.password;
//login phase 1
    if (request.body.username.length > 25
        || request.body.password.length > 25){
            response.status(413)
            response.send('one or multiple of your inputs was too long, max size is 25 characters')
        }else{
//login phase 2
            users.find({
            username: username
        })
        .then((data) => {
            if (data == '') {
                response.status(403)
                response.send('Wrong password or Username')
                //login phase 3
            } else {
                methods.hashComparison(password, data[0].password).then((data2) => { 
                if (data2 === true) {
                    //token assignment 
                    let userId = cryptoRandomString({ length: 20, type: 'alphanumeric' });
                    var dataDb = {
                        token: userId,
                        username: username
                    }
                    var newToken = new userDb.userToken(dataDb);
                    newToken.save((error) => {
                        if (error) {
                            console.log('something happened with the db')
                            response.status(500)
                            response.send('problem logging you in')
                        } else {
                            response.status(202)
                            response.cookie('userId', userId, { maxAge: 302400000, httpOnly: true, sameSite: 'Strict' })
                            response.send('You are now loggedIn')
                            console.log(request.body.username, 'logged in')
                        }
                    })
                } else {
                    response.status(403)
                    response.send('Wrong password or Username')
                }
            })
            }
        })
    }
}





