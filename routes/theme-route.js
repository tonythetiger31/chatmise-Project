const userdb = require('../db_config/db_userdata')
const { response } = require('express')
const users = userdb.users
const usertoken = userdb.usertoken
const methods = require('../methods')
exports.themePost = (request, response) => {
    val = request.body.val
    var user = request.headers.cookie
    user = methods.cookieParse(user, 'userId')
    usertoken.find({
        usertoken: user
    }).then((data) => {
        var user = data[0].username
        console.log('user',user)
    
        users.findOneAndUpdate({username: user}, {settings : val},function(err, doc){
        if(err){
            console.log("Something wrong when updating data!");
        }
        console.log(doc,'doc');
    });
})
    response.send('200')
}
exports.themeGet = (request, response) => {
    val = request.body.val
    var user = request.headers.cookie
    user = methods.cookieParse(user, 'userId')
    usertoken.find({
        usertoken: user
    }).then((data) => {
        var user = data[0].username
        users.find({username: user})
    .then((data) => {
        info = data[0].settings
        response.send({settings: info})
        //console.log('data',data[0].settings)
    })
})
}