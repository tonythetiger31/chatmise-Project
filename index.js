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
//npm
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt')
const { request, response, json, Router } = require('express');
const app = express();
require('dotenv').config()
//eviorment variables
const uri = process.env.uri
//project files
const textsFunc = require('./routes/texts-route')
const database = require('./database')
const theme = require('./routes/theme')
//
app.use(express.urlencoded({
    extended: true
  })) 
//header_options
app.disable('x-powered-by');  
//=================================================================================database
database.main(uri)
const DataPost = database.DataPost
const usertoken = database.usertoken
const texts = database.texts
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
    //counts number of active users
    L = undefined;F = undefined;E = []
    for (i = 0; i < S.length; i++){//leaves only a array [] for each text, still multidementional 
        E.push(S[i].string)}
    F = E.filter((item, i, ar) => ar.indexOf(item) === i);
    L = F.length 
    //console.log('users = ' + L)
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
//=========================================/TEXTS
app.post('/texts', textsFunc.main)
//=========================================/USERCOUNT
app.post('/Ucount', (request, response) =>{
    S.push(request.body);
    response.send(U);
});
//=========================================/AUTHENTICATION
app.post('/authentication', (request, response) => {
    var username = request.body.username
    var password = request.body.password
    var userId = request.body.userId
    console.log(request.body)
    DataPost.find({
            username: username
        })
        .then((data) => {
            if (data == '') {
                response.send('Wrong password or Username')
            } else {
                if (data[0].password === password) {
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
                } else {
                    response.send('Wrong password or Username')
                }
            }
        })
})
//=========================================/AUTHORISATION
app.post('/userauth', (request, response) => {
    var cookie = request.body.cook
    if (cookie === undefined || cookie === null || cookie === '') {
        console.log('denied1')
        response.send({
            "access": "denied"
        })
    } else {
        usertoken.find({
                usertoken: cookie
            })
            .then((data) => {
                if (data == '') {
                    console.log('denied2')
                    response.send({
                        "access": "denied"
                    })
                } else {
                    if (data[0].usertoken == cookie) {
                        var usernameresponse = data[0].username
                        response.send({
                            access: 'granted',
                            username: usernameresponse
                        })
                    }
                }
            })
    }
})
//=========================================/LOGOUT
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
//=========================================/themeset
app.post('/themeset', theme.themeset)
//=========================================/themeget
app.post('/themeget', theme.themeget) 
//=============================================================================setinterval functions
setInterval(uchange, 5000);
//node index.js