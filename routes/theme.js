const database = require('../database')
const { response } = require('express')
const DataPost = database.DataPost
const usertoken = database.usertoken
const methods = require('../methods')
exports.themeset = (request, response) => {
    val = request.body.val
    var user = request.headers.cookie
    user = methods.cookieParse(user, 'userId')
    console.log(user)
    usertoken.find({
        usertoken: user
    }).then((data) => {
        var user = data[0].username
        console.log('user',user)
    
    DataPost.findOneAndUpdate({username: user}, {settings : val},function(err, doc){
        if(err){
            console.log("Something wrong when updating data!");
        }
        console.log(doc,'doc');
    });
})
    response.send('200')
}
exports.themeget = (request, response) => {
    val = request.body.val
    var user = request.headers.cookie
    user = methods.cookieParse(user, 'userId')
    console.log(user)
    usertoken.find({
        usertoken: user
    }).then((data) => {
        var user = data[0].username
    DataPost.find({username: user})
    .then((data) => {
        info = data[0].settings
        response.send({settings: info})
        console.log('data',data[0].settings)
    })
})
}