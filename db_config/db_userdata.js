const mongoose = require('mongoose');
const main =  function(uri){
mongoose.connect(uri, {
    useNewUrlParser:true,
    useUnifiedTopology:true,
    poolSize: 20,
})
//connection test
mongoose.connection.on('connected', () => {
    console.log('mongoose is connected to userdata db')
})
}
//schema
const DataSchema = new mongoose.Schema({
    username: String,
    password: String,
    chats: Array,
    sender: String,
    text: String,
    usertoken: Number,
    time: Number,
    settings: Number
})
//model
const users = mongoose.model('users', DataSchema);
const usertoken = mongoose.model('usertoken', DataSchema)
const theboys = mongoose.model('chat.theboys', DataSchema);
const regulars = mongoose.model('chat.regulars', DataSchema);
module.exports = {main, users, usertoken, theboys, regulars}
