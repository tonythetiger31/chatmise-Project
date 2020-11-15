//dependencies
const mongoose = require('mongoose');
//variable declaration
var  chat={}

const main =  function(uri){
//db options
mongoose.connect(uri, {
    useNewUrlParser:true,
    useUnifiedTopology:true,
    poolSize: 20,
})
//connection test
mongoose.connection.on('connected', () => {
    console.log('--mongodb successfully connected')
    mongoose.connection.db.listCollections().toArray(function (err, names) {
        names.forEach((element,i)=>{
            if(element.name.includes('chat.')){
               var chatIndex = element.name.indexOf('chat.')+5
               var shortName = element.name.substr(chatIndex)
                chat[shortName] = mongoose.model(element.name, DataSchema);
            }
        })
    })
})
}
//schema
const DataSchema = new mongoose.Schema({
    username: String,
    password: String,
    chats: Array,
    sender: String,
    text: String,
    usertoken: String,
    time: Number,
    settings: Number
})
//model
const secure = {
    users: mongoose.model('users', DataSchema),
    usertoken: mongoose.model('usertoken', DataSchema)
}

module.exports = {main, secure, chat}