//dependencies
const mongoose = require('mongoose');
//variable declaration
var conn
const main = (()=>{
//db options
conn = mongoose.createConnection(process.env.uriChatData, {
    useNewUrlParser:true,
    useUnifiedTopology:true,
    poolSize: 20
})
})()
//connection test + create chat models
conn.on('connected', () => {
    console.log('--mongoose successfully connected to chatData')
})

//schema
const schema = new mongoose.Schema({
    chatName: String,
    messages: {
        type: [
          "Mixed"
        ]
      },
   members: Array,
   admin: String
})
const chats = conn.model('chats', schema) 
module.exports = {chats}