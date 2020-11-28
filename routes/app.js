const userDb = require('../database/user-data')
const methods = require('../methods')
var path = require('path');
exports.main = function(request, response) {
//var declaration
    var cookie = request.headers.cookie
//security phase 1
    if (cookie === undefined || cookie === null || cookie === '') {
        response.status(403)
        response.sendFile(path.join(__dirname + '/../views/home/index.html'));
    } else {
//security phase 2
        if (cookie.length > 500) {
            response.status(413)
            response.sendFile(path.join(__dirname + '/../views/home/index.html'));
         } else {
//security phase 3
            var cookie = methods.cookieParse(request.headers.cookie, 'userId')
            if (cookie === undefined || cookie === null || cookie === '') {
                console.log('denied1')
                response.status(403)
                response.sendFile(path.join(__dirname + '/../views/home/index.html'));
            } else {
//security phase 4
userDb.userToken.find({
                        token: cookie
                    })
                    .then((data) => {
                        if (data == '') {
                            console.log('denied2')
                            response.status(403)
                            response.redirect('/login');
                        } else if (data[0].token == cookie) {
//response
                            username = data[0].username
                            response.status(200)
                            response.render(__dirname + '/../views/resources/app/index.ejs', {username: username})                           
                        }
                    })
            }
        }
    }
}