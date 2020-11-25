//dependencies
const mongoose = require('mongoose');
//variable declaration
var conn
const main =  (()=>{
//db options
conn = mongoose.createConnection(process.env.uriUserData, {
    useNewUrlParser:true,
    useUnifiedTopology:true,
    poolSize: 20,
})
})()
//connection
conn.on('connected', () => {
    console.log('--mongodb successfully connected to userData')
})
//schema
const schema = new mongoose.Schema({
    username: String,
    password: String,
    chats: Array,
    token: String,
    settings: Number
})
//model
const
    users = conn.model('users', schema),        
    userToken = conn.model('usertokens', schema)

module.exports = { users, userToken}