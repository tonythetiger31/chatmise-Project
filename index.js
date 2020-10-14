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
//_______________________________________________________|
//____________________________________|package decleration
//_______________________________________________________|
//npm
"use strict"
const express = require('express');
const mongoose = require('mongoose');
//const bcrypt = require('bcrypt')
const ejs = require('ejs')
const { request, response, json, Router } = require('express');
const app = express();
require('dotenv').config()
//eviorment variables
const uriuserdata = process.env.uriuserdata
const urichatrooms = process.env.urichatrooms
//project files
const textsDir = require('./routes/texts-route')
const userdb = require('./db_config/db_userdata')
// const chatroomdb = require('./db_config/db_chatrooms')
const themeDir = require('./routes/theme-route')
const methods = require('./methods')
const mainDir = require('./routes/main-route')
const loginDir = require('./routes/login-route')
const logoutDir = require('./routes/logout-route')
//
app.use(express.urlencoded({
    extended: true
  })) 
//header_options
app.disable('x-powered-by');  
//_______________________________________________________|
//_______________________________________________|database
//_______________________________________________________|
userdb.main(uriuserdata)
var users = userdb.users
var usertoken = userdb.usertoken
var texts = userdb.texts
//_______________________________________________________|
//______________________________|server info/ start server
//_______________________________________________________|
const PORT = process.env.PORT || 80; 
app.listen(PORT, () => console.log('server started on port ' + PORT));
//app.use(express.static('views'))
app.use(express.static('views'))
app.use(express.json())
app.use(require('express-status-monitor')());
//_______________________________________________________|
//________________________________________|var decleration
//_______________________________________________________|
var S = []
var U = '1';
var F
//_______________________________________________________|
//___________________________________|function decleration
//_______________________________________________________|
function uChange(){
    //counts number of active users
    try{
    F = undefined
    F = S.filter((item, i, ar) => ar.indexOf(item) === i);//removes duplicates
    F = F.length 
    console.log(F, 'active users')
    U = F
    U = U.toString()
    S = []
    }
    catch(err){
        S = []
        F = undefined
    }
}
//_______________________________________________________|
//_______________________________|page directorys rendered
//_______________________________________________________|
app.get('/', mainDir.main)
app.get('/login', loginDir.get)
/*app.get('/register',(request, response) =>{
    response.render('register.ejs')
});*/
//_______________________________________________________|
//____________________________|page directorys un-rendered
//_______________________________________________________|
//=========================================/TEXTS
app.put('/texts', textsDir.put)
app.get('/texts/:chat', textsDir.get)
app.post('/texts', textsDir.post)
//=========================================/USERCOUNT
app.post('/Ucount', (request, response) =>{
    S.push(methods.cookieParse(request.headers.cookie, "userId"));
    response.status(200)
    response.send(U);
});
//=========================================/loginPost
app.post('/login', loginDir.post)
//=========================================/LOGOUT
app.delete('/logout', logoutDir.main)
//=========================================/theme
app.post('/theme', themeDir.post)
app.get('/theme', themeDir.get)
//_______________________________________________________|
//__________________________________|setinterval functions
//_______________________________________________________|
setInterval(uChange, 5000);
//==========notes
//node index.js
//localhost/status