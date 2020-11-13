const userdb = require('../database/db_userdata')
const usertoken = userdb.secure.usertoken
const users = userdb.secure.users
const methods = require('../methods')
//===============================================================GET
exports.get = function(request, response) {
//var declaration
    var cookie = request.headers.cookie
//redirect phase 1
    if (cookie === undefined || cookie === null || cookie === '') {
        response.render('file.Login.ejs')
    } else {
//redirect phase 2
        if (cookie.length > 400) {
            response.render('file.Login.ejs')
        } else {
//redirect phase 3
            var cookie = methods.cookieParse(request.headers.cookie, 'userId')
            if (cookie === undefined || cookie === null || cookie === '') {
                response.render('file.Login.ejs')
            } else {
//redirect phase 4
                usertoken.find({
                        usertoken: cookie
                    })
                    .then((data) => {
                        if (data == '') {
                            response.render('file.Login.ejs')
                        } else if (data[0].usertoken == cookie) {
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
//var decleration
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
                if (data[0].password === password) {
//token assignment
                    let userId = Math.random()
                    var datadb = {
                        usertoken: userId,
                        username: username
                    }
                    var newusertoken = new usertoken(datadb);
                    newusertoken.save((error) => {
                        if (error) {
                            console.log('somthing happened witht the db')
                            response.status(500)
                            response.send('problem loging you in')
                        } else {
                            response.status(202)
                            response.cookie('userId',userId, { maxAge: 302400000, httpOnly: true})
                            response.send('You are now logedin')
                            console.log(request.body.username, 'loged in')
                        }
                    })
                } else {
                    response.status(403)
                    response.send('Wrong password or Username')
                }
            }
        })
    }
}