const mongoose = require('mongoose');
const main =  function(uri){
mongoose.connect(uri, {
    useNewUrlParser:true,
    useUnifiedTopology:true,
    server: {poolSize: 10}
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
    usertoken: Number,
    text: String,
    time: Number,
    sender: String,
    settings: Number
})
//model
const users = mongoose.model('users', DataSchema);
const usertoken = mongoose.model('usertoken', DataSchema)
const texts = mongoose.model('texts', DataSchema);
module.exports = {main, users, usertoken, texts}

