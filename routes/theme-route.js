const userdb = require('../db_config/db_userdata')
const users = userdb.users
const usertoken = userdb.usertoken
const methods = require('../methods')
//===============================================================POST
exports.post = (request, response) => {
//variable decleration
    var val = request.body.val
    var user = methods.cookieParse(request.headers.cookie, 'userId')
//find user by token   
    usertoken.find({
        usertoken: user
    }).then((data) => {
//update user data
        user = data[0].username
        users.findOneAndUpdate({
            username: user
        }, {
            settings: val
        }, function(err, doc) {
//response
            if (err) {
                console.log("Something wrong when updating theme data!");
                response.status(500)
                response.send('somthing when wrong while updating your prefrences')
            }
            response.status(200)
            response.send({ response: 'theme options updated'})
        });
    })
}
//===============================================================GET
exports.get = (request, response) => {
//varibale decleration
    var val = request.body.val
    var user = methods.cookieParse(request.headers.cookie, 'userId')
//find user by token
    usertoken.find({
        usertoken: user
    }).then((data) => {
//find users theme setting
        user = data[0].username
        users.find({
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