/*contents
-package declaration
-database
-server info/ start server
-var declaration
-function declaration
-page directories rendered
-page directories un-rendered
-setInterval functions
*/                                                                                                                                                                                                                                                                                                             
//_______________________________________________________|
//____________________________________|package declaration
//_______________________________________________________|
"use strict"
//dependencies
const express = require('express')
const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server)
var path = require('path')
//env variables
require('dotenv').config()
//project files
const
textsDir = require('./routes/texts/texts'),
themeDir = require('./routes/theme'),
methods = require('./methods'),
mainDir = require('./routes/app'),
loginDir = require('./routes/login'),
logoutDir = require('./routes/logout'),
signupDir = require('./routes/signup')
//
app.use(express.urlencoded({
    extended: true
  })) 
//header_options
app.disable('x-powered-by');  
//_______________________________________________________|
//______________________________|server info/ start server
//_______________________________________________________|
const PORT = process.env.PORT || 80; 
server.listen(PORT, () => console.log('--server started on port ' + PORT));
app.use(express.static('views'))
app.use(express.json())
//_______________________________________________________|
//________________________________________|var declaration
//_______________________________________________________|
var S = [],
    U = '1',
    F
//_______________________________________________________|
//___________________________________|function declaration
//_______________________________________________________|
function uChange() {
    //counts number of active users
    try {
        F = undefined
        F = S.filter((item, i, ar) => ar.indexOf(item) === i);//removes duplicates
        F = F.length
        console.log(F, 'active users')
        U = F
        U = U.toString()
        S = []
    }
    catch (err) {
        S = []
        F = undefined
    }
}
//_______________________________________________________|
//_______________________________|page directories rendered
//_______________________________________________________|
app.get('/', mainDir.main)
app.get('/login', loginDir.get)
app.get('/signup', signupDir.get);
app.get('/admin',signupDir.get);
//_______________________________________________________|
//____________________________|page directories un-rendered
//_______________________________________________________|
//=========================================/sockets
io.on('connection', textsDir.sockets)
//=========================================/USER COUNT
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
//__________________________________|setInterval functions
//_______________________________________________________|
setInterval(uChange, 5000);