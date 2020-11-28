const userDb = require('../database/user-data')
const users = userDb.users
var path = require('path')
const methods = require('../methods')
exports.get = function (request, response) {
    //var declaration
        var cookie = request.headers.cookie
    //redirect phase 1
        if (cookie === undefined || cookie === null || cookie === '') {
            response.sendFile(path.join(__dirname + '/../views/resources/signup/index.html'));
        } else {
    //redirect phase 2
            if (cookie.length > 400) {
                response.sendFile(path.join(__dirname + '/../views/resources/signup/index.html'));
            } else {
    //redirect phase 3
                var cookie = methods.cookieParse(request.headers.cookie, 'userId')
                if (cookie === undefined || cookie === null || cookie === '') {
                    response.sendFile(path.join(__dirname + '/../views/resources/signup/index.html'));
                } else {
    //redirect phase 4
    userDb.userToken.find({
                            token: cookie
                        })
                        .then((data) => {
                            if (data == '') {
                                response.sendFile(path.join(__dirname + '/../views/resources/signup/index.html'));
                            } else if (data[0].token == cookie) {
                                response.status(307)
                                response.redirect('/')
                            }
                        })
                }
            }
        }
    }