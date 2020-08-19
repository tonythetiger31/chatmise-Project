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
const uri = 'mongodb+srv://lkNCQEUVe9bN3L1Q:xv5n97R1YMuIkR9R@my-very-first-cluster.x6gyx.gcp.mongodb.net/<dbname>?retryWrites=true&w=majority'
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
    password: String,
    usertoken: Number,
    text: String,
    time: Number,
    sender: String,
})

const DataPost = mongoose.model('DataPost', DataSchema);//model
const usertoken = mongoose.model('usertoken', DataSchema)
const texts = mongoose.model('texts', DataSchema)



/*
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
//=============================================================================server info/ start server
const port = process.env.Port || 3000; 
app.listen(port, () => console.log('server started on port ' + port));
app.use(express.static('views'))  
app.use(express.json()) 
//=============================================================================var decleration
var S = []
var U = '1';
var F
var L
var E = []
var A = [];
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
/*app.get('/register',(request, response) =>{
    response.render('register.ejs')
});*/
//=============================================================================page directorys un-rendered
app.post('/texts',(request, response) =>{
    if (Object.keys(request.body).length !== 0){
        text = request.body.text
        time = request.body.time
        sender = request.body.sender
        console.log('new transmiton----',request.body,'------------')
        var datadb = {
            text: text,
            time: time,
            sender: sender
        }
        var newtexts = new texts(datadb);
        newtexts.save((error) => {
            if (error) {
                console.log('somthing happened witht the db -texts')
            } else {
                console.log('text saved')
            }
        })
    }
    texts.find({})
    .then((data)=>{
    response.send(data);
})
});
//=========================================/USERCOUNT
app.post('/Ucount', (request, response) =>{
    S.push(request.body);
    response.send(U);
});
//=========================================/AUTHENTICATION
app.post('/authentication', (request, response) =>{
    var username = request.body.username
    var password = request.body.password
    var userId = request.body.userId
    DataPost.find({ username: username})
    .then((data)=>{ 
        if (data == ''){
            response.send('Wrong password or Username')
        }else {
            if (data[0].password == password){
                var datadb = {
                    usertoken: userId,
                    username: username
                }
                var newusertoken = new usertoken(datadb);
                newusertoken.save((error) => {
                    if (error) {
                        console.log('somthing happened witht the db')
                    } else {
                        response.send('correct password and username')
                        console.log('user loged in')
                        console.log(userId)
                    }
                })
            }else{
                response.send('Wrong password or Username')
            }
        } 
     })
})
app.post('/userauth', (request, response) =>{
    var cookie = request.body.cook
    usertoken.find({ usertoken: cookie})
    .then((data)=>{ 
        if (data == ''){
            response.send({access: 'denied'})
        } else {
            if (data[0].usertoken == cookie){
                var usernameresponse = data[0].username
                response.send({access: 'granted', username: usernameresponse})
            }
        }
    })
})
app.delete('/logout', (request, response) => {

    var cookie = request.body.cook
   /*usertoken.find({ usertoken: cookie})
    .then((data)=>{
        console.log(data[0].usertoken)
     })*/
    usertoken.findOneAndRemove({usertoken: cookie}, function (err, ){
        if(err){
            console.log('error')  
            response.send('400')
        }
        else{
            console.log('success')
            response.send('200')
        }
    });
})
//=============================================================================setinterval functions
setInterval(uchange, 5000);

//node mynodejsproject.js