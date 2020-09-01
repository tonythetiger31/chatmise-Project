const database = require('../database')
const usertoken = database.usertoken
const methods = require('../methods')
exports.main = function(request, response) { 
    var cookie = request.headers.cookie
    if (cookie === undefined || cookie === null || cookie === '') {
        response.render('Login.ejs')
    } else {
        if (cookie.length > 50) {
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