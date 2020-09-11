const userdb = require('../db_config/db_userdata')
const usertoken = userdb.usertoken
const users = userdb.users
const methods = require('../methods')
exports.get = function(request, response) { 
    var cookie = request.headers.cookie
    if (cookie === undefined || cookie === null || cookie === '') {
        response.render('Login.ejs')
    } else {
        if (cookie.length > 400) {
            response.render('Login.ejs')
        } else {
            var cookie = methods.cookieParse(request.headers.cookie, 'userId')
            
            if (cookie === undefined || cookie === null || cookie === '') {
                response.render('Login.ejs')
            } else {
                usertoken.find({
                        usertoken: cookie
                    })
                    .then((data) => {
                        if (data == '') {
                            response.render('Login.ejs')
                        } else if (data[0].usertoken == cookie) {
                            response.redirect('/')
                        }
                    })
            }
        }
    }
}
exports.post = function(request, response) { 
    var username = request.body.username
    var password = request.body.password
    console.log(request.body)
    if (request.body.username.length > 25
        || request.body.password.length > 25){
            response.send('one or multiple of your inputs was too long, max size is 25 characters')
        }else{
            users.find({
            username: username
        })
        .then((data) => {
            if (data == '') {
                response.send('Wrong password or Username')
            } else {
                if (data[0].password === password) {
                    let userId = Math.random()
                    var datadb = {
                        usertoken: userId,
                        username: username
                    }
                    var newusertoken = new usertoken(datadb);
                    newusertoken.save((error) => {
                        if (error) {
                            console.log('somthing happened witht the db')
                        } else {
                            response.cookie('userId',userId, { maxAge: 302400000, httpOnly: true })
                            response.send('You are now logedin')
                            console.log('user loged in')
                            console.log(userId)
                        }
                    })
                } else {
                    response.send('Wrong password or Username')
                }
            }
        })
    }
}