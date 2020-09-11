const mongoose = require('mongoose');
const main =  function(uri){
mongoose.connect(uri, {
    useNewUrlParser:true,
    useUnifiedTopology:true,
    server: {poolSize: 10}
})
//connection test
mongoose.connection.on('connected', () => {
    console.log('mongoose is connected to chatrooms db')
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
const texts = mongoose.model('main', DataSchema);
module.exports = {main, texts}