const database = require('./database')
const { response } = require('express')
const DataPost = database.DataPost
exports.themeset = (request, response) => {
    val = request.body.val
    user = request.body.user
console.log('body',request.body)
console.log('user',user)
    DataPost.findOneAndUpdate({username: user}, {settings : val},function(err, doc){
        if(err){
            console.log("Something wrong when updating data!");
        }
        console.log(doc,'doc');
    });
    response.send('200')
}
exports.themeget = (request, response) => {
    user = request.body.user
    DataPost.find({username: user})
    .then((data) => {
        info = data[0].settings
        response.send({settings: info})
        console.log('data',data[0].settings)
    })
}