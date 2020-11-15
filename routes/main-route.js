const userdb = require('../database/db_userdata')
const usertoken = userdb.secure.usertoken
const methods = require('../methods')
exports.main = function(request, response) {
//var declaration
    var cookie = request.headers.cookie
//sucurity phase 1
    if (cookie === undefined || cookie === null || cookie === '') {
        response.status(403)
        response.redirect('/login');
    } else {
//sucurity phase 2
        if (cookie.length > 500) {
            response.status(413)
            response.redirect('/login');
         } else {
//sucurity phase 3
            var cookie = methods.cookieParse(request.headers.cookie, 'userId')
            if (cookie === undefined || cookie === null || cookie === '') {
                console.log('denied1')
                response.status(403)
                response.redirect('/login');
            } else {
//sucurity phase 4
                usertoken.find({
                        usertoken: cookie
                    })
                    .then((data) => {
                        if (data == '') {
                            console.log('denied2')
                            response.status(403)
                            response.redirect('/login');
                        } else if (data[0].usertoken == cookie) {
//response
                            username = data[0].username
                            response.status(200)
                            response.render('file.index.ejs', {username: username})                           
                        }
                    })
            }
        }
    }
}