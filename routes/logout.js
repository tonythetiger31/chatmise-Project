const userDb = require('../database/user-data')
const methods = require('../methods')
exports.main = function(request, response){
//variable declaration
    var cookie = request.headers.cookie
//check 1
    if (cookie === undefined || cookie === null || cookie === '') {
        response.status(200)
        response.send({'response':'success'})
    } else {
//check 2
            var cookie = methods.cookieParse(request.headers.cookie, 'userId')
            if (cookie === undefined || cookie === null || cookie === '') {
                response.status(200)
                response.send({'response':'success'})
            } else {
//check 3
userDb.userToken.deleteOne({token: cookie}, (err, result)=>{
                    if(err){
                        console.log('error removing user token')  
                        response.status(200)
                        response.send({'response':'success'})
                    }
                    else {
                        response.cookie('userId','', { maxAge: 0, httpOnly: true })
                        response.status(200)
                        response.send({'response':'success'})
                    }
                });
            }
        }
} 