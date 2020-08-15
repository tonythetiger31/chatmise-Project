/*contents
-package decelaration
-database
-server info/ start server
-var decleration
-function decleration
-page directorys rendered
-page directorys un-rendered
-setinterval functions
*/


//=============================================================================package decleration
const express = require('express');
const mongoose = require('mongoose');
const { request, response, json } = require('express');
const app = express();
//
app.use(express.urlencoded({
    extended: true
  })) 
//=================================================================================database
const uri = 'mongodb+srv://user:w1USbmlx1czTHgBR@my-very-first-cluster.x6gyx.gcp.mongodb.net/messaging?retryWrites=true&w=majority'
mongoose.connect(uri, {
    useNewUrlParser:true,
    useUnifiedTopology:true
}) 
mongoose.connection.on('connected', () => {
    console.log('mongoose is connected!!!!')
})
//schema
const schema = mongoose.schema
const DataSchema = new mongoose.Schema({
    username: String,
    password: String
})/*
const DataPost = mongoose.model('DataPost', DataSchema);//model
var omg = "Lee"
var fpw = 'ta3DK4sRD4b5cz'
DataPost.find({ username: omg})
.then((data)=>{
   if (data == ''){
        console.log('-query not found')
   }else {
       console.log('username correct')
       if (data[0].password == fpw){
        console.log('succsessfull login')
       }else{
           console.log('password incorect')
       }
   }
    
})
*/
//instanse
/*const datadb = {
    title: 'yo wasup',
    body: 'my name is tony'
}
const newDataPost = new DataPost(datadb);
newDataPost.save((error) => {
    if (error) {
        console.log('somthing happened witht the db')
    } else {
        console.log('data has been saved')
    }
})*/
//=============================================================================server info/ start server
const port = process.env.Port || 3000; 
app.listen(port, () => console.log('server started on port ' + port));
app.use(express.static('views'))  
app.use(express.json()) 
//=============================================================================var decleration
var data = [{ text: 'Start of the conversation', time: 1595995547750, sender:'server'}]
var S = []
var U = '1';
var F
var L
var E = []
var A = [];
var onlyuid = []//only uid not username
const allusers = [
    {"username" : "Tony","password" : "HY76365g4q65g4"},
    {"username" : "Lee","password" : "ta3DK4sRD4b5cz"},
    {"username" : "Finn","password" : "Km3reCY3qrEANG"},
    {"username" : "Blaise","password" : "raognS39hdAz7H"} 
]
const allUid = []//username and uid
//=============================================================================function decleration
function uchange(){
    L = undefined
    F = undefined
    E = []
    for (i = 0; i < S.length; i++){//leaves only a array [] for each text, still multidementional 
        E.push(S[i].string)
    }
    F = E.filter((item, i, ar) => ar.indexOf(item) === i);
    
    L = F.length 
    console.log('users = ' + L)
    U = L
    U = U.toString()
    S = []
} 
function pushUsers(){
    for (i = 0; i < allusers.length ; i++){
        A.push(allusers[i].username)
    }
}
function pushUid(){
    for (i = 0; i < allUid.length ; i++){
        onlyuid.push(allUid[i].uid)
        onlyuid = removeDuplicates(onlyuid)
    }
}
function removeDuplicates(data){
    return data.filter((value, index) => data.indexOf (value) === index);
}
//=============================================================================page directorys rendered
app.get('/',(request, response) =>{
    response.render('index.html')
});
app.get('/login',(request, response) =>{
    response.render('Login.ejs')
});
app.get('/register',(request, response) =>{
    response.render('register.ejs')
});
//=============================================================================page directorys un-rendered
app.post('/api',(request, response) =>{
    if (Object.keys(request.body).length !== 0){
        data.push(request.body);
        console.log('new transmiton----')
        console.log(request.body)
    }
    response.send(data);
});
app.post('/Ucount', (request, response) =>{
    S.push(request.body);
    response.send(U);
});
//=========================================/AUTHENTICATION
pushUsers()
app.post('/authentication', (request, response) =>{
    var username = request.body.username
    var password = request.body.password
    var userId = request.body.userId
    if (A.indexOf(username) != -1){
        var B = A.indexOf(username)
        if (password == allusers[B].password){
            allUid.push({uid: userId, username: username})
            console.log(allUid)
            response.send('correct password and username')
        } else {
            response.send('Wrong password or Username')
        }
    }else{
        response.send('Wrong password or Username')
    }
})
app.post('/userauth', (request, response) =>{
    pushUid()
    var cookie = request.body.cook
    if (onlyuid.indexOf(cookie) != -1){
        var C = onlyuid.indexOf(cookie)
        var usernameresponse  = allUid[C].username  
        response.send({access: 'granted', username: usernameresponse})
    }else{
        response.send({access: 'denied'})
    }
})
//=============================================================================setinterval functions
setInterval(uchange, 5000);

//node mynodejsproject.js