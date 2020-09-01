const database = require('../database')
const usertoken = database.usertoken
const methods = require('../methods')
exports.main = function(request, response) {
    var cookie = request.headers.cookie
    if (cookie === undefined || cookie === null || cookie === '') {
        response.status(403)
        response.redirect('/login');
    } else {
        if (cookie.length > 50) {
            response.redirect('/login');
         } else {
            var cookie = methods.cookieParse(request.headers.cookie, 'userId')
            if (cookie === undefined || cookie === null || cookie === '') {
                console.log('denied1')
                response.status(403)
                response.redirect('/login');
            } else {
                usertoken.find({
                        usertoken: cookie
                    })
                    .then((data) => {
                        if (data == '') {
                            console.log('denied2')
                            response.status(403)
                            response.redirect('/login');
                        } else if (data[0].usertoken == cookie) {
                            username = data[0].username
                            response.render('index.ejs', {username: username})
                            response.status(200)
                        }
                    })
            }
        }
    }
}