const userDb = require('../database/user-data')
const methods = require('../methods')
//===============================================================POST
exports.post = (request, response) => {
//variable declaration
    var val = request.body.val
    var user = methods.cookieParse(request.headers.cookie, 'userId')
//find user by token   
userDb.userToken.find({
        token: user
    }).then((data) => {
//update user data
        user = data[0].username
        userDb.users.findOneAndUpdate({
            username: user
        }, {
            settings: val
        }, (err)=> {
//response
            if (err) {
                console.log("Something wrong when updating theme data!");
                response.status(500)
                response.send('something when wrong while updating your preferences')
            }
            response.status(200)
            response.send({ response: 'theme options updated'})
        });
    })
}
//===============================================================GET
exports.get = (request, response) => {
//variable declaration
    var val = request.body.val
    var user = methods.cookieParse(request.headers.cookie, 'userId')
//find user by token
userDb.userToken.find({
        token: user
    }).then((data) => {
//find users theme setting
        user = data[0].username
        userDb.users.find({
                username: user
            })
            .then((data) => {
//response
                info = data[0].settings
                response.status(200)
                response.send({"settings": info})
            })
    })
}