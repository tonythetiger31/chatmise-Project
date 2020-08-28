/*contents
-package decelaration
-database
-server info/ start server
-var decleration
-function decleration
-page directorys rendered
-page directorys un-rendered
-setinterval functions
-exports
*/
//=============================================================================package decleration
//npm
const express = require('express');
const mongoose = require('mongoose');
//const bcrypt = require('bcrypt')
const ejs = require('ejs')
const { request, response, json, Router } = require('express');
const app = express();
require('dotenv').config()
//eviorment variables
const uri = process.env.uri
//project files
const textsFunc = require('./routes/texts-route')
const database = require('./database')
const theme = require('./routes/theme')
const methods = require('./methods')
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
const PORT = process.env.PORT || 80; 
app.listen(PORT, () => console.log('server started on port ' + PORT));
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
    var cookie = request.headers.cookie
    if (cookie === undefined || cookie === null || cookie === '') {
        response.status(403)
        response.redirect('/login');
    } else {
        if (cookie.length > 50) {
            response.redirect('/login');
         } else {
            var cookie = methods.cookieParse(request.headers.cookie, 'userId')
            if (cookie === undefined || cookie === null || cookie === '') {
                console.log('denied1')
                response.status(403)
                response.redirect('/login');
            } else {
                usertoken.find({
                        usertoken: cookie
                    })
                    .then((data) => {
                        if (data == '') {
                            console.log('denied2')
                            response.status(403)
                            response.redirect('/login');
                        } else if (data[0].usertoken == cookie) {
                            username = data[0].username
                            response.render('index.ejs', {username: username})
                            response.status(200)
                        }
                    })
            }
        }
    }
});
app.get('/login',(request, response) =>{
    response.render('Login.ejs')
});
/*app.get('/register',(request, response) =>{
    response.render('register.ejs')
});*/
//=============================================================================page directorys un-rendered
//=========================================/TEXTS
app.post('/texts', textsFunc.post)
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
    if (request.body.username.length > 25
        || request.body.password.length > 25
        || request.body.userId.length > 25){
            response.send('one or multiple of your inputs was too long, max size is 25 characters')
        }else{
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
    }
})
//=========================================/LOGOUT
app.delete('/logout', (request, response) => {
    var cookie = request.headers.cookie
    cookie = methods.cookieParse(cookie, 'userId')
    cookie = Number(cookie)
    console.log(cookie)
    usertoken.findOneAndRemove({usertoken: cookie}, function (err, ){
        console.log(cookie)
        if(err){
            console.log('error')  
            response.status(400)
        }
        else{
            console.log('success')
            response.status(200)
        }
    });
})
//=========================================/themeset
app.post('/themeset', theme.themeset)
//=========================================/themeget
app.post('/themeget', theme.themeget) 
//



//=============================================================================setinterval functions
setInterval(uchange, 5000);
//=============================================================================exports
//node index.js