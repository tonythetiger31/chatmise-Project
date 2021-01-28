const userDb = require('../database/user-data')
const users = userDb.users
var path = require('path')
const methods = require('../methods')
exports.get = function (req, res) {
    //var declaration
        var cookie = req.headers.cookie
    //redirect phase 1
        if (cookie === undefined || cookie === null || cookie === '') {
            res.sendFile(path.join(__dirname + '/../views/resources/signup/index.html'));
        } else {
    //redirect phase 2
            if (cookie.length > 400) {
                res.sendFile(path.join(__dirname + '/../views/resources/signup/index.html'));
            } else {
    //redirect phase 3
                var cookie = methods.cookieParse(req.headers.cookie, 'userId')
                if (cookie === undefined || cookie === null || cookie === '') {
                    res.sendFile(path.join(__dirname + '/../views/resources/signup/index.html'));
                } else {
    //redirect phase 4
    userDb.userToken.findOne({
                            token: cookie
                        })
                        .then((data) => {
                            if (data == '') {
                                res.sendFile(path.join(__dirname + '/../views/resources/signup/index.html'));
                            } else if (data.token == cookie) {
                                res.status(307)
                                res.redirect('/')
                            }
                        })
                }
            }
        }
    }