//dependencies
const mongoose = require('mongoose');
//variable declaration
var chat = {}
var conn
const main = (()=>{
//db options
conn = mongoose.createConnection(process.env.uriChatData, {
    useNewUrlParser:true,
    useUnifiedTopology:true,
    poolSize: 20,
})
})()
//connection test + create chat models
conn.on('connected', () => {
    console.log('--mongodb successfully connected to chatData')
    conn.db.listCollections().toArray(function (err, names) {
        names.forEach((element,i)=>{
                chat[element.name] = conn.model(element.name, schema);
        })
    })
})
//schema
const schema = new mongoose.Schema({
    sender: String,
    text: String,
    time: Number,
})
module.exports = {chat}