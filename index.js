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
const textsDir = require('./routes/texts-route')
const database = require('./database')
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

//=================================================================================database
database.main(uri)
const DataPost = database.DataPost
const usertoken = database.usertoken
const texts = database.texts
//=============================================================================server info/ start server
const PORT = process.env.PORT || 80; 
app.listen(PORT, () => console.log('server started on port ' + PORT));
//app.use(express.static('views'))
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
app.get('/', mainDir.main)
app.get('/login', loginDir.get)
/*app.get('/register',(request, response) =>{
    response.render('register.ejs')
});*/
//=============================================================================page directorys un-rendered
//=========================================/TEXTS
app.put('/texts', textsDir.put)
app.get('/texts', textsDir.get)
app.post('/texts', textsDir.post)
//=========================================/USERCOUNT
app.post('/Ucount', (request, response) =>{
    S.push(request.headers.cookie);
    response.send(U);
});
//=========================================/loginPost
app.post('/login', loginDir.post)
//=========================================/LOGOUT
app.delete('/logout', logoutDir.main)
//=========================================/theme
app.post('/theme', themeDir.themePost)
app.get('/theme', themeDir.themeGet)
//=============================================================================setinterval functions
setInterval(uchange, 5000);
//=============================================================================exports
//node index.js