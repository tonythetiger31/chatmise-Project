const mongoose = require('mongoose');
exports.main =  function(uri){
mongoose.connect(uri, {
    useNewUrlParser:true,
    useUnifiedTopology:true
}) 
mongoose.connection.on('connected', () => {
    console.log('mongoose is connected!!!!')
})
//schema
}
const schema = mongoose.schema
const DataSchema = new mongoose.Schema({
    username: String,
    password: String,
    usertoken: Number,
    text: String,
    time: Number,
    sender: String,
    settings: Number
})
exports.DataPost = mongoose.model('DataPost', DataSchema);//model
exports.usertoken = mongoose.model('usertoken', DataSchema)
exports.texts = mongoose.model('texts', DataSchema)