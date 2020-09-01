const database = require('../database')
const usertoken = database.usertoken
const methods = require('../methods')
exports.main = function(request, response){
    var cookie = request.headers.cookie
    if (cookie === undefined || cookie === null || cookie === '') {
            response.send({'response':'success'})
        } else {
            var cookie = methods.cookieParse(request.headers.cookie, 'userId')
            if (cookie === undefined || cookie === null || cookie === '') {
            response.send({'response':'success'})
            } else {
                cookie = Number(cookie)
                console.log(cookie)
                usertoken.findOneAndRemove({usertoken: cookie}, function (err, ){
                    console.log(cookie)
                    if(err){
                        console.log('error')  
                        response.status(400)
                    }
                    else{
                        console.log('success')
                        response.cookie('userId','', { maxAge: 0, httpOnly: true })
                        response.send({'response':'success'})
                        response.status(200)
                    }
                });
            }
        }
} 